import { tailoredResumeSchema } from "@/lib/validations/tailored-resume";
import { buildResumeEvidence } from "./build-resume-evidence";
import type { ProfileSnapshot } from "@/types/resume-generation";

type EvidenceOwner = {
  sourceType: "workExperience" | "project";
  sourceId: string;
};

export function validateTailoredResume(
  data: unknown,
  snapshot: ProfileSnapshot,
) {
  const evidence = new Map(
    buildResumeEvidence(snapshot).map((item) => [item.evidenceId, item]),
  );

  const schema = tailoredResumeSchema.superRefine((draft, context) => {
    function checkReferences(
      section: "workExperiences" | "projects" | "skillIds",
      selectedIds: string[],
      availableIds: string[],
      requireAll: boolean,
    ) {
      const available = new Set(availableIds);
      const seen = new Set<string>();

      selectedIds.forEach((id, index) => {
        const path =
          section === "skillIds"
            ? [section, index]
            : [section, index, "sourceId"];

        if (!available.has(id)) {
          context.addIssue({
            code: "custom",
            path,
            message: "This entry does not exist in the profile snapshot.",
          });
        }

        if (seen.has(id)) {
          context.addIssue({
            code: "custom",
            path,
            message: "An entry cannot appear more than once.",
          });
        }

        seen.add(id);
      });

      if (requireAll && availableIds.some((id) => !seen.has(id))) {
        context.addIssue({
          code: "custom",
          path: [section],
          message: "The tailored resume must include every work experience.",
        });
      }
    }

    function checkEvidence(
      evidenceIds: string[],
      path: Array<string | number>,
      owner?: EvidenceOwner,
    ) {
      const seen = new Set<string>();

      evidenceIds.forEach((id, index) => {
        const source = evidence.get(id);
        const issuePath = [...path, "evidenceIds", index];

        if (seen.has(id)) {
          context.addIssue({
            code: "custom",
            path: issuePath,
            message: "Duplicate evidence reference.",
          });
        }

        seen.add(id);

        if (!source) {
          context.addIssue({
            code: "custom",
            path: issuePath,
            message: "Evidence does not exist in this snapshot.",
          });
          return;
        }

        if (
          owner &&
          (source.sourceType !== owner.sourceType ||
            source.sourceId !== owner.sourceId)
        ) {
          context.addIssue({
            code: "custom",
            path: issuePath,
            message: "Evidence must belong to the same job or project.",
          });
        }
      });
    }

    checkReferences(
      "workExperiences",
      draft.workExperiences.map((entry) => entry.sourceId),
      snapshot.workExperiences.map((entry) => entry.id),
      true,
    );

    checkReferences(
      "projects",
      draft.projects.map((entry) => entry.sourceId),
      snapshot.projects.map((entry) => entry.id),
      false,
    );

    checkReferences(
      "skillIds",
      draft.skillIds,
      snapshot.skills.map((entry) => entry.id),
      false,
    );

    draft.summary?.forEach((statement, index) => {
      checkEvidence(statement.evidenceIds, ["summary", index]);
    });

    draft.workExperiences.forEach((entry, entryIndex) => {
      if (entry.emphasis === "brief" && entry.bulletPoints.length > 1) {
        context.addIssue({
          code: "custom",
          path: ["workExperiences", entryIndex, "bulletPoints"],
          message: "A brief work experience can contain at most one bullet.",
        });
      }

      entry.bulletPoints.forEach((bullet, bulletIndex) => {
        checkEvidence(
          bullet.evidenceIds,
          ["workExperiences", entryIndex, "bulletPoints", bulletIndex],
          {
            sourceType: "workExperience",
            sourceId: entry.sourceId,
          },
        );
      });
    });

    draft.projects.forEach((entry, entryIndex) => {
      entry.bulletPoints.forEach((bullet, bulletIndex) => {
        checkEvidence(
          bullet.evidenceIds,
          ["projects", entryIndex, "bulletPoints", bulletIndex],
          {
            sourceType: "project",
            sourceId: entry.sourceId,
          },
        );
      });
    });

    const summaryText =
      draft.summary?.map((statement) => statement.text).join(" ") ?? "";

    const wordCount = summaryText.trim()
      ? summaryText.trim().split(/\s+/u).length
      : 0;

    if (wordCount > 70) {
      context.addIssue({
        code: "custom",
        path: ["summary"],
        message: "The summary must contain no more than 70 words.",
      });
    }
  });

  return schema.safeParse(data);
}
