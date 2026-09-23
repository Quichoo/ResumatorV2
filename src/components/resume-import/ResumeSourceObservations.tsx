import { Paper, Stack, Text } from "@mantine/core";

type ResumeSourceObservationsProps = {
  observations?: string[];
};

export default function ResumeSourceObservations({
  observations = [],
}: ResumeSourceObservationsProps) {
  if (observations.length === 0) return null;

  return (
    <Paper withBorder p="sm" radius="md">
      <Stack gap="xs">
        <Text size="sm" fw={600}>
          AI observations
        </Text>

        <Text size="sm" c="dimmed">
          These notes may be inaccurate and do not determine whether an entry
          can be saved. Check them against your resume.
        </Text>

        {observations.map((observation, index) => (
          <Text key={index} size="sm">
            {observation}
          </Text>
        ))}
      </Stack>
    </Paper>
  );
}
