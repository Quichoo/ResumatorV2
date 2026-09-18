import "server-only";

import { desc, eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { workExperiences } from "@/lib/db/schema";
import type { WorkExperience } from "@/types/work-experience";

export async function getWorkExperiences() {
  const user = await requireUser();

  try {
    const experiences: WorkExperience[] = await db
      .select({
        id: workExperiences.id,
        jobTitle: workExperiences.jobTitle,
        companyName: workExperiences.companyName,
        location: workExperiences.location,
        startDate: workExperiences.startDate,
        endDate: workExperiences.endDate,
        isCurrent: workExperiences.isCurrent,
        description: workExperiences.description,
      })
      .from(workExperiences)
      .where(eq(workExperiences.userId, user.id))
      .orderBy(
        desc(workExperiences.startDate),
        desc(workExperiences.createdAt),
      );

    return {
      success: true as const,
      experiences,
    };
  } catch {
    return {
      success: false as const,
      message: "Unable to load your work experience. Please try again.",
    };
  }
}
