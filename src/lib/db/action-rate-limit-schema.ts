import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const actionRateLimits = pgTable(
  "action_rate_limits",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    action: text("action").notNull(),

    windowStartedAt: timestamp("window_started_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    attempts: integer("attempts").default(1).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.action],
    }),
  ],
);
