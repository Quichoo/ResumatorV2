import { Text } from "@mantine/core";
import DeleteRecordButton from "@/components/ui/DeleteRecordButton";
import { deleteEducationEntry } from "@/lib/actions/education";
import type { EducationEntry } from "@/types/education";

type DeleteEducationButtonProps = {
  entry: Pick<EducationEntry, "id" | "schoolName" | "degree">;
};

export default function DeleteEducationButton({
  entry,
}: DeleteEducationButtonProps) {
  const deleteAction = deleteEducationEntry.bind(null, entry.id);

  return (
    <DeleteRecordButton
      title="Delete education entry?"
      ariaLabel={`Delete ${entry.degree} at ${entry.schoolName}`}
      confirmLabel="Delete education"
      pendingLabel="Deleting education…"
      errorMessage="Unable to delete education. Please try again."
      deleteAction={deleteAction}
    >
      <Text size="sm">
        Delete <strong>{entry.degree}</strong> at{" "}
        <strong>{entry.schoolName}</strong>?
      </Text>

      <Text size="sm" c="dimmed">
        This permanently removes the entry from your profile.
      </Text>
    </DeleteRecordButton>
  );
}
