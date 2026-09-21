"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/skill-schema";
import { skillSchema } from "@/lib/validations/skill";
import type { SkillActionResult } from "@/types/skill";

const skillIdSchema = z.uuid();

const unavailableResult: SkillActionResult = {
  success: false,
  message: "This skill is unavailable. Refresh the page and try again.",
};

function isUniqueViolation(error: unknown): boolean {
  let current = error;

  for (let depth = 0; depth < 5; depth += 1) {
    if (typeof current !== "object" || current === null) {
      return false;
    }

    if ("code" in current && current.code === "23505") {
      return true;
    }

    current = "cause" in current ? current.cause : undefined;
  }

  return false;
}

export async function saveSkill(
  skillId: string | null,
  formData: FormData,
): Promise<SkillActionResult> {
  const user = await requireUser();

  if (skillId !== null && !skillIdSchema.safeParse(skillId).success) {
    return unavailableResult;
  }

  const parsed = skillSchema.safeParse(
    formData instanceof FormData
      ? {
          name: formData.get("name") ?? "",
          category: formData.get("category") ?? "",
        }
      : null,
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Check your skill details and try again.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    if (skillId === null) {
      await db.insert(skills).values({
        ...parsed.data,
        userId: user.id,
      });
    } else {
      const [updatedSkill] = await db
        .update(skills)
        .set({
          ...parsed.data,
          updatedAt: new Date(),
        })
        .where(and(eq(skills.id, skillId), eq(skills.userId, user.id)))
        .returning({ id: skills.id });

      if (!updatedSkill) {
        return unavailableResult;
      }
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        success: false,
        message: "That skill is already in your profile.",
        fieldErrors: {
          name: ["Use a different name or edit the existing skill."],
        },
      };
    }

    return {
      success: false,
      message: "Unable to save this skill. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: skillId === null ? "Skill added." : "Skill updated.",
  };
}

export async function deleteSkill(skillId: string): Promise<SkillActionResult> {
  const user = await requireUser();
  const parsedId = skillIdSchema.safeParse(skillId);

  if (!parsedId.success) {
    return unavailableResult;
  }

  try {
    const [deletedSkill] = await db
      .delete(skills)
      .where(and(eq(skills.id, parsedId.data), eq(skills.userId, user.id)))
      .returning({ id: skills.id });

    if (!deletedSkill) {
      return unavailableResult;
    }
  } catch {
    return {
      success: false,
      message: "Unable to delete this skill. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Skill deleted.",
  };
}
