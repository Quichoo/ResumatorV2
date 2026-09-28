import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { resumes } from "./resume-schema";

export const resumeGenerations = pgTable(
  "resume_generations",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    resumeId: uuid("resume_id")
      .notNull()
      .references(() => resumes.id, { onDelete: "cascade" }),

    schemaVersion: integer("schema_version").default(1).notNull(),

    profileSnapshot: jsonb("profile_snapshot").notNull(),
    jobSnapshot: jsonb("job_snapshot").notNull(),

    status: text("status", {
      enum: ["pending", "running", "completed", "failed"],
    })
      .default("pending")
      .notNull(),

    generatedDraft: jsonb("generated_draft"),
    failureCode: text("failure_code"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (table) => [
    index("resume_generations_resume_id_created_at_idx").on(
      table.resumeId,
      table.createdAt,
    ),

    check(
      "resume_generations_status_check",
      sql`${table.status} IN ('pending', 'running', 'completed', 'failed')`,
    ),

    check(
      "resume_generations_schema_version_check",
      sql`${table.schemaVersion} >= 1`,
    ),

    check(
      "resume_generations_result_check",
      sql`
        (
          ${table.status} IN ('pending', 'running')
          AND ${table.generatedDraft} IS NULL
          AND ${table.failureCode} IS NULL
          AND ${table.finishedAt} IS NULL
        )
        OR
        (
          ${table.status} = 'completed'
          AND ${table.generatedDraft} IS NOT NULL
          AND ${table.failureCode} IS NULL
          AND ${table.finishedAt} IS NOT NULL
        )
        OR
        (
          ${table.status} = 'failed'
          AND ${table.generatedDraft} IS NULL
          AND ${table.failureCode} IS NOT NULL
          AND ${table.finishedAt} IS NOT NULL
        )
      `,
    ),
  ],
);
