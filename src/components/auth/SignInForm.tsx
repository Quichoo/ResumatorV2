"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { IconArrowRight, IconLock, IconMail } from "@tabler/icons-react";

import ErrorMessage from "@/components/ui/ErrorMessage";
import { authClient } from "@/lib/auth-client";

import classes from "./AuthLayout.module.css";

export default function SignInForm() {
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending || isSuccess) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.status === 429
            ? "Too many attempts. Please wait before trying again."
            : "Unable to sign in. Check your email and password and try again.",
        );
        return;
      }

      setIsSuccess(true);
      router.replace("/profile");
      router.refresh();
    } catch {
      setError(
        "Unable to reach the server. Check your connection and try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  const isDisabled = isPending || isSuccess;

  return (
    <form onSubmit={handleSubmit} aria-busy={isDisabled}>
      <Stack gap={22}>
        {error && <ErrorMessage title="Sign-in unsuccessful" message={error} />}

        <TextInput
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          size="md"
          leftSection={<IconMail size={20} aria-hidden="true" />}
          leftSectionPointerEvents="none"
          classNames={{
            input: classes.input,
            label: classes.label,
          }}
          required
          disabled={isDisabled}
        />

        <PasswordInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          autoComplete="current-password"
          size="md"
          leftSection={<IconLock size={20} aria-hidden="true" />}
          leftSectionPointerEvents="none"
          visibilityToggleButtonProps={{
            "aria-label": "Toggle password visibility",
            tabIndex: 0,
          }}
          classNames={{
            input: classes.input,
            innerInput: classes.innerInput,
            label: classes.label,
          }}
          required
          disabled={isDisabled}
        />

        <Button
          type="submit"
          fullWidth
          variant="gradient"
          gradient={{ from: "#0789e8", to: "#3545ed", deg: 110 }}
          rightSection={<IconArrowRight size={21} aria-hidden="true" />}
          className={classes.submit}
          loading={isDisabled}
        >
          {isSuccess ? "Opening your profile…" : "Sign in"}
        </Button>
      </Stack>
    </form>
  );
}
