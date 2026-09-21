import type { ReactNode } from "react";
import { Badge, Text } from "@mantine/core";
import RecordCard from "@/components/ui/RecordCard";
import { formatYearRange } from "@/lib/utils/format-year-range";
import type { EducationEntry } from "@/types/education";

type EducationCardProps = {
  entry: EducationEntry;
  actions?: ReactNode;
};

export default function EducationCard({ entry, actions }: EducationCardProps) {
  const dateLabel = formatYearRange(entry);

  return (
    <RecordCard
      title={entry.schoolName}
      subtitle={entry.degree}
      badge={
        entry.isCurrent ? (
          <Badge color="blue" variant="light">
            Studying
          </Badge>
        ) : undefined
      }
      actions={actions}
    >
      {entry.fieldOfStudy && <Text size="sm">{entry.fieldOfStudy}</Text>}

      {dateLabel && (
        <Text size="sm" c="dimmed">
          {dateLabel}
        </Text>
      )}

      {entry.description && (
        <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
          {entry.description}
        </Text>
      )}
    </RecordCard>
  );
}
