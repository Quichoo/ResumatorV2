"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { certifications } from "@/lib/db/certification-schema";
import { certificationSchema } from "@/lib/validations/certification";
import type { CertificationActionResult } from "@/types/certification";

const certificationIdSchema = z.uuid();

const unavailableResult: CertificationActionResult = {
  success: false,
  message: "This certification is unavailable. Refresh the page and try again.",
};

export async function saveCertification(
  certificationId: string | null,
  formData: FormData,
): Promise<CertificationActionResult> {
  const user = await requireUser();

  if (
    certificationId !== null &&
    !certificationIdSchema.safeParse(certificationId).success
  ) {
    return unavailableResult;
  }

  const parsed = certificationSchema.safeParse(
    formData instanceof FormData
      ? {
          name: formData.get("name") ?? "",
          issuer: formData.get("issuer") ?? "",
          issueYear: formData.get("issueYear") ?? "",
          credentialId: formData.get("credentialId") ?? "",
          credentialUrl: formData.get("credentialUrl") ?? "",
          description: formData.get("description") ?? "",
        }
      : null,
  );

  if (!parsed.success) {
    return {
      success: false,
      message: "Correct the highlighted fields and try again.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    if (certificationId === null) {
      await db.insert(certifications).values({
        ...parsed.data,
        userId: user.id,
      });
    } else {
      const [updated] = await db
        .update(certifications)
        .set({
          ...parsed.data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(certifications.id, certificationId),
            eq(certifications.userId, user.id),
          ),
        )
        .returning({ id: certifications.id });

      if (!updated) {
        return unavailableResult;
      }
    }
  } catch {
    return {
      success: false,
      message: "Unable to save this certification. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message:
      certificationId === null
        ? "Certification added."
        : "Certification updated.",
  };
}

export async function deleteCertification(
  certificationId: string,
): Promise<CertificationActionResult> {
  const user = await requireUser();
  const parsedId = certificationIdSchema.safeParse(certificationId);

  if (!parsedId.success) {
    return unavailableResult;
  }

  try {
    const [deleted] = await db
      .delete(certifications)
      .where(
        and(
          eq(certifications.id, parsedId.data),
          eq(certifications.userId, user.id),
        ),
      )
      .returning({ id: certifications.id });

    if (!deleted) {
      return unavailableResult;
    }
  } catch {
    return {
      success: false,
      message: "Unable to delete this certification. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Certification deleted.",
  };
}
