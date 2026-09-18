import { useEffect } from "react";
import { CloseButton, Group, Text } from "@mantine/core";

type SuccessMessageProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

export default function SuccessMessage({
  message,
  onClose,
  duration = 5000,
}: SuccessMessageProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(onClose, duration);

    return () => window.clearTimeout(timeoutId);
  }, [message, duration, onClose]);

  return (
    <Group gap={4} wrap="nowrap" align="flex-start">
      <Text size="sm" c="teal.9" role="status" aria-live="polite">
        {message}
      </Text>

      <CloseButton
        size="xs"
        aria-label="Dismiss success message"
        onClick={onClose}
      />
    </Group>
  );
}
