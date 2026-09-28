import type { TailoredResumeDraft } from "@/types/resume-generation";

export function normalizeTailoredResume(draft: TailoredResumeDraft) {
  return {
    summary:
      draft.summary?.map((statement) => statement.text).join(" ") ?? null,

    workExperiences: draft.workExperiences.map((entry) => ({
      sourceId: entry.sourceId,
      emphasis: entry.emphasis,
      bulletPoints: entry.bulletPoints.map((bullet) => bullet.text),
    })),

    projects: draft.projects.map((entry) => ({
      sourceId: entry.sourceId,
      bulletPoints: entry.bulletPoints.map((bullet) => bullet.text),
    })),

    skillIds: draft.skillIds,
  };
}
