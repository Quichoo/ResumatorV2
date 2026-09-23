import type { ChangeEvent } from "react";
import {
  Checkbox,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import type {
  WorkExperience,
  WorkExperienceFieldErrors,
  WorkExperienceTextField,
} from "@/types/work-experience";

type WorkExperienceFieldsProps = {
  experience?: WorkExperience;
  fieldErrors?: WorkExperienceFieldErrors;
  isCurrent: boolean;
  onIsCurrentChange: (checked: boolean) => void;
  values?: Partial<Record<WorkExperienceTextField, string | null>>;
  onValueChange?: (field: WorkExperienceTextField, value: string) => void;
  hideCurrentCheckbox?: boolean;
};

export default function WorkExperienceFields({
  experience,
  fieldErrors = {},
  isCurrent,
  onIsCurrentChange,
  values,
  onValueChange,
  hideCurrentCheckbox = false,
}: WorkExperienceFieldsProps) {
  function inputProps(field: WorkExperienceTextField) {
    if (onValueChange) {
      return {
        value: values?.[field] ?? "",
        onChange: (
          event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => onValueChange(field, event.currentTarget.value),
      };
    }

    const value = experience?.[field] ?? "";

    return {
      defaultValue:
        field === "startDate" || field === "endDate"
          ? value.slice(0, 7)
          : value,
    };
  }

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          name="jobTitle"
          label="Job title"
          placeholder="Frontend Developer"
          {...inputProps("jobTitle")}
          error={fieldErrors.jobTitle?.join(" ")}
          maxLength={120}
          required
          data-autofocus
        />

        <TextInput
          name="companyName"
          label="Company or organization"
          placeholder="Company name"
          {...inputProps("companyName")}
          error={fieldErrors.companyName?.join(" ")}
          maxLength={160}
          required
        />
      </SimpleGrid>

      <TextInput
        name="location"
        label="Location"
        placeholder="Pampanga, Philippines or Remote"
        {...inputProps("location")}
        error={fieldErrors.location?.join(" ")}
        maxLength={120}
      />

      {!hideCurrentCheckbox && (
        <Checkbox
          name="isCurrent"
          value="on"
          label="I currently work here"
          checked={isCurrent}
          onChange={(event) => onIsCurrentChange(event.currentTarget.checked)}
          error={fieldErrors.isCurrent?.join(" ")}
          color="blue.8"
        />
      )}

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          name="startDate"
          type="month"
          label="Start month"
          {...inputProps("startDate")}
          error={fieldErrors.startDate?.join(" ")}
          required
        />

        <TextInput
          name="endDate"
          type="month"
          label="End month"
          {...inputProps("endDate")}
          description={isCurrent ? "Your resume will show Present." : undefined}
          error={fieldErrors.endDate?.join(" ")}
          disabled={isCurrent}
          required={!isCurrent}
        />
      </SimpleGrid>

      <Textarea
        name="description"
        label="Responsibilities and achievements"
        description="Describe your contributions and any results you achieved."
        placeholder="Built responsive interfaces using React..."
        {...inputProps("description")}
        error={fieldErrors.description?.join(" ")}
        maxLength={5000}
        minRows={4}
        maxRows={8}
        autosize
      />
    </Stack>
  );
}
