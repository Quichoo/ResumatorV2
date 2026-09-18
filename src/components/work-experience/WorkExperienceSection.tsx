import { Anchor, Group, Paper, Stack, Text, Title } from "@mantine/core";
import ErrorMessage from "@/components/ui/ErrorMessage";
import WorkExperienceCard from "@/components/work-experience/WorkExperienceCard";
import WorkExperienceEditor from "@/components/work-experience/WorkExperienceEditor";
import DeleteWorkExperienceButton from "@/components/work-experience/DeleteWorkExperienceButton";
import { getWorkExperiences } from "@/lib/queries/work-experience";

export default async function WorkExperienceSection() {
  const result = await getWorkExperiences();

  return (
    <section aria-labelledby="work-experience-heading">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4} style={{ flex: 1, minWidth: 240 }}>
            <Title id="work-experience-heading" order={2} size="h3">
              Work experience
            </Title>

            <Text size="sm" c="dimmed">
              Include jobs and internships that show your experience and
              achievements.
            </Text>
          </Stack>

          {result.success && <WorkExperienceEditor />}
        </Group>

        {!result.success ? (
          <Stack gap="sm">
            <ErrorMessage
              title="Work experience unavailable"
              message={result.message}
            />

            <Anchor href="/profile" size="sm" c="blue.8">
              Reload profile
            </Anchor>
          </Stack>
        ) : result.experiences.length === 0 ? (
          <Paper withBorder p="lg" radius="md">
            <Stack gap={4}>
              <Text fw={500}>No work experience yet</Text>

              <Text size="sm" c="dimmed">
                Add your first job or internship to get started.
              </Text>
            </Stack>
          </Paper>
        ) : (
          <Stack gap="md">
            {result.experiences.map((experience) => (
              <WorkExperienceCard
                key={experience.id}
                experience={experience}
                actions={
                  <>
                    <WorkExperienceEditor experience={experience} />
                    <DeleteWorkExperienceButton experience={experience} />
                  </>
                }
              />
            ))}
          </Stack>
        )}
      </Stack>
    </section>
  );
}
