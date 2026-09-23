import {
  Checkbox,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import type { ChangeEvent } from "react";
import type {
  EducationEntry,
  EducationFieldErrors,
  EducationTextField,
} from "@/types/education";

type EducationFieldsProps = {
  entry?: EducationEntry;
  fieldErrors?: EducationFieldErrors;
  isCurrent: boolean;
  onIsCurrentChange: (checked: boolean) => void;
  values?: Partial<Record<EducationTextField, string>>;
  onValueChange?: (field: EducationTextField, value: string) => void;
  hideCurrentCheckbox?: boolean;
};

export default function EducationFields({
  entry,
  fieldErrors = {},
  isCurrent,
  onIsCurrentChange,
  values,
  onValueChange,
  hideCurrentCheckbox = false,
}: EducationFieldsProps) {
  function inputProps(field: EducationTextField) {
    if (onValueChange) {
      return {
        value: values?.[field] ?? "",
        onChange: (
          event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => onValueChange(field, event.currentTarget.value),
      };
    }

    return {
      defaultValue: String(entry?.[field] ?? ""),
    };
  }

  return (
    <Stack gap="md">
      <TextInput
        name="schoolName"
        label="School or institution"
        placeholder="Enter your school name"
        {...inputProps("schoolName")}
        error={fieldErrors.schoolName?.join(" ")}
        maxLength={160}
        required
        data-autofocus
      />

      <TextInput
        name="degree"
        label="Degree, qualification, or program"
        placeholder="Bachelor of Science"
        {...inputProps("degree")}
        error={fieldErrors.degree?.join(" ")}
        maxLength={160}
        required
      />

      <TextInput
        name="fieldOfStudy"
        label="Field of study"
        placeholder="Information Technology"
        {...inputProps("fieldOfStudy")}
        error={fieldErrors.fieldOfStudy?.join(" ")}
        maxLength={160}
      />

      {!hideCurrentCheckbox && (
        <Checkbox
          name="isCurrent"
          value="on"
          label="I currently study here"
          checked={isCurrent}
          onChange={(event) => onIsCurrentChange(event.currentTarget.checked)}
          error={fieldErrors.isCurrent?.join(" ")}
          color="blue.8"
        />
      )}

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          name="startYear"
          label="Start year"
          description="Optional"
          placeholder="2020"
          inputMode="numeric"
          {...inputProps("startYear")}
          error={fieldErrors.startYear?.join(" ")}
        />

        <TextInput
          name="endYear"
          label="End year"
          description={
            isCurrent ? "Your profile will show Present." : "Optional"
          }
          placeholder="2024"
          inputMode="numeric"
          {...inputProps("endYear")}
          error={fieldErrors.endYear?.join(" ")}
          disabled={isCurrent}
        />
      </SimpleGrid>

      <Textarea
        name="description"
        label="Additional details"
        description="Include relevant coursework, honors, or other details."
        placeholder="Add details relevant to your education..."
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
