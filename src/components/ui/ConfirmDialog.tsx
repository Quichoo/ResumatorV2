import type { ReactNode } from "react";
import { Button, Group, Modal, Stack, type MantineColor } from "@mantine/core";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loader from "@/components/ui/Loader";

type ConfirmDialogProps = {
  opened: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmColor?: MantineColor;
  pending?: boolean;
  pendingLabel?: string;
  error?: string | null;
};

export default function ConfirmDialog({
  opened,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  confirmColor = "blue.8",
  pending = false,
  pendingLabel = "Working…",
  error,
}: ConfirmDialogProps) {
  function handleClose() {
    if (pending) return;
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={title}
      size="sm"
      radius="lg"
      padding="lg"
      centered
      closeOnEscape={!pending}
      closeOnClickOutside={!pending}
      closeButtonProps={{
        disabled: pending,
        "aria-label": "Close confirmation",
      }}
    >
      <Stack gap="md">
        {children}

        {error && <ErrorMessage message={error} />}

        {pending && <Loader label={pendingLabel} size="sm" />}

        <Group justify="flex-end">
          <Button
            type="button"
            variant="default"
            onClick={handleClose}
            disabled={pending}
            data-autofocus
          >
            Cancel
          </Button>

          <Button
            type="button"
            color={confirmColor}
            onClick={onConfirm}
            disabled={pending}
          >
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
