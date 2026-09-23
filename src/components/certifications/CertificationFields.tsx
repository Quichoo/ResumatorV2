import type { ChangeEvent } from "react";
import { SimpleGrid, Stack, Textarea, TextInput } from "@mantine/core";
import type {
  Certification,
  CertificationFieldErrors,
  CertificationReviewEntry,
} from "@/types/certification";

type CertificationFieldsProps = {
  certification?: Certification;
  fieldErrors?: CertificationFieldErrors;
  disabled?: boolean;
  values?: CertificationReviewEntry;
  onValuesChange?: (patch: Partial<CertificationReviewEntry>) => void;
};

export default function CertificationFields({
  certification,
  fieldErrors,
  disabled = false,
  values,
  onValuesChange,
}: CertificationFieldsProps) {
  function inputProps(field: keyof CertificationReviewEntry) {
    if (onValuesChange) {
      return {
        value: values?.[field] ?? "",
        onChange: (
          event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => onValuesChange({ [field]: event.currentTarget.value }),
      };
    }

    return {
      defaultValue: String(certification?.[field] ?? ""),
    };
  }

  return (
    <Stack gap="md">
      <TextInput
        name="name"
        label="Certification or course name"
        placeholder="React - The Complete Guide"
        {...inputProps("name")}
        error={fieldErrors?.name?.join(" ")}
        maxLength={200}
        disabled={disabled}
        required
        data-autofocus
      />

      <TextInput
        name="issuer"
        label="Issuer or platform"
        placeholder="Udemy"
        {...inputProps("issuer")}
        error={fieldErrors?.issuer?.join(" ")}
        maxLength={160}
        disabled={disabled}
        required
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          name="issueYear"
          label="Issue or completion year"
          description="Optional. Leave empty if unknown."
          placeholder="2026"
          inputMode="numeric"
          {...inputProps("issueYear")}
          error={fieldErrors?.issueYear?.join(" ")}
          disabled={disabled}
        />

        <TextInput
          name="credentialId"
          label="Credential ID"
          description="Optional"
          {...inputProps("credentialId")}
          error={fieldErrors?.credentialId?.join(" ")}
          maxLength={200}
          disabled={disabled}
        />
      </SimpleGrid>

      <TextInput
        name="credentialUrl"
        type="url"
        label="Credential URL"
        description="Optional. Link to the credential or certificate."
        placeholder="https://example.com/certificate"
        {...inputProps("credentialUrl")}
        error={fieldErrors?.credentialUrl?.join(" ")}
        maxLength={2048}
        disabled={disabled}
      />

      <Textarea
        name="description"
        label="Additional details"
        description="Optional. Include the instructor or relevant course details."
        {...inputProps("description")}
        error={fieldErrors?.description?.join(" ")}
        maxLength={5000}
        minRows={3}
        maxRows={8}
        disabled={disabled}
        autosize
      />
    </Stack>
  );
}
