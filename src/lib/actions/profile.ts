"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { profileSchema } from "@/lib/validations/profile";
import type { SaveProfileResult } from "@/types/profile";

export async function saveProfile(
  formData: FormData,
): Promise<SaveProfileResult> {
  const user = await requireUser();

  const result = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    contactEmail: formData.get("contactEmail"),
    phone: formData.get("phone") ?? "",
    location: formData.get("location") ?? "",
    portfolioUrl: formData.get("portfolioUrl") ?? "",
    linkedinUrl: formData.get("linkedinUrl") ?? "",
    githubUrl: formData.get("githubUrl") ?? "",
    summary: formData.get("summary") ?? "",
  });

  if (!result.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  try {
    await db
      .insert(profiles)
      .values({
        ...result.data,
        userId: user.id,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          ...result.data,
          updatedAt: new Date(),
        },
      });
  } catch {
    return {
      success: false,
      message: "Unable to save your profile. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Your profile has been saved.",
  };
}
