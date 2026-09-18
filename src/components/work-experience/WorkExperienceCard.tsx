import type { ReactNode } from "react";
import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { formatMonth } from "@/lib/utils/format-month";
import type { WorkExperience } from "@/types/work-experience";

type WorkExperienceCardProps = {
  experience: WorkExperience;
  actions?: ReactNode;
};

export default function WorkExperienceCard({
  experience,
  actions,
}: WorkExperienceCardProps) {
  const endLabel = experience.endDate
    ? formatMonth(experience.endDate)
    : "Present";

  return (
    <Paper component="article" withBorder p="lg" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Title order={3} size="h4" style={{ overflowWrap: "anywhere" }}>
              {experience.jobTitle}
            </Title>

            <Text fw={500} style={{ overflowWrap: "anywhere" }}>
              {experience.companyName}
            </Text>
          </Stack>

          {experience.isCurrent && (
            <Badge color="blue" variant="light">
              Current
            </Badge>
          )}
        </Group>

        <Text size="sm" c="dimmed">
          {formatMonth(experience.startDate)} – {endLabel}
        </Text>

        {experience.location && (
          <Text size="sm" c="dimmed">
            {experience.location}
          </Text>
        )}

        {experience.description && (
          <Text
            size="sm"
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {experience.description}
          </Text>
        )}

        {actions && (
          <Group justify="flex-end" align="flex-start">
            {actions}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
