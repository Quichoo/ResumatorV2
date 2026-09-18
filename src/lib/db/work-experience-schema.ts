import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const workExperiences = pgTable(
  "work_experiences",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    jobTitle: text("job_title").notNull(),
    companyName: text("company_name").notNull(),
    location: text("location"),

    startDate: date("start_date", { mode: "string" }).notNull(),
    endDate: date("end_date", { mode: "string" }),
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
    index("work_experiences_user_id_idx").on(table.userId),

    check(
      "work_experiences_date_order_check",
      sql`${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`,
    ),

    check(
      "work_experiences_current_end_date_check",
      sql`(
        (${table.isCurrent} = true AND ${table.endDate} IS NULL)
        OR
        (${table.isCurrent} = false AND ${table.endDate} IS NOT NULL)
      )`,
    ),
  ],
);
