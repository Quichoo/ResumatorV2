import { Badge, Group, Paper, Stack, Text, Title } from "@mantine/core";

type ProfileOverviewProps = {
  fullName: string;
  email: string;
  location: string;
  summary: string;
  skills: string[];
};

export default function ProfileOverview({
  fullName,
  email,
  location,
  summary,
  skills,
}: ProfileOverviewProps) {
  return (
    <Stack gap="lg">
      <Paper withBorder p={{ base: "md", sm: "xl" }} radius="md">
        <Stack gap="xs">
          <Title order={2}>{fullName}</Title>
          <Text>{email}</Text>
          <Text c="dimmed">{location}</Text>
        </Stack>
      </Paper>

      <Paper withBorder p={{ base: "md", sm: "xl" }} radius="md">
        <Stack gap="sm">
          <Title order={2} size="h3">
            Professional summary
          </Title>
          <Text>{summary || "No professional summary added yet."}</Text>
        </Stack>
      </Paper>

      <Paper withBorder p={{ base: "md", sm: "xl" }} radius="md">
        <Stack gap="sm">
          <Title order={2} size="h3">
            Skills
          </Title>

          {skills.length > 0 ? (
            <Group gap="xs">
              {skills.map((skill) => (
                <Badge key={skill} variant="light" size="lg">
                  {skill}
                </Badge>
              ))}
            </Group>
          ) : (
            <Text c="dimmed">No skills added yet.</Text>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
