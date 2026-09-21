import "server-only";

import { asc, eq, sql } from "drizzle-orm";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { skills } from "@/lib/db/skill-schema";
import type { Skill } from "@/types/skill";

export async function getSkills() {
  const user = await requireUser();

  try {
    const userSkills: Skill[] = await db
      .select({
        id: skills.id,
        name: skills.name,
        category: skills.category,
      })
      .from(skills)
      .where(eq(skills.userId, user.id))
      .orderBy(sql`lower(${skills.name})`, asc(skills.id));

    return {
      success: true as const,
      skills: userSkills,
    };
  } catch {
    return {
      success: false as const,
      message: "Unable to load your skills. Please refresh and try again.",
    };
  }
}
