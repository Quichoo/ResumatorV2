"use client";

import Link from "next/link";
import { Button, Container, Group, Stack } from "@mantine/core";
import ErrorMessage from "@/components/ui/ErrorMessage";

type ResumesErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ResumesError({ reset }: ResumesErrorProps) {
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <ErrorMessage
          title="Resumes unavailable"
          message="We could not load this page. Please try again."
        />

        <Group>
          <Button type="button" color="blue.8" c="white" onClick={reset}>
            Try again
          </Button>

          <Button component={Link} href="/profile" variant="default">
            Back to profile
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
