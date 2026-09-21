import type { ReactNode } from "react";
import { Group, Paper, Stack, Text, Title } from "@mantine/core";

type RecordCardProps = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
};

export default function RecordCard({
  title,
  subtitle,
  badge,
  children,
  actions,
}: RecordCardProps) {
  return (
    <Paper
      component="article"
      withBorder
      p="lg"
      radius="md"
      style={{ overflowWrap: "anywhere" }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
            <Title order={3} size="h4">
              {title}
            </Title>

            {subtitle && <Text fw={500}>{subtitle}</Text>}
          </Stack>

          {badge}
        </Group>

        {children}

        {actions && (
          <Group justify="flex-end" align="flex-start">
            {actions}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
