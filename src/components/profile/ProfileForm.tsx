"use client";

import type { FormEvent } from "react";
import { Button, Group, Stack } from "@mantine/core";
import ProfileFields from "@/components/profile/ProfileFields";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SuccessMessage from "@/components/ui/SuccessMessage";
import { useServerAction } from "@/hooks/useServerAction";
import { saveProfile } from "@/lib/actions/profile";
import type { ProfileFormValues } from "@/types/profile";

type ProfileFormProps = {
  initialValues: ProfileFormValues;
};

export default function ProfileForm({ initialValues }: ProfileFormProps) {
  const { execute, isPending, result, clearSuccess } = useServerAction(
    saveProfile,
    {
      errorMessage: "Unable to save your profile. Please try again.",
    },
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    await execute(formData);
  }

  const fieldErrors =
    result && !result.success ? result.fieldErrors : undefined;

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
      onChange={clearSuccess}
      aria-busy={isPending}
      noValidate
    >
      <Stack gap="lg">
        {result?.success && (
          <SuccessMessage message={result.message} onClose={clearSuccess} />
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
