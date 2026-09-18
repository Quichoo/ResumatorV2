"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Button, Group, Stack } from "@mantine/core";
import ProfileFields from "@/components/profile/ProfileFields";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/SuccessMessage";
import { saveProfile } from "@/lib/actions/profile";
import type { ProfileFormValues, SaveProfileResult } from "@/types/profile";

type ProfileFormProps = {
  initialValues: ProfileFormValues;
};

export default function ProfileForm({ initialValues }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<SaveProfileResult | null>(null);

  const clearSuccessMessage = useCallback(() => {
    setResult((current) => (current?.success ? null : current));
  }, []);

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
      onChange={clearSuccessMessage}
      aria-busy={isPending}
      noValidate
    >
      <Stack gap="lg">
        {result?.success && (
          <SuccessMessage
            message={result.message}
            onClose={clearSuccessMessage}
          />
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
