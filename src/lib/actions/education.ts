"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { educationEntries } from "@/lib/db/schema";
import { educationSchema } from "@/lib/validations/education";
import type { EducationActionResult } from "@/types/education";

const educationIdSchema = z.uuid();

const unavailableMessage =
  "This education entry is unavailable. Refresh the page and try again.";

function parseEducationForm(formData: FormData) {
  return educationSchema.safeParse({
    schoolName: formData.get("schoolName"),
    degree: formData.get("degree"),
    fieldOfStudy: formData.get("fieldOfStudy") ?? "",
    startYear: formData.get("startYear") ?? "",
    endYear: formData.get("endYear") ?? "",
    isCurrent: formData.get("isCurrent") === "on",
    description: formData.get("description") ?? "",
  });
}

export async function createEducationEntry(
  formData: FormData,
): Promise<EducationActionResult> {
  const user = await requireUser();
  const result = parseEducationForm(formData);

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    await db.insert(educationEntries).values({
      ...result.data,
      userId: user.id,
    });
  } catch {
    return {
      success: false,
      message: "Unable to add your education entry. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Education entry added.",
  };
}

export async function updateEducationEntry(
  entryId: string,
  formData: FormData,
): Promise<EducationActionResult> {
  const user = await requireUser();
  const parsedId = educationIdSchema.safeParse(entryId);

  if (!parsedId.success) {
    return {
      success: false,
      message: unavailableMessage,
    };
  }

  const result = parseEducationForm(formData);

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    const [updated] = await db
      .update(educationEntries)
      .set({
        ...result.data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(educationEntries.id, parsedId.data),
          eq(educationEntries.userId, user.id),
        ),
      )
      .returning({ id: educationEntries.id });

    if (!updated) {
      return {
        success: false,
        message: unavailableMessage,
      };
    }
  } catch {
    return {
      success: false,
      message: "Unable to update your education entry. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Education entry updated.",
  };
}

export async function deleteEducationEntry(
  entryId: string,
): Promise<EducationActionResult> {
  const user = await requireUser();
  const parsedId = educationIdSchema.safeParse(entryId);

  if (!parsedId.success) {
    return {
      success: false,
      message: unavailableMessage,
    };
  }

  try {
    const [deleted] = await db
      .delete(educationEntries)
      .where(
        and(
          eq(educationEntries.id, parsedId.data),
          eq(educationEntries.userId, user.id),
        ),
      )
      .returning({ id: educationEntries.id });

    if (!deleted) {
      return {
        success: false,
        message: unavailableMessage,
      };
    }
  } catch {
    return {
      success: false,
      message: "Unable to delete your education entry. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Education entry deleted.",
  };
}
