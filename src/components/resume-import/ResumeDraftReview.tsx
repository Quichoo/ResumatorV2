"use client";

import { Stack, Text, Title } from "@mantine/core";
import ProfileFields from "@/components/profile/ProfileFields";
import EducationDraftSection from "@/components/resume-import/EducationDraftSection";
import ProjectDraftSection from "@/components/resume-import/ProjectDraftSection";
import ResumeDraftSummary from "@/components/resume-import/ResumeDraftSummary";
import ResumeImportControls from "@/components/resume-import/ResumeImportControls";
import SkillsDraftSection from "@/components/resume-import/SkillsDraftSection";
import WorkExperienceDraftSection from "@/components/resume-import/WorkExperienceDraftSection";
import ImportSelectionCard from "@/components/ui/ImportSelectionCard";
import { useResumeDraftReview } from "@/hooks/useResumeDraftReview";
import { useResumeImport } from "@/hooks/useResumeImport";
import type { ResumeDraft } from "@/types/resume-draft";

type ResumeDraftReviewProps = {
  initialDraft: ResumeDraft;
};

export default function ResumeDraftReview({
  initialDraft,
}: ResumeDraftReviewProps) {
  const review = useResumeDraftReview(initialDraft);
  const save = useResumeImport();

  const hasSelection =
    review.includeProfile ||
    review.work.selected.some(Boolean) ||
    review.education.selected.some(Boolean) ||
    review.projects.selected.some(Boolean) ||
    review.skills.selected.some(Boolean);

  return (
    <Stack gap="lg">
      {!save.isLocked && (
        <>
          <ResumeDraftSummary draft={review.summaryDraft} />

          <Text size="sm" c="dimmed">
            Changes are temporary until imported. Refreshing, leaving this page,
            or replacing the resume discards this draft.
          </Text>

          <Stack gap="md">
            <Title order={3}>Review personal details</Title>

            <Text size="sm" c="dimmed">
              Including personal details replaces your saved profile fields with
              these values. Blank optional fields clear existing values. Leave
              this unchecked to keep your current details.
            </Text>

            <ImportSelectionCard
              title="Personal details"
              selected={review.includeProfile}
              onSelectedChange={review.setIncludeProfile}
            >
              <ProfileFields
                values={review.profileValues}
                onValueChange={review.updateProfile}
              />
            </ImportSelectionCard>
          </Stack>

          <WorkExperienceDraftSection {...review.work} />
          <EducationDraftSection {...review.education} />
          <ProjectDraftSection {...review.projects} />
          <SkillsDraftSection {...review.skills} />
        </>
      )}

      <ResumeImportControls
        result={save.result}
        isPending={save.isPending}
        isLocked={save.isLocked}
        hasSelection={hasSelection}
        onSubmit={() => {
          void save.submit(review.getImportContent());
        }}
      />
    </Stack>
  );
}
