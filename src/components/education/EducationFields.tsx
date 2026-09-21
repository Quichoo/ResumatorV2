import {
  Checkbox,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import type { EducationEntry, EducationFieldErrors } from "@/types/education";

type EducationFieldsProps = {
  entry?: EducationEntry;
  fieldErrors?: EducationFieldErrors;
  isCurrent: boolean;
  onIsCurrentChange: (checked: boolean) => void;
};

export default function EducationFields({
  entry,
  fieldErrors = {},
  isCurrent,
  onIsCurrentChange,
}: EducationFieldsProps) {
  return (
    <Stack gap="md">
      <TextInput
        name="schoolName"
        label="School or institution"
        placeholder="Enter your school name"
        defaultValue={entry?.schoolName ?? ""}
        error={fieldErrors.schoolName?.join(" ")}
        maxLength={160}
        required
        data-autofocus
      />

      <TextInput
        name="degree"
        label="Degree, qualification, or program"
        placeholder="Bachelor of Science"
        defaultValue={entry?.degree ?? ""}
        error={fieldErrors.degree?.join(" ")}
        maxLength={160}
        required
      />

      <TextInput
        name="fieldOfStudy"
        label="Field of study"
        placeholder="Information Technology"
        defaultValue={entry?.fieldOfStudy ?? ""}
        error={fieldErrors.fieldOfStudy?.join(" ")}
        maxLength={160}
      />

      <Checkbox
        name="isCurrent"
        value="on"
        label="I currently study here"
        checked={isCurrent}
        onChange={(event) => onIsCurrentChange(event.currentTarget.checked)}
        error={fieldErrors.isCurrent?.join(" ")}
        color="blue.8"
      />

      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <TextInput
          name="startYear"
          label="Start year"
          description="Optional"
          placeholder="2020"
          inputMode="numeric"
          defaultValue={entry?.startYear?.toString() ?? ""}
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
          defaultValue={entry?.endYear?.toString() ?? ""}
          error={fieldErrors.endYear?.join(" ")}
          disabled={isCurrent}
        />
      </SimpleGrid>

      <Textarea
        name="description"
        label="Additional details"
        description="Include relevant coursework, honors, or other details."
        placeholder="Add details relevant to your education..."
        defaultValue={entry?.description ?? ""}
        error={fieldErrors.description?.join(" ")}
        maxLength={5000}
        minRows={4}
        maxRows={8}
        autosize
      />
    </Stack>
  );
}
