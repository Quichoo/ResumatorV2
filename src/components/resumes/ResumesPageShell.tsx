import type { ReactNode } from "react";
import { Container, Group, Stack, Text, Title } from "@mantine/core";
import { AppLink } from "@/components/ui/AppLink";

type ResumesPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  action?: ReactNode;
};

export default function ResumesPageShell({
  title,
  description,
  children,
  action,
}: ResumesPageShellProps) {
  return (
    <Container component="main" size="md" py="xl">
      <Stack gap="xl">
        <Group component="nav" aria-label="Resume navigation" gap="lg">
          <AppLink href="/resumes">My resumes</AppLink>
          <AppLink href="/profile">Master profile</AppLink>
        </Group>

        <Group justify="space-between" align="flex-start">
          <Stack gap={6}>
            <Title order={1}>{title}</Title>
            <Text c="dimmed">{description}</Text>
          </Stack>

          {action}
        </Group>

        {children}
      </Stack>
    </Container>
  );
}
