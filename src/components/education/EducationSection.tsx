import { Anchor, Group, Paper, Stack, Text, Title } from "@mantine/core";
import EducationCard from "@/components/education/EducationCard";
import EducationEditor from "@/components/education/EducationEditor";
import ErrorMessage from "@/components/ui/ErrorMessage";
import DeleteEducationButton from "@/components/education/DeleteEducationButton";
import { getEducationEntries } from "@/lib/queries/education";

export default async function EducationSection() {
  const result = await getEducationEntries();

  return (
    <section aria-labelledby="education-heading">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4} style={{ flex: 1, minWidth: 240 }}>
            <Title id="education-heading" order={2} size="h3">
              Education
            </Title>

            <Text size="sm" c="dimmed">
              Your schools, qualifications, and relevant coursework.
            </Text>
          </Stack>

          {result.success && <EducationEditor />}
        </Group>

        {!result.success ? (
          <Stack gap="sm">
            <ErrorMessage
              title="Education unavailable"
              message={result.message}
            />

            <Anchor href="/profile" size="sm" c="blue.8">
              Reload profile
            </Anchor>
          </Stack>
        ) : result.entries.length === 0 ? (
          <Paper withBorder p="lg" radius="md">
            <Stack gap={4}>
              <Text fw={500}>No education added yet</Text>

              <Text size="sm" c="dimmed">
                Add your first school or qualification to get started.
              </Text>
            </Stack>
          </Paper>
        ) : (
          <Stack gap="md">
            {result.entries.map((entry) => (
              <EducationCard
                key={entry.id}
                entry={entry}
                actions={
                  <>
                    <EducationEditor entry={entry} />
                    <DeleteEducationButton entry={entry} />
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
