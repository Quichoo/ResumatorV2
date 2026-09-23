"use client";

import { NativeSelect, Stack, Text, Title } from "@mantine/core";
import EducationFields from "@/components/education/EducationFields";
import ImportSelectionCard from "@/components/ui/ImportSelectionCard";
import { educationSchema } from "@/lib/validations/education";
import type {
  EducationFieldErrors,
  EducationReviewEntry,
  EducationTextField,
} from "@/types/education";

type EducationDraftSectionProps = {
  entries: EducationReviewEntry[];
  selected: boolean[];
  onSelectedChange: (index: number, selected: boolean) => void;
  onEntryChange: (index: number, patch: Partial<EducationReviewEntry>) => void;
};

export default function EducationDraftSection({
  entries,
  selected,
  onSelectedChange,
  onEntryChange,
}: EducationDraftSectionProps) {
  return (
    <Stack gap="md">
      <div>
        <Title order={3}>Review education</Title>
        <Text size="sm" c="dimmed" mt="xs">
          Check your school, qualification, and years. Select the entries you
          want to import.
        </Text>
      </div>

      {entries.length === 0 && (
        <Text size="sm" c="dimmed">
          No education entries were extracted.
        </Text>
      )}

      {entries.map((entry, index) => {
        const validation = educationSchema.safeParse(entry);

        const fieldErrors: EducationFieldErrors = validation.success
          ? {}
          : validation.error.flatten().fieldErrors;

        if (entry.isCurrent === null) {
          fieldErrors.isCurrent = ["Choose whether you currently study here."];
        }

        function updateText(field: EducationTextField, value: string) {
          onEntryChange(index, { [field]: value });
        }

        function updateStatus(isCurrent: boolean | null) {
          onEntryChange(index, {
            isCurrent,
            ...(isCurrent === true ? { endYear: "" } : {}),
          });
        }

        return (
          <ImportSelectionCard
            key={index}
            title={`${index + 1}. ${entry.schoolName || "Untitled education"}`}
            selected={selected[index] ?? false}
            onSelectedChange={(checked) => onSelectedChange(index, checked)}
          >
            <Stack gap="md">
              {entry.dateText && (
                <Text size="sm" c="dimmed">
                  Original date text: {entry.dateText}
                </Text>
              )}

              <NativeSelect
                label="Study status"
                value={entry.isCurrent === null ? "" : String(entry.isCurrent)}
                data={[
                  { value: "", label: "Choose study status" },
                  { value: "true", label: "I currently study here" },
                  { value: "false", label: "I no longer study here" },
                ]}
                onChange={(event) => {
                  const value = event.currentTarget.value;

                  updateStatus(value === "" ? null : value === "true");
                }}
                error={fieldErrors.isCurrent?.join(" ")}
                required
              />

              <EducationFields
                values={entry}
                fieldErrors={fieldErrors}
                onValueChange={updateText}
                isCurrent={entry.isCurrent === true}
                onIsCurrentChange={updateStatus}
                hideCurrentCheckbox
              />

              <Text size="sm" c={validation.success ? "teal.9" : "red.8"}>
                {validation.success
                  ? "Required fields are complete."
                  : "Fix the highlighted fields or exclude this entry."}
              </Text>
            </Stack>
          </ImportSelectionCard>
        );
      })}
    </Stack>
  );
}
