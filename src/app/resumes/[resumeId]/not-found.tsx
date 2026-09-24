import { Stack, Text } from "@mantine/core";
import ResumesPageShell from "@/components/resumes/ResumesPageShell";
import { AppLink } from "@/components/ui/AppLink";

export default function ResumeNotFound() {
  return (
    <ResumesPageShell
      title="Resume not found"
      description="This resume is unavailable."
    >
      <Stack gap="md">
        <Text>It may have been removed or belong to another account.</Text>
        <AppLink href="/resumes">Back to my resumes</AppLink>
      </Stack>
    </ResumesPageShell>
  );
}
