"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack, type ButtonProps } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { authClient } from "@/lib/auth-client";

type SignOutButtonProps = {
  className?: string;
  variant?: ButtonProps["variant"];
};

export default function SignOutButton({
  className,
  variant = "filled",
}: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    if (isPending) return;

    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        setError("Unable to sign out. Please try again.");
        setIsPending(false);
        return;
      }

      router.replace("/sign-in");
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <Stack gap="xs" align="flex-end">
      <Button
        type="button"
        color="blue.8"
        variant={variant}
        className={className}
        leftSection={<IconLogout size={18} aria-hidden="true" />}
        loading={isPending}
        disabled={isPending}
        onClick={handleSignOut}
      >
        Sign out
      </Button>

      {error && <ErrorMessage title="Sign-out unsuccessful" message={error} />}
    </Stack>
  );
}
