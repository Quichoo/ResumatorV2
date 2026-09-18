"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { workExperiences } from "@/lib/db/schema";
import { workExperienceSchema } from "@/lib/validations/work-experience";
import type { WorkExperienceActionResult } from "@/types/work-experience";

const experienceIdSchema = z.uuid();

const unavailableMessage =
  "This work experience is unavailable. Refresh the page and try again.";

function parseWorkExperienceForm(formData: FormData) {
  return workExperienceSchema.safeParse({
    jobTitle: formData.get("jobTitle"),
    companyName: formData.get("companyName"),
    location: formData.get("location") ?? "",
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") ?? "",
    isCurrent: formData.get("isCurrent") === "on",
    description: formData.get("description") ?? "",
  });
}

export async function createWorkExperience(
  formData: FormData,
): Promise<WorkExperienceActionResult> {
  const user = await requireUser();
  const result = parseWorkExperienceForm(formData);

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    await db.insert(workExperiences).values({
      ...result.data,
      userId: user.id,
    });
  } catch {
    return {
      success: false,
      message: "Unable to add your work experience. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Work experience added.",
  };
}

export async function updateWorkExperience(
  experienceId: string,
  formData: FormData,
): Promise<WorkExperienceActionResult> {
  const user = await requireUser();
  const parsedId = experienceIdSchema.safeParse(experienceId);

  if (!parsedId.success) {
    return {
      success: false,
      message: unavailableMessage,
    };
  }

  const result = parseWorkExperienceForm(formData);

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    const [updated] = await db
      .update(workExperiences)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(workExperiences.id, parsedId.data),
          eq(workExperiences.userId, user.id),
        ),
      )
      .returning({ id: workExperiences.id });

    if (!updated) {
      return {
        success: false,
        message: unavailableMessage,
      };
    }
  } catch {
    return {
      success: false,
      message: "Unable to update your work experience. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Work experience updated.",
  };
}

export async function deleteWorkExperience(
  experienceId: string,
): Promise<WorkExperienceActionResult> {
  const user = await requireUser();
  const parsedId = experienceIdSchema.safeParse(experienceId);

  if (!parsedId.success) {
    return {
      success: false,
      message: unavailableMessage,
    };
  }

  try {
    const [deleted] = await db
      .delete(workExperiences)
      .where(
        and(
          eq(workExperiences.id, parsedId.data),
          eq(workExperiences.userId, user.id),
        ),
      )
      .returning({ id: workExperiences.id });

    if (!deleted) {
      return {
        success: false,
        message: unavailableMessage,
      };
    }
  } catch {
    return {
      success: false,
      message: "Unable to delete your work experience. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Work experience deleted.",
  };
}
