import { Paper, Stack, Text, Title } from "@mantine/core";
import ResumeDocument from "@/components/resumes/ResumeDocument";
import type { GeneratedResumeView } from "@/lib/queries/generated-resume";

type GeneratedResumePreviewProps = {
  resume: GeneratedResumeView;
  resumeId: string;
};

export default function GeneratedResumePreview({
  resume,
  resumeId,
}: GeneratedResumePreviewProps) {
  return (
    <Stack gap="md">
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
      <a href={`/api/resumes/${resumeId}/pdf`}>Download PDF</a>
      <Paper withBorder radius="md">
        <ResumeDocument resume={resume} />
      </Paper>
    </Stack>
  );
}
