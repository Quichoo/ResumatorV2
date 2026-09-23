import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const certifications = pgTable(
  "certifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    issuer: text("issuer").notNull(),

    issueYear: integer("issue_year"),
    credentialId: text("credential_id"),
    credentialUrl: text("credential_url"),
    description: text("description"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("certifications_user_id_idx").on(table.userId),

    check(
      "certifications_issue_year_check",
      sql`
        ${table.issueYear} IS NULL
        OR ${table.issueYear} BETWEEN 1000 AND 9999
      `,
    ),
  ],
);
