"use client";

import { useState, type FormEvent } from "react";
import { Button, FileInput, Group, Stack } from "@mantine/core";
import { IconUpload } from "@tabler/icons-react";
import ResumeTextPreview from "@/components/resume-import/ResumeTextPreview";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Loader from "@/components/ui/Loader";
import { useServerAction } from "@/hooks/useServerAction";
import { extractResumeText } from "@/lib/actions/resume-import";
import { getResumeFileError } from "@/lib/validations/resume-file";

export default function ResumeUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const { execute, isPending, result, clearResult } =
    useServerAction(extractResumeText);

  const isSubmitDisabled = isPending || !file || Boolean(fileError);

  function handleFileChange(nextFile: File | null) {
    setFile(nextFile);
    setFileError(nextFile ? getResumeFileError(nextFile) : null);
    clearResult();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) return;

    const validationError = getResumeFileError(file);

    if (validationError || !file) {
      setFileError(validationError);
      return;
    }

    setFileError(null);

    const formData = new FormData();
    formData.set("resume", file);

    await execute(formData);
  }

  function clearPreview() {
    setFile(null);
    setFileError(null);
    clearResult();
  }

  return (
    <Stack gap="md">
      <form
        method="post"
        onSubmit={handleSubmit}
        aria-busy={isPending}
        noValidate
      >
        <Stack gap="md">
          <FileInput
            label="Resume PDF"
            description="PDF with selectable text. Maximum 2 MB and 10 pages."
            placeholder="Choose your resume"
            accept=".pdf,application/pdf"
            value={file}
            onChange={handleFileChange}
            error={fileError}
            disabled={isPending}
            clearable
            required
          />

          {result && !result.success && (
            <ErrorMessage
              title="Resume could not be read"
              message={result.message}
            />
          )}

          {isPending && <Loader label="Reading your resume…" />}

          <Group justify="flex-end">
            <Button
              type="submit"
              variant="filled"
              color="blue.8"
              c={isSubmitDisabled ? undefined : "white"}
              leftSection={<IconUpload size={18} aria-hidden />}
              disabled={isSubmitDisabled}
            >
              Preview resume text
            </Button>
          </Group>
        </Stack>
      </form>

      {result?.success && (
        <Stack gap="md">
          <ResumeTextPreview preview={result.data} />

          <Group justify="flex-end">
            <Button
              type="button"
              variant="default"
              onClick={clearPreview}
              disabled={isPending}
            >
              Clear preview
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}
