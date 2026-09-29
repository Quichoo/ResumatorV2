import { Paper, Stack, Text, Title } from "@mantine/core";
import ResumeDocument from "@/components/resumes/ResumeDocument";
import type { GeneratedResumeView } from "@/lib/queries/generated-resume";
import DownloadResumeButton from "@/components/resumes/DownloadResumeButton";

type GeneratedResumePreviewProps = {
  resume: GeneratedResumeView;
  resumeId: string;
};

export default function GeneratedResumePreview({
  resume,
  resumeId,
}: GeneratedResumePreviewProps) {
  return (
    <Stack id="generated-resume" gap="md" style={{ scrollMarginTop: 24 }}>
      <div>
        <Title order={2} size="h3">
          Generated draft
        </Title>

        <Text size="sm" c="dimmed">
          For {resume.job.targetRole}
          {resume.job.companyName ? ` at ${resume.job.companyName}` : ""}.{" "}
          Review the wording before using this resume.
        </Text>

        <Text size="xs" c="dimmed">
          This preview uses the profile and job details saved when generated.
        </Text>
      </div>
      <DownloadResumeButton resumeId={resumeId} />
      <Paper withBorder radius="md">
        <ResumeDocument resume={resume} />
      </Paper>
    </Stack>
  );
}
