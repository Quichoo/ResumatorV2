import { useState, type FormEvent, type ReactNode } from "react";
import { Button, Modal, Stack } from "@mantine/core";
import ErrorMessage from "@/components/ui/ErrorMessage";
import FormActions from "@/components/ui/FormActions";
import Loader from "@/components/ui/Loader";
import SuccessMessage from "@/components/ui/SuccessMessage";
import { useServerAction } from "@/hooks/useServerAction";
import type { FieldErrors, FormActionResult } from "@/types/action-result";

type RecordEditorProps<TField extends string> = {
  title: string;
  triggerLabel: string;
  triggerAriaLabel?: string;
  triggerIcon?: ReactNode;
  submitLabel: string;
  pendingLabel: string;
  errorTitle: string;
  errorMessage?: string;
  saveAction: (formData: FormData) => Promise<FormActionResult<TField>>;
  renderFields: (
    fieldErrors: FieldErrors<TField> | undefined,
    pending: boolean,
  ) => ReactNode;
};

export default function RecordEditor<TField extends string>({
  title,
  triggerLabel,
  triggerAriaLabel,
  triggerIcon,
  submitLabel,
  pendingLabel,
  errorTitle,
  errorMessage = "Unable to save this entry. Please try again.",
  saveAction,
  renderFields,
}: RecordEditorProps<TField>) {
  const [opened, setOpened] = useState(false);

  const { execute, isPending, result, clearResult, clearSuccess } =
    useServerAction(saveAction, { errorMessage });

  function openEditor() {
    if (isPending) return;

    clearResult();
    setOpened(true);
  }

  function closeEditor() {
    if (isPending) return;

    setOpened(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const response = await execute(formData);

    if (response?.success) {
      setOpened(false);
    }
  }

  const fieldErrors =
    result && !result.success ? result.fieldErrors : undefined;

  return (
    <>
      <Stack gap={6} align="flex-end">
        <Button
          type="button"
          variant="filled"
          color="blue.8"
          c={isPending ? undefined : "white"}
          leftSection={triggerIcon}
          aria-label={triggerAriaLabel}
          onClick={openEditor}
          disabled={isPending}
        >
          {triggerLabel}
        </Button>

        {result?.success && (
          <SuccessMessage message={result.message} onClose={clearSuccess} />
        )}
      </Stack>

      <Modal
        opened={opened}
        onClose={closeEditor}
        title={title}
        size="lg"
        radius="lg"
        padding="lg"
        centered
        closeOnEscape={!isPending}
        closeOnClickOutside={!isPending}
        closeButtonProps={{
          disabled: isPending,
          "aria-label": "Close editor",
        }}
      >
        {opened && (
          <form
            method="post"
            onSubmit={handleSubmit}
            aria-busy={isPending}
            noValidate
          >
            <Stack gap="lg">
              {result && !result.success && (
                <ErrorMessage title={errorTitle} message={result.message} />
              )}

              <fieldset
                disabled={isPending}
                style={{
                  border: 0,
                  margin: 0,
                  padding: 0,
                  minWidth: 0,
                }}
              >
                {renderFields(fieldErrors, isPending)}
              </fieldset>

              {isPending && <Loader label={pendingLabel} size="sm" />}

              <FormActions
                submitLabel={submitLabel}
                pending={isPending}
                onCancel={closeEditor}
              />
            </Stack>
          </form>
        )}
      </Modal>
    </>
  );
}
