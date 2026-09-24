"use client";

import { useRef, type FormEvent } from "react";
import Link from "next/link";
import { Button, Group, Stack } from "@mantine/core";
import ResumeFields from "@/components/resumes/ResumeFields";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loader from "@/components/ui/Loader";
import SuccessMessage from "@/components/ui/SuccessMessage";
import { useServerAction } from "@/hooks/useServerAction";
import { updateResume } from "@/lib/actions/resume";
import type { ResumeDetails } from "@/types/resume";

type EditResumeFormProps = {
  resume: ResumeDetails;
};

export default function EditResumeForm({ resume }: EditResumeFormProps) {
  const submitting = useRef(false);
  const saveAction = updateResume.bind(null, resume.id);

  const { execute, isPending, result, clearSuccess } = useServerAction(
    saveAction,
    { errorMessage: "Unable to save changes. Please try again." },
  );

  const fieldErrors =
    result && !result.success ? result.fieldErrors : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting.current) return;

    const formData = new FormData(event.currentTarget);
    submitting.current = true;

    try {
      await execute(formData);
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      onChange={clearSuccess}
      aria-busy={isPending}
      noValidate
    >
      <Stack gap="lg">
        {result && !result.success && (
          <ErrorMessage
            title="Changes could not be saved"
            message={result.message}
          />
        )}

        {result?.success && (
          <SuccessMessage message={result.message} onClose={clearSuccess} />
        )}

        <ResumeFields
          values={{
            title: resume.title,
            targetRole: resume.targetRole,
            companyName: resume.companyName ?? "",
            jobDescription: resume.jobDescription,
          }}
          fieldErrors={fieldErrors}
          disabled={isPending}
        />

        {isPending && <Loader label="Saving changes..." />}

        <Group justify="flex-end">
          {isPending ? (
            <Button type="button" variant="default" disabled>
              Back to resumes
            </Button>
          ) : (
            <Button component={Link} href="/resumes" variant="default">
              Back to resumes
            </Button>
          )}

          <Button
            type="submit"
            color="blue.8"
            c={isPending ? undefined : "white"}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
