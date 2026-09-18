"use client";

import { Button, Container, Stack } from "@mantine/core";
import ErrorMessage from "@/components/ui/ErrorMessage";

type ProfileErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProfileError({ reset }: ProfileErrorProps) {
  return (
    <main>
      <Container size="md" py={64}>
        <Stack gap="md" align="flex-start">
          <ErrorMessage
            title="Unable to load your profile"
            message="Something went wrong. Please try again."
          />

          <Button type="button" color="blue.8" onClick={() => reset()}>
            Try again
          </Button>
        </Stack>
      </Container>
    </main>
  );
}
