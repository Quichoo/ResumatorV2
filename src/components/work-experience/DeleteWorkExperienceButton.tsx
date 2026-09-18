"use client";

import { useState } from "react";
import { Button, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { deleteWorkExperience } from "@/lib/actions/work-experience";
import type { WorkExperience } from "@/types/work-experience";

type DeleteWorkExperienceButtonProps = {
  experience: Pick<WorkExperience, "id" | "jobTitle" | "companyName">;
};

export default function DeleteWorkExperienceButton({
  experience,
}: DeleteWorkExperienceButtonProps) {
  const [opened, setOpened] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    setOpened(true);
  }

  function closeDialog() {
    if (pending) return;
    setOpened(false);
  }

  async function handleDelete() {
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const result = await deleteWorkExperience(experience.id);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setOpened(false);
    } catch {
      setError("Unable to delete this work experience. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="filled"
        color="red.9"
        c={pending ? undefined : "white"}
        onClick={openDialog}
        disabled={pending}
        leftSection={<IconTrash size={16} aria-hidden="true" />}
        aria-label={`Delete ${experience.jobTitle} at ${experience.companyName}`}
      >
        Delete
      </Button>

      <ConfirmDialog
        opened={opened}
        onClose={closeDialog}
        onConfirm={handleDelete}
        title="Delete work experience?"
        confirmLabel="Delete experience"
        confirmColor="red.8"
        pending={pending}
        pendingLabel="Deleting work experience…"
        error={error}
      >
        <Text size="sm" style={{ overflowWrap: "anywhere" }}>
          Delete <strong>{experience.jobTitle}</strong> at{" "}
          <strong>{experience.companyName}</strong>?
        </Text>

        <Text size="sm" c="dimmed">
          This permanently removes the entry from your profile. This cannot be
          undone.
        </Text>
      </ConfirmDialog>
    </>
  );
}
