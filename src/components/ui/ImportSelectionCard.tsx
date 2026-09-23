"use client";

import type { ReactNode } from "react";
import { Checkbox, Paper, Stack, Text } from "@mantine/core";

type ImportSelectionCardProps = {
  title: string;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
  children: ReactNode;
};

export default function ImportSelectionCard({
  title,
  selected,
  onSelectedChange,
  children,
}: ImportSelectionCardProps) {
  return (
    <Paper withBorder p="lg" radius="md">
      <Stack gap="md">
        <Text fw={600}>{title}</Text>

        <Checkbox
          label="Include in import"
          checked={selected}
          onChange={(event) => onSelectedChange(event.currentTarget.checked)}
          color="blue.8"
        />

        {selected ? (
          children
        ) : (
          <Text size="sm" c="dimmed">
            Excluded from import. Select it again to continue editing.
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
