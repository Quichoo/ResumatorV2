import { useState, type FormEvent } from "react";
import { Button, Group, Stack } from "@mantine/core";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loader from "@/components/ui/Loader";
import WorkExperienceFields from "@/components/work-experience/WorkExperienceFields";
import {
  createWorkExperience,
  updateWorkExperience,
} from "@/lib/actions/work-experience";
import type {
  WorkExperience,
  WorkExperienceActionResult,
} from "@/types/work-experience";

type WorkExperienceFormProps = {
  experience?: WorkExperience;
  pending: boolean;
  onPendingChange: (pending: boolean) => void;
  onSuccess: (message: string) => void;
  onCancel: () => void;
};

export default function WorkExperienceForm({
  experience,
  pending,
  onPendingChange,
  onSuccess,
  onCancel,
}: WorkExperienceFormProps) {
  const [isCurrent, setIsCurrent] = useState(experience?.isCurrent ?? false);

  const [result, setResult] = useState<WorkExperienceActionResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    // Read the values before disabling the form fields.
    const formData = new FormData(event.currentTarget);

    setResult(null);
    onPendingChange(true);

    try {
      const response = experience
        ? await updateWorkExperience(experience.id, formData)
        : await createWorkExperience(formData);

      if (!response.success) {
        setResult(response);
        return;
      }

      onSuccess(response.message);
    } catch {
      setResult({
        success: false,
        message: "Unable to save your work experience. Please try again.",
      });
    } finally {
      onPendingChange(false);
    }
  }

  return (
    <form method="post" onSubmit={handleSubmit} noValidate>
      <Stack gap="md">
        <fieldset
          disabled={pending}
          style={{
            border: 0,
            padding: 0,
            margin: 0,
            minWidth: 0,
          }}
        >
          <Stack gap="lg">
            <WorkExperienceFields
              experience={experience}
              isCurrent={isCurrent}
              onIsCurrentChange={setIsCurrent}
              fieldErrors={
                result && !result.success ? result.fieldErrors : undefined
              }
            />

            <Group justify="flex-end">
              <Button
                type="button"
                variant="default"
                onClick={onCancel}
                disabled={pending}
              >
                Cancel
              </Button>

              <Button type="submit" color="blue.8" disabled={pending}>
                {experience ? "Save changes" : "Add experience"}
              </Button>
            </Group>
          </Stack>
        </fieldset>

        {pending && <Loader label="Saving work experience…" size="sm" />}

        {result && !result.success && (
          <ErrorMessage
            title="Check your work experience"
            message={result.message}
          />
        )}
      </Stack>
    </form>
  );
}
