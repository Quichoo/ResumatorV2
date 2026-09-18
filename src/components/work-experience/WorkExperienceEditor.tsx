"use client";

import { useCallback, useState } from "react";
import { Button, Modal, Stack } from "@mantine/core";
import { IconPencil, IconPlus } from "@tabler/icons-react";
import SuccessMessage from "@/components/ui/SuccessMessage";
import WorkExperienceForm from "@/components/work-experience/WorkExperienceForm";
import type { WorkExperience } from "@/types/work-experience";

type WorkExperienceEditorProps = {
  experience?: WorkExperience;
};

export default function WorkExperienceEditor({
  experience,
}: WorkExperienceEditorProps) {
  const [opened, setOpened] = useState(false);
  const [pending, setPending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isEditing = Boolean(experience);

  const clearSuccessMessage = useCallback(() => {
    setSuccessMessage("");
  }, []);

  function openEditor() {
    clearSuccessMessage();
    setOpened(true);
  }

  function closeEditor() {
    if (pending) return;
    setOpened(false);
  }

  function handleSuccess(message: string) {
    setSuccessMessage(message);
    setOpened(false);
  }

  return (
    <>
      <Stack gap={6} align="flex-end">
        <Button
          type="button"
          variant="filled"
          color="blue.8"
          c={pending ? undefined : "white"}
          disabled={pending}
          onClick={openEditor}
          leftSection={
            isEditing ? (
              <IconPencil size={16} aria-hidden="true" />
            ) : (
              <IconPlus size={16} aria-hidden="true" />
            )
          }
        >
          {isEditing ? "Edit" : "Add experience"}
        </Button>

        {successMessage && (
          <SuccessMessage
            message={successMessage}
            onClose={clearSuccessMessage}
          />
        )}
      </Stack>

      <Modal
        opened={opened}
        onClose={closeEditor}
        title={isEditing ? "Edit work experience" : "Add work experience"}
        size="lg"
        radius="lg"
        padding="lg"
        centered
        closeOnEscape={!pending}
        closeOnClickOutside={!pending}
        closeButtonProps={{
          disabled: pending,
          "aria-label": "Close work experience form",
        }}
      >
        {opened && (
          <WorkExperienceForm
            experience={experience}
            pending={pending}
            onPendingChange={setPending}
            onSuccess={handleSuccess}
            onCancel={closeEditor}
          />
        )}
      </Modal>
    </>
  );
}
