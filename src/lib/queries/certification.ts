import "server-only";

import { asc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { certifications } from "@/lib/db/certification-schema";
import type { GetCertificationsResult } from "@/types/certification";

export async function getCertifications(): Promise<GetCertificationsResult> {
  const user = await requireUser();

  try {
    const entries = await db
      .select({
        id: certifications.id,
        name: certifications.name,
        issuer: certifications.issuer,
        issueYear: certifications.issueYear,
        credentialId: certifications.credentialId,
        credentialUrl: certifications.credentialUrl,
        description: certifications.description,
      })
      .from(certifications)
      .where(eq(certifications.userId, user.id))
      .orderBy(asc(certifications.name), asc(certifications.id));

    return {
      success: true,
      certifications: entries,
    };
  } catch {
    return {
      success: false,
      message: "Unable to load your certifications. Please try again.",
    };
  }
}
