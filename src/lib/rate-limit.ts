import "server-only";

import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { actionRateLimits } from "@/lib/db/action-rate-limit-schema";

type ConsumeActionAttemptOptions = {
  userId: string;
  action: string;
  limit: number;
  windowSeconds: number;
};

export async function consumeActionAttempt({
  userId,
  action,
  limit,
  windowSeconds,
}: ConsumeActionAttemptOptions): Promise<boolean> {
  const expired = sql`
    ${actionRateLimits.windowStartedAt}
    <= now() - (${windowSeconds}::double precision * interval '1 second')
  `;

  const accepted = await db
    .insert(actionRateLimits)
    .values({
      userId,
      action,
    })
    .onConflictDoUpdate({
      target: [actionRateLimits.userId, actionRateLimits.action],
      set: {
        windowStartedAt: sql`
          CASE WHEN ${expired}
            THEN now()
            ELSE ${actionRateLimits.windowStartedAt}
          END
        `,
        attempts: sql`
          CASE WHEN ${expired}
            THEN 1
            ELSE ${actionRateLimits.attempts} + 1
          END
        `,
      },
      setWhere: sql`
        (${expired}) OR ${actionRateLimits.attempts} < ${limit}
      `,
    })
    .returning({ userId: actionRateLimits.userId });

  return accepted.length > 0;
}
