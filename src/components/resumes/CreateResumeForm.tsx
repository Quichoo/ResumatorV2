"use client";

import { useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Group, Stack, Text } from "@mantine/core";
import ResumeFields from "@/components/resumes/ResumeFields";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loader from "@/components/ui/Loader";
import { useServerAction } from "@/hooks/useServerAction";
import { createResume } from "@/lib/actions/resume";

export default function CreateResumeForm() {
  const router = useRouter();
  const submitting = useRef(false);

  const { execute, isPending, result } = useServerAction(createResume, {
    errorMessage:
      "Unable to confirm creation. Check My resumes before trying again.",
  });

  const saved = result?.success === true;
  const disabled = isPending || saved;
  const fieldErrors =
    result && !result.success ? result.fieldErrors : undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting.current || saved) return;

    const formData = new FormData(event.currentTarget);
    submitting.current = true;

    try {
      const response = await execute(formData);

      if (response?.success) {
        router.push("/resumes");
      }
    } finally {
      submitting.current = false;
    }
  }

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      aria-busy={isPending}
      noValidate
    >
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Save the job details for this resume version. Your master profile will
          stay unchanged.
        </Text>

        {result && !result.success && (
          <ErrorMessage
            title="Resume creation could not be completed"
            message={result.message}
          />
        )}

        <ResumeFields fieldErrors={fieldErrors} disabled={disabled} />

        {isPending && <Loader label="Creating your resume..." />}

        {saved && (
          <Text role="status" size="sm">
            {result.message}
          </Text>
        )}

        <Group justify="flex-end">
          {isPending ? (
            <Button type="button" variant="default" disabled>
              Cancel
            </Button>
          ) : (
            <Button component={Link} href="/resumes" variant="default">
              {saved ? "View my resumes" : "Cancel"}
            </Button>
          )}

          <Button
            type="submit"
            color="blue.8"
            c={disabled ? undefined : "white"}
            disabled={disabled}
          >
            {isPending ? "Creating..." : "Create resume"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
