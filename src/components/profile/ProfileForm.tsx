"use client";

import { useState, type FormEvent } from "react";
import { Alert, Button, Group, Stack } from "@mantine/core";
import ProfileFields from "@/components/profile/ProfileFields";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { saveProfile } from "@/lib/actions/profile";
import type { ProfileFormValues, SaveProfileResult } from "@/types/profile";

type ProfileFormProps = {
  initialValues: ProfileFormValues;
};

export default function ProfileForm({ initialValues }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<SaveProfileResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) return;

    const formData = new FormData(event.currentTarget);

    setIsPending(true);
    setResult(null);

    try {
      const response = await saveProfile(formData);
      setResult(response);
    } catch {
      setResult({
        success: false,
        message: "Unable to complete the request. Please try again.",
      });
    } finally {
      setIsPending(false);
    }
  }

  const fieldErrors =
    result && !result.success ? result.fieldErrors : undefined;

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      onChange={() => {
        if (result?.success) {
          setResult(null);
        }
      }}
      aria-busy={isPending}
      noValidate
    >
      <Stack gap="lg">
        {result?.success && (
          <Alert color="teal" role="status">
            {result.message}
          </Alert>
        )}

        {result && !result.success && (
          <ErrorMessage title="Profile not saved" message={result.message} />
        )}

        <ProfileFields
          values={initialValues}
          errors={fieldErrors}
          disabled={isPending}
        />

        <Group justify="flex-end">
          <Button
            type="submit"
            color="blue.8"
            loading={isPending}
            disabled={isPending}
          >
            Save profile
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
