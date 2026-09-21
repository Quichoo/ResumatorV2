"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useServerAction } from "@/hooks/useServerAction";

type DeleteRecordButtonProps = {
  title: string;
  ariaLabel: string;
  children: ReactNode;
  deleteAction: () => Promise<{
    success: boolean;
    message: string;
  }>;
  triggerLabel?: string;
  confirmLabel?: string;
  pendingLabel?: string;
  errorMessage?: string;
};

export default function DeleteRecordButton({
  title,
  ariaLabel,
  children,
  deleteAction,
  triggerLabel = "Delete",
  confirmLabel = "Delete",
  pendingLabel = "Deleting…",
  errorMessage = "Unable to delete this entry. Please try again.",
}: DeleteRecordButtonProps) {
  const [opened, setOpened] = useState(false);

  const { execute, isPending, result, clearResult } = useServerAction(
    deleteAction,
    { errorMessage },
  );

  function openDialog() {
    if (isPending) return;

    clearResult();
    setOpened(true);
  }

  function closeDialog() {
    if (isPending) return;

    setOpened(false);
  }

  async function handleConfirm() {
    const response = await execute();

    if (response?.success) {
      setOpened(false);
    }
  }

  const error = result && !result.success ? result.message : null;

  return (
    <>
      <Button
        type="button"
        variant="filled"
        color="red.9"
        c={isPending ? undefined : "white"}
        leftSection={<IconTrash size={16} aria-hidden="true" />}
        aria-label={ariaLabel}
        onClick={openDialog}
        disabled={isPending}
      >
        {triggerLabel}
      </Button>

      <ConfirmDialog
        opened={opened}
        title={title}
        onClose={closeDialog}
        onConfirm={handleConfirm}
        confirmLabel={confirmLabel}
        confirmColor="red.9"
        pending={isPending}
        pendingLabel={pendingLabel}
        error={error}
      >
        {children}
      </ConfirmDialog>
    </>
  );
}
