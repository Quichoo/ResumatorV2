import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const profiles = pgTable("profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),

  fullName: text("full_name").notNull(),
  contactEmail: text("contact_email").notNull(),

  phone: text("phone"),
  location: text("location"),
  portfolioUrl: text("portfolio_url"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  summary: text("summary"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
