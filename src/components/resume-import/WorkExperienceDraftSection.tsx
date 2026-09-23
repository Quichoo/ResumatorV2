"use client";

import { NativeSelect, Stack, Text, Title } from "@mantine/core";
import ImportSelectionCard from "@/components/ui/ImportSelectionCard";
import WorkExperienceFields from "@/components/work-experience/WorkExperienceFields";
import { workExperienceSchema } from "@/lib/validations/work-experience";
import type { WorkExperienceDraft } from "@/types/resume-draft";
import type {
  WorkExperienceFieldErrors,
  WorkExperienceTextField,
} from "@/types/work-experience";

type WorkExperienceDraftSectionProps = {
  entries: WorkExperienceDraft[];
  selected: boolean[];
  onSelectedChange: (index: number, selected: boolean) => void;
  onEntryChange: (index: number, patch: Partial<WorkExperienceDraft>) => void;
};

export default function WorkExperienceDraftSection({
  entries,
  selected,
  onSelectedChange,
  onEntryChange,
}: WorkExperienceDraftSectionProps) {
  return (
    <Stack gap="md">
      <div>
        <Title order={3}>Review work experience</Title>
        <Text size="sm" c="dimmed" mt="xs">
          Correct each selected entry or exclude it from the import. Nothing is
          saved yet.
        </Text>
      </div>

      {entries.length === 0 && (
        <Text size="sm" c="dimmed">
          No work experience was extracted.
        </Text>
      )}

      {entries.map((entry, index) => {
        const validation = workExperienceSchema.safeParse({
          jobTitle: entry.jobTitle ?? "",
          companyName: entry.companyName ?? "",
          location: entry.location ?? "",
          startDate: entry.startDate ?? "",
          endDate: entry.endDate ?? "",
          isCurrent: entry.isCurrent,
          description: entry.description ?? "",
        });

        const fieldErrors: WorkExperienceFieldErrors = validation.success
          ? {}
          : validation.error.flatten().fieldErrors;

        if (entry.isCurrent === null) {
          fieldErrors.isCurrent = ["Choose whether you currently work here."];
        }

        function updateText(field: WorkExperienceTextField, value: string) {
          onEntryChange(index, {
            [field]: value === "" ? null : value,
          });
        }

        function updateStatus(isCurrent: boolean | null) {
          onEntryChange(index, {
            isCurrent,
            ...(isCurrent === true ? { endDate: null } : {}),
          });
        }

        return (
          <ImportSelectionCard
            key={index}
            title={`${index + 1}. ${entry.jobTitle || "Untitled role"}`}
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
                label="Employment status"
                value={entry.isCurrent === null ? "" : String(entry.isCurrent)}
                data={[
                  { value: "", label: "Choose employment status" },
                  { value: "true", label: "I currently work here" },
                  { value: "false", label: "I no longer work here" },
                ]}
                onChange={(event) => {
                  const value = event.currentTarget.value;

                  updateStatus(value === "" ? null : value === "true");
                }}
                error={fieldErrors.isCurrent?.join(" ")}
                required
              />

              <WorkExperienceFields
                values={entry}
                onValueChange={updateText}
                fieldErrors={fieldErrors}
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
