"use client";

import { useState, type FormEvent } from "react";
import { Button, PasswordInput, Stack, Text, TextInput } from "@mantine/core";

import ErrorMessage from "@/components/ui/ErrorMessage";
import { authClient } from "@/lib/auth-client";
import { authOptions } from "@/lib/auth-options";
import {
  IconArrowRight,
  IconLock,
  IconMail,
  IconUser,
} from "@tabler/icons-react";

import classes from "./AuthLayout.module.css";

export default function SignUpForm() {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending || isSuccess) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    setError(null);

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    setIsPending(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.status === 429
            ? "Too many attempts. Please wait before trying again."
            : "Unable to create your account. Check your details and try again.",
        );
        return;
      }

      setIsSuccess(true);
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
    <form onSubmit={handleSubmit} aria-busy={isPending}>
      <Stack gap={22}>
        {error && <ErrorMessage title="Sign-up unsuccessful" message={error} />}

        {isSuccess && (
          <Text role="status" c="teal.9" fw={500}>
            Your account was created successfully.
          </Text>
        )}

        <TextInput
          name="name"
          label="Full name"
          placeholder="Your full name"
          autoComplete="name"
          size="md"
          leftSection={<IconUser size={20} aria-hidden="true" />}
          leftSectionPointerEvents="none"
          classNames={{
            input: classes.input,
            label: classes.label,
          }}
          required
          disabled={isDisabled}
        />

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
          placeholder="Create a password"
          description={`Use ${authOptions.emailAndPassword.minPasswordLength}–${authOptions.emailAndPassword.maxPasswordLength} characters.`}
          autoComplete="new-password"
          size="md"
          leftSection={<IconLock size={20} aria-hidden="true" />}
          leftSectionPointerEvents="none"
          inputWrapperOrder={["label", "input", "description", "error"]}
          visibilityToggleButtonProps={{
            "aria-label": "Toggle password visibility",
            tabIndex: 0,
          }}
          classNames={{
            input: classes.input,
            innerInput: classes.innerInput,
            label: classes.label,
            description: classes.description,
          }}
          minLength={authOptions.emailAndPassword.minPasswordLength}
          maxLength={authOptions.emailAndPassword.maxPasswordLength}
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
          loading={isPending}
          disabled={isSuccess}
        >
          Create account
        </Button>
      </Stack>
    </form>
  );
}
