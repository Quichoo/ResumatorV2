import "server-only";

import type { ClientSession } from "eve/client";
import { createEveClient } from "@/lib/eve/client";
import { validateTailoredResume } from "@/lib/resume-generation/validate-tailored-resume";
import { tailoredResumeSchema } from "@/lib/validations/tailored-resume";
import { buildResumeEvidence } from "./build-resume-evidence";
import { buildTailoringMessage } from "./build-tailoring-message";
import type {
  JobSnapshot,
  ProfileSnapshot,
  TailoredResumeDraft,
} from "@/types/resume-generation";

const GENERATION_TIMEOUT_MS = 120_000;
const CLEANUP_TIMEOUT_MS = 5_000;
const MAX_ATTEMPTS = 2;

type TailoringFailureCode = "AI_TIMEOUT" | "AI_FAILED" | "INVALID_OUTPUT";

export class TailoringError extends Error {
  constructor(
    public readonly code: TailoringFailureCode,
    message: string,
  ) {
    super(message);
    this.name = "TailoringError";
  }
}

type GenerateTailoredResumeInput = {
  profileSnapshot: ProfileSnapshot;
  jobSnapshot: JobSnapshot;
};

// These additional checks apply to new generations only.
// Existing saved drafts continue using the shared validator.
function getSummarySourceIssues(
  draft: TailoredResumeDraft,
  snapshot: ProfileSnapshot,
): string[] {
  const evidence = new Map(
    buildResumeEvidence(snapshot).map((item) => [item.evidenceId, item]),
  );

  const issues: string[] = [];

  draft.summary?.forEach((statement, index) => {
    const owners = new Set<string>();
    let hasUnsupportedSource = false;

    for (const id of statement.evidenceIds) {
      const source = evidence.get(id);

      if (
        !source ||
        !source.sourceId ||
        (source.sourceType !== "workExperience" &&
          source.sourceType !== "project")
      ) {
        hasUnsupportedSource = true;
        continue;
      }

      owners.add(`${source.sourceType}:${source.sourceId}`);
    }

    if (hasUnsupportedSource) {
      issues.push(
        `summary[${index}]: Cite only work experience or project evidence. ` +
          "Do not use profile, skill, education, or certification references.",
      );
    }

    if (owners.size !== 1) {
      issues.push(
        `summary[${index}]: This sentence must describe and cite exactly ` +
          "one job or project. Separate claims from different entries, " +
          "or remove the unsupported claim.",
      );
    }
  });

  return issues;
}

export async function generateTailoredResume({
  profileSnapshot,
  jobSnapshot,
}: GenerateTailoredResumeInput): Promise<TailoredResumeDraft> {
  const client = createEveClient();

  // Both attempts share one deadline.
  const signal = AbortSignal.timeout(GENERATION_TIMEOUT_MS);

  let session: ClientSession | undefined;
  let message = buildTailoringMessage(profileSnapshot, jobSnapshot);

  try {
    const created = await client.sessions.create({ signal });
    session = created.session;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const response = await session.send<TailoredResumeDraft>(message, {
        outputSchema: tailoredResumeSchema,
        signal,
      });

      const result = await response.result();

      if (result.status === "failed" || result.data === undefined) {
        throw new TailoringError(
          "AI_FAILED",
          "The AI service could not finish generating your resume.",
        );
      }

      const parsed = validateTailoredResume(result.data, profileSnapshot);

      const issues = parsed.success
        ? getSummarySourceIssues(parsed.data, profileSnapshot)
        : parsed.error.issues.map(
            (issue) => `${issue.path.join(".") || "draft"}: ${issue.message}`,
          );

      if (parsed.success && issues.length === 0) {
        return parsed.data;
      }

      if (attempt === MAX_ATTEMPTS - 1) {
        throw new TailoringError(
          "INVALID_OUTPUT",
          "The generated resume still had validation issues after one correction attempt. Please try again.",
        );
      }

      message = [
        "Correct your previous structured resume draft.",
        "Use the same original source data and tailoring instructions.",
        "Return the complete corrected draft using the supplied schema.",
        "Preserve supported, specific work bullets unless a listed issue requires changing them.",
        "For each summary sentence, use evidence from exactly one job or project.",
        "Do not merely remove citations: rewrite the sentence so every claim belongs to that entry.",
        "Remove technologies, outcomes, or responsibilities not supported by its cited evidence.",
        "You may return summary as null if you cannot support it.",
        "The following JSON contains application validation feedback, not source facts:",
        JSON.stringify({ validationIssues: issues.slice(0, 20) }),
      ].join("\n\n");
    }

    throw new TailoringError(
      "INVALID_OUTPUT",
      "The generated resume did not pass validation.",
    );
  } catch (error) {
    if (signal.aborted) {
      throw new TailoringError(
        "AI_TIMEOUT",
        "Resume generation took too long. Please try again.",
      );
    }

    if (error instanceof TailoringError) {
      throw error;
    }

    throw new TailoringError(
      "AI_FAILED",
      "Unable to complete resume generation. Please try again.",
    );
  } finally {
    if (session) {
      try {
        await session.reset({
          reason: "Resume tailoring request finished.",
          signal: AbortSignal.timeout(CLEANUP_TIMEOUT_MS),
        });
      } catch {
        console.warn("Could not reset the resume tailoring session.");
      }
    }
  }
}
