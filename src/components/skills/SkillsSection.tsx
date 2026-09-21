import {
  Anchor,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import DeleteSkillButton from "@/components/skills/DeleteSkillButton";
import SkillEditor from "@/components/skills/SkillEditor";
import ErrorMessage from "@/components/ui/ErrorMessage";
import RecordCard from "@/components/ui/RecordCard";
import { getSkills } from "@/lib/queries/skill";

export default async function SkillsSection() {
  const result = await getSkills();

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start">
        <Stack gap={4} style={{ flex: 1, minWidth: 240 }}>
          <Title order={2} size="h3">
            Skills
          </Title>

          <Text size="sm" c="dimmed">
            Add the skills you want to highlight on your resumes.
          </Text>
        </Stack>

        {result.success && <SkillEditor />}
      </Group>

      {!result.success ? (
        <Stack gap="xs">
          <ErrorMessage title="Skills unavailable" message={result.message} />

          <Anchor href="/profile" size="sm">
            Try again
          </Anchor>
        </Stack>
      ) : result.skills.length === 0 ? (
        <Paper withBorder p="lg" radius="md">
          <Text size="sm" c="dimmed">
            Add your first skill to get started.
          </Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {result.skills.map((skill) => (
            <RecordCard
              key={skill.id}
              title={skill.name}
              subtitle={skill.category ?? undefined}
              actions={
                <>
                  <SkillEditor skill={skill} />
                  <DeleteSkillButton skill={skill} />
                </>
              }
            />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
