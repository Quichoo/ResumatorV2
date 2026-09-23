import { Alert, Badge, Group, Paper, Stack, Text } from "@mantine/core";
import type { ResumeDraft } from "@/types/resume-draft";

type ResumeDraftSummaryProps = {
  draft: ResumeDraft;
};

export default function ResumeDraftSummary({ draft }: ResumeDraftSummaryProps) {
  const sections = [
    { label: "Work experiences", count: draft.workExperiences.length },
    { label: "Education entries", count: draft.educationEntries.length },
    { label: "Projects", count: draft.projects.length },
    { label: "Skills", count: draft.skills.length },
  ];

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="md">
        <div>
          <Text fw={600} role="status">
            Draft extracted
          </Text>

          <Text size="sm" c="dimmed">
            Your saved profile has not changed.
          </Text>
        </div>

        <Stack gap={4}>
          <Text fw={500}>{draft.profile.fullName ?? "Name not found"}</Text>

          <Text size="sm" style={{ overflowWrap: "anywhere" }}>
            {draft.profile.contactEmail ?? "Email not found"}
          </Text>
        </Stack>

        <Group gap="xs">
          {sections.map((section) => (
            <Badge key={section.label} variant="light" color="blue">
              {section.label}: {section.count}
            </Badge>
          ))}
        </Group>

        {draft.skills.length > 0 && (
          <div>
            <Text size="sm" fw={500} mb="xs">
              Extracted skills
            </Text>

            <Group gap="xs">
              {draft.skills.map((skill, index) => (
                <Badge
                  key={`${skill.name}-${index}`}
                  variant="outline"
                  color="blue.8"
                >
                  {skill.name}
                </Badge>
              ))}
            </Group>
          </div>
        )}

        {draft.warnings.length > 0 && (
          <Alert color="yellow" title="Notes from the original extraction">
            <Stack gap="xs">
              {draft.warnings.map((warning, index) => (
                <Text key={index} size="sm">
                  {warning}
                </Text>
              ))}
            </Stack>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
