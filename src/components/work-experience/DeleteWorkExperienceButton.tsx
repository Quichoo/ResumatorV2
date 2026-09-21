import { Text } from "@mantine/core";
import DeleteRecordButton from "@/components/ui/DeleteRecordButton";
import { deleteWorkExperience } from "@/lib/actions/work-experience";
import type { WorkExperience } from "@/types/work-experience";

type DeleteWorkExperienceButtonProps = {
  experience: Pick<WorkExperience, "id" | "jobTitle" | "companyName">;
};

export default function DeleteWorkExperienceButton({
  experience,
}: DeleteWorkExperienceButtonProps) {
  const deleteAction = deleteWorkExperience.bind(null, experience.id);

  return (
    <DeleteRecordButton
      title="Delete work experience?"
      ariaLabel={`Delete ${experience.jobTitle} at ${experience.companyName}`}
      confirmLabel="Delete experience"
      pendingLabel="Deleting work experience…"
      errorMessage="Unable to delete work experience. Please try again."
      deleteAction={deleteAction}
    >
      <Text size="sm">
        Delete <strong>{experience.jobTitle}</strong> at{" "}
        <strong>{experience.companyName}</strong>?
      </Text>

      <Text size="sm" c="dimmed">
        This permanently removes the entry from your profile.
      </Text>
    </DeleteRecordButton>
  );
}
