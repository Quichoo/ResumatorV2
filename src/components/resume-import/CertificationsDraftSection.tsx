"use client";

import { Stack, Text, Title } from "@mantine/core";
import CertificationFields from "@/components/certifications/CertificationFields";
import ImportSelectionCard from "@/components/ui/ImportSelectionCard";
import { certificationSchema } from "@/lib/validations/certification";
import type {
  CertificationFieldErrors,
  CertificationReviewEntry,
} from "@/types/certification";

type CertificationsDraftSectionProps = {
  entries: CertificationReviewEntry[];
  selected: boolean[];
  onSelectedChange: (index: number, selected: boolean) => void;
  onEntryChange: (
    index: number,
    patch: Partial<CertificationReviewEntry>,
  ) => void;
};

export default function CertificationsDraftSection({
  entries,
  selected,
  onSelectedChange,
  onEntryChange,
}: CertificationsDraftSectionProps) {
  return (
    <Stack gap="md">
      <div>
        <Title order={3}>Review certifications and courses</Title>

        <Text size="sm" c="dimmed" mt="xs">
          Check the names, issuers, and credential details. Select the entries
          you want to import.
        </Text>
      </div>

      {entries.length === 0 && (
        <Text size="sm" c="dimmed">
          No certifications or courses were extracted.
        </Text>
      )}

      {entries.map((entry, index) => {
        const validation = certificationSchema.safeParse(entry);

        const fieldErrors: CertificationFieldErrors = validation.success
          ? {}
          : validation.error.flatten().fieldErrors;

        return (
          <ImportSelectionCard
            key={index}
            title={`${index + 1}. ${entry.name.trim() || "Untitled certification or course"}`}
            selected={selected[index] ?? false}
            onSelectedChange={(checked) => onSelectedChange(index, checked)}
          >
            <Stack gap="md">
              <CertificationFields
                values={entry}
                fieldErrors={fieldErrors}
                onValuesChange={(patch) => onEntryChange(index, patch)}
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
