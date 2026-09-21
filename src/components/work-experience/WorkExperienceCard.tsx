import type { ReactNode } from "react";
import { Badge, Text } from "@mantine/core";
import RecordCard from "@/components/ui/RecordCard";
import { formatMonth } from "@/lib/utils/format-month";
import type { WorkExperience } from "@/types/work-experience";

type WorkExperienceCardProps = {
  experience: WorkExperience;
  actions?: ReactNode;
};

export default function WorkExperienceCard({
  experience,
  actions,
}: WorkExperienceCardProps) {
  const endLabel = experience.endDate
    ? formatMonth(experience.endDate)
    : "Present";

  return (
    <RecordCard
      title={experience.jobTitle}
      subtitle={experience.companyName}
      badge={
        experience.isCurrent ? (
          <Badge color="blue" variant="light">
            Current
          </Badge>
        ) : undefined
      }
      actions={actions}
    >
      <Text size="sm" c="dimmed">
        {formatMonth(experience.startDate)} – {endLabel}
      </Text>

      {experience.location && (
        <Text size="sm" c="dimmed">
          {experience.location}
        </Text>
      )}

      {experience.description && (
        <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
          {experience.description}
        </Text>
      )}
    </RecordCard>
  );
}
