import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { practiceProfiles } from "../src/lib/db/schema";

config({ path: ".env.local" });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing from .env.local");
  }

  const client = neon(databaseUrl);
  const db = drizzle({ client });

  const [createdProfile] = await db
    .insert(practiceProfiles)
    .values({
      fullName: "Alex Santos",
    })
    .returning();

  if (!createdProfile) {
    throw new Error("The insert did not return a profile");
  }

  console.log("Profile inserted. Reading it from Neon...");

  const savedProfiles = await db
    .select()
    .from(practiceProfiles)
    .where(eq(practiceProfiles.id, createdProfile.id));

  console.table(savedProfiles);
}

main().catch(() => {
  console.error(
    "Database practice failed. Check your connection and configuration.",
  );
  process.exitCode = 1;
});
