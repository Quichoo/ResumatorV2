import { Paper, Stack, Text, Title } from "@mantine/core";
import ResumeUploadForm from "@/components/resume-import/ResumeUploadForm";

export default function ResumeImportSection() {
  return (
    <Paper
      component="section"
      aria-labelledby="resume-import-heading"
      withBorder
      p="lg"
      radius="md"
    >
      <Stack gap="lg">
        <Stack gap="xs">
          <Title id="resume-import-heading" order={2} size="h4">
            Start with your existing resume
          </Title>

          <Text size="sm" c="dimmed">
            Upload your resume and check the extracted text.
          </Text>
        </Stack>

        <ResumeUploadForm />
      </Stack>
    </Paper>
  );
}
