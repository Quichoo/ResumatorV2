import { Paper, Stack, Text, Title } from "@mantine/core";
import { getResumes } from "@/lib/queries/resume";
import { AppLink } from "@/components/ui/AppLink";

export default async function ResumeList() {
  const result = await getResumes();

  if (!result.success) {
    throw new Error(result.message);
  }

  if (result.resumes.length === 0) {
    return (
      <Paper withBorder p="xl" radius="md">
        <Stack gap="xs">
          <Title order={2} size="h3">
            Your first resume starts here
          </Title>
          <Text c="dimmed">
            Create a resume and save the job posting you want to target.
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack gap="md">
      {result.resumes.map((resume) => (
        <Paper key={resume.id} withBorder p="lg" radius="md">
          <Stack gap={6}>
            <Title order={2} size="h3" style={{ overflowWrap: "anywhere" }}>
              {resume.title}
            </Title>

            <Text style={{ overflowWrap: "anywhere" }}>
              {resume.targetRole}
              {resume.companyName ? ` at ${resume.companyName}` : ""}
            </Text>

            <Text size="sm" c="dimmed">
              Updated{" "}
              <time dateTime={resume.updatedAt}>
                {new Intl.DateTimeFormat("en", {
                  dateStyle: "medium",
                  timeZone: "UTC",
                }).format(new Date(resume.updatedAt))}
              </time>
            </Text>

            <AppLink href={`/resumes/${resume.id}/edit`}>
              Edit job details
            </AppLink>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
