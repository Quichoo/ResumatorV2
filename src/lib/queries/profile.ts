import "server-only";

import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import type { ProfileFormValues } from "@/types/profile";

export async function getProfilePageData() {
  const user = await requireUser();

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id))
    .limit(1);

  const initialValues: ProfileFormValues = {
    fullName: profile?.fullName ?? user.name,
    contactEmail: profile?.contactEmail ?? user.email,
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    portfolioUrl: profile?.portfolioUrl ?? "",
    linkedinUrl: profile?.linkedinUrl ?? "",
    githubUrl: profile?.githubUrl ?? "",
    summary: profile?.summary ?? "",
  };

  return { user, initialValues };
}
