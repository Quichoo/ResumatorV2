"use client";

import { useState, type ReactNode } from "react";
import { IconTrash } from "@tabler/icons-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import RecordActionButton from "@/components/ui/RecordActionButton";
import { useServerAction } from "@/hooks/useServerAction";

type DeleteRecordButtonProps = {
  title: string;
  ariaLabel: string;
  children: ReactNode;
  deleteAction: () => Promise<{
    success: boolean;
    message: string;
  }>;
  compact?: boolean;
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
  compact = false,
  triggerLabel = "Delete",
  confirmLabel = "Delete",
  pendingLabel = "Deleting...",
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
    if (isPending) return;

    const response = await execute();

    if (response?.success) {
      setOpened(false);
    }
  }

  const error = result && !result.success ? result.message : null;

  return (
    <>
      <RecordActionButton
        label={triggerLabel}
        ariaLabel={ariaLabel}
        icon={<IconTrash size={16} aria-hidden="true" />}
        compact={compact}
        color="red.9"
        onClick={openDialog}
        disabled={isPending}
      />

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
