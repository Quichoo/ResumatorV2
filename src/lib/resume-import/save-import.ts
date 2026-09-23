import "server-only";

import { createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { BatchItem } from "drizzle-orm/batch";
import { db } from "@/lib/db";
import {
  educationEntries,
  profiles,
  projects,
  resumeImports,
  skills,
  workExperiences,
} from "@/lib/db/schema";
import type { ValidatedResumeImport } from "@/types/resume-import";

export class ImportRequestConflictError extends Error {
  constructor() {
    super(
      "This import request was already used with different information. " +
        "Start a new import to save different details.",
    );
    this.name = "ImportRequestConflictError";
  }
}

export async function saveValidatedImport(
  userId: string,
  input: ValidatedResumeImport,
): Promise<"saved" | "already-imported"> {
  const { requestId, ...content } = input;

  const payloadHash = createHash("sha256")
    .update(JSON.stringify(content))
    .digest("hex");

  async function hasMatchingReceipt(): Promise<boolean> {
    const [receipt] = await db
      .select({ payloadHash: resumeImports.payloadHash })
      .from(resumeImports)
      .where(
        and(
          eq(resumeImports.userId, userId),
          eq(resumeImports.requestId, requestId),
        ),
      )
      .limit(1);

    if (!receipt) return false;

    if (receipt.payloadHash !== payloadHash) {
      throw new ImportRequestConflictError();
    }

    return true;
  }

  if (await hasMatchingReceipt()) {
    return "already-imported";
  }

  const statements: [BatchItem<"pg">, ...BatchItem<"pg">[]] = [
    db.insert(resumeImports).values({
      userId,
      requestId,
      payloadHash,
    }),
  ];

  if (content.profile !== null) {
    statements.push(
      db
        .insert(profiles)
        .values({
          ...content.profile,
          userId,
        })
        .onConflictDoUpdate({
          target: profiles.userId,
          set: {
            ...content.profile,
            updatedAt: new Date(),
          },
        }),
    );
  }

  if (content.workExperiences.length > 0) {
    statements.push(
      db.insert(workExperiences).values(
        content.workExperiences.map((entry) => ({
          ...entry,
          userId,
        })),
      ),
    );
  }

  if (content.educationEntries.length > 0) {
    statements.push(
      db.insert(educationEntries).values(
        content.educationEntries.map((entry) => ({
          ...entry,
          userId,
        })),
      ),
    );
  }

  if (content.projects.length > 0) {
    statements.push(
      db.insert(projects).values(
        content.projects.map((entry) => ({
          ...entry,
          userId,
        })),
      ),
    );
  }

  if (content.skills.length > 0) {
    statements.push(
      db
        .insert(skills)
        .values(
          content.skills.map((entry) => ({
            ...entry,
            userId,
          })),
        )
        .onConflictDoNothing(),
    );
  }

  try {
    await db.batch(statements);
  } catch (error) {
    // Another request may have committed this same import, or the
    // database may have committed before its response was interrupted.
    if (await hasMatchingReceipt()) {
      return "already-imported";
    }

    throw error;
  }

  return "saved";
}
