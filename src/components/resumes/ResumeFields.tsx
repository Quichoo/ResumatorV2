import { SimpleGrid, Stack, Textarea, TextInput } from "@mantine/core";
import type { ResumeFieldErrors, ResumeFormValues } from "@/types/resume";

type ResumeFieldsProps = {
  values?: Partial<ResumeFormValues>;
  fieldErrors?: ResumeFieldErrors;
  disabled?: boolean;
};

export default function ResumeFields({
  values,
  fieldErrors,
  disabled = false,
}: ResumeFieldsProps) {
  return (
    <Stack gap="md">
      <TextInput
        name="title"
        label="Resume title"
        description="A name to help you identify this version."
        placeholder="Frontend Developer - Example Studio"
        defaultValue={values?.title ?? ""}
        error={fieldErrors?.title?.join(" ")}
        maxLength={160}
        disabled={disabled}
        required
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          name="targetRole"
          label="Target role"
          placeholder="Frontend Developer"
          defaultValue={values?.targetRole ?? ""}
          error={fieldErrors?.targetRole?.join(" ")}
          maxLength={160}
          disabled={disabled}
          required
        />

        <TextInput
          name="companyName"
          label="Company (optional)"
          placeholder="Example Studio"
          defaultValue={values?.companyName ?? ""}
          error={fieldErrors?.companyName?.join(" ")}
          maxLength={160}
          disabled={disabled}
        />
      </SimpleGrid>

      <Textarea
        name="jobDescription"
        label="Job description"
        description="Paste the responsibilities and requirements from the posting."
        placeholder="Paste the job description here..."
        defaultValue={values?.jobDescription ?? ""}
        error={fieldErrors?.jobDescription?.join(" ")}
        maxLength={30_000}
        minRows={10}
        maxRows={20}
        disabled={disabled}
        autosize
        required
      />
    </Stack>
  );
}
