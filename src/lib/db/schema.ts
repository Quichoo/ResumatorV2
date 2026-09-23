import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const practiceProfiles = pgTable("practice_profiles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export * from "./auth-schema";
export * from "./profile-schema";
export * from "./work-experience-schema";
export * from "./education-schema";
export * from "./project-schema";
export * from "./skill-schema";
export * from "./action-rate-limit-schema";
export * from "./resume-import-schema";
