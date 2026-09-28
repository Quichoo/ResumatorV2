import type { ProfileSnapshot } from "@/types/resume-generation";

export type WorkEvidenceItem = {
  evidenceId: string;
  sourceId: string;
  text: string;
};

export type WorkEvidenceEntry = {
  sourceId: string;
  jobTitle: string;
  companyName: string;
  evidence: WorkEvidenceItem[];
};

function splitDescription(description: string | null): string[] {
  if (!description) return [];

  return description
    .split(/\r\n|\n|\r/)
    .map((line) =>
      line
        .trim()
        .replace(/^(?:[-*•]\s+|\d+[.)]\s+)/, "")
        .trim(),
    )
    .filter((line) => line.length > 0);
}

export function buildWorkEvidence(
  experiences: ProfileSnapshot["workExperiences"],
): WorkEvidenceEntry[] {
  return experiences.map((experience) => {
    const lines = splitDescription(experience.description);

    return {
      sourceId: experience.id,
      jobTitle: experience.jobTitle,
      companyName: experience.companyName,
      evidence: lines.map((text, index) => ({
        evidenceId: `work:${experience.id}:description:${index + 1}`,
        sourceId: experience.id,
        text,
      })),
    };
  });
}
