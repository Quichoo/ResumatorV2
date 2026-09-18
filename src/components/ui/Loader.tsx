import { Loader as MantineLoader, Stack, Text } from "@mantine/core";

type LoaderProps = {
  label?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

export default function Loader({
  label = "Loading…",
  size = "md",
}: LoaderProps) {
  return (
    <Stack align="center" gap="sm" role="status" aria-live="polite">
      <MantineLoader size={size} aria-hidden="true" />

      <Text size="sm" c="dimmed">
        {label}
      </Text>
    </Stack>
  );
}
