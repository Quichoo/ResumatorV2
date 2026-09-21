import "server-only";

import { desc, eq, sql } from "drizzle-orm";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { educationEntries } from "@/lib/db/schema";
import type { EducationEntry } from "@/types/education";

export async function getEducationEntries() {
  const user = await requireUser();

  try {
    const entries: EducationEntry[] = await db
      .select({
        id: educationEntries.id,
        schoolName: educationEntries.schoolName,
        degree: educationEntries.degree,
        fieldOfStudy: educationEntries.fieldOfStudy,
        startYear: educationEntries.startYear,
        endYear: educationEntries.endYear,
        isCurrent: educationEntries.isCurrent,
        description: educationEntries.description,
      })
      .from(educationEntries)
      .where(eq(educationEntries.userId, user.id))
      .orderBy(
        desc(educationEntries.isCurrent),
        sql`
          coalesce(
            ${educationEntries.endYear},
            ${educationEntries.startYear}
          ) desc nulls last
        `,
        desc(educationEntries.createdAt),
        desc(educationEntries.id),
      );

    return {
      success: true as const,
      entries,
    };
  } catch {
    return {
      success: false as const,
      message: "Unable to load your education entries. Please try again.",
    };
  }
}
