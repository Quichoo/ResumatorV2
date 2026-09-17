import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const practiceProfiles = pgTable("practice_profiles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
