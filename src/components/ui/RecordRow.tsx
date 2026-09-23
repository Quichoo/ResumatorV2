import type { ReactNode } from "react";
import { Group, Paper, Stack, Text } from "@mantine/core";

type RecordRowProps = {
  title: string;
  subtitle?: string;
  actions: ReactNode;
};

export default function RecordRow({
  title,
  subtitle,
  actions,
}: RecordRowProps) {
  return (
    <Paper withBorder px="sm" py="xs" radius="md">
      <Group justify="space-between" align="center" wrap="nowrap" gap="sm">
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={600} style={{ overflowWrap: "anywhere" }}>
            {title}
          </Text>

          {subtitle && (
            <Text size="xs" c="dimmed" style={{ overflowWrap: "anywhere" }}>
              {subtitle}
            </Text>
          )}
        </Stack>

        <Group
          gap={6}
          wrap="nowrap"
          align="flex-start"
          style={{ flexShrink: 0 }}
        >
          {actions}
        </Group>
      </Group>
    </Paper>
  );
}
