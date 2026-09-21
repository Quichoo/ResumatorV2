import { sql } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    projectName: text("project_name").notNull(),

    description: text("description"),

    technologies: text("technologies")
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),

    bulletPoints: text("bullet_points")
      .array()
      .default(sql`ARRAY[]::text[]`)
      .notNull(),

    projectUrl: text("project_url"),
    repositoryUrl: text("repository_url"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [index("projects_user_id_idx").on(table.userId)],
);
