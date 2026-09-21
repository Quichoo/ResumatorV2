import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const educationEntries = pgTable(
  "education_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    schoolName: text("school_name").notNull(),
    degree: text("degree").notNull(),
    fieldOfStudy: text("field_of_study"),

    startYear: integer("start_year"),
    endYear: integer("end_year"),
    isCurrent: boolean("is_current").default(false).notNull(),

    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("education_entries_user_id_idx").on(table.userId),

    check(
      "education_entries_start_year_check",
      sql`
        ${table.startYear} IS NULL
        OR ${table.startYear} BETWEEN 1000 AND 9999
      `,
    ),

    check(
      "education_entries_end_year_check",
      sql`
        ${table.endYear} IS NULL
        OR ${table.endYear} BETWEEN 1000 AND 9999
      `,
    ),

    check(
      "education_entries_year_order_check",
      sql`
        ${table.startYear} IS NULL
        OR ${table.endYear} IS NULL
        OR ${table.endYear} >= ${table.startYear}
      `,
    ),

    check(
      "education_entries_current_end_year_check",
      sql`
        ${table.isCurrent} = false
        OR ${table.endYear} IS NULL
      `,
    ),
  ],
);
