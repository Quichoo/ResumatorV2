import { Text } from "@mantine/core";
import DeleteRecordButton from "@/components/ui/DeleteRecordButton";
import { deleteCertification } from "@/lib/actions/certification";
import type { Certification } from "@/types/certification";

type DeleteCertificationButtonProps = {
  certification: Pick<Certification, "id" | "name">;
  compact?: boolean;
};

export default function DeleteCertificationButton({
  certification,
  compact = false,
}: DeleteCertificationButtonProps) {
  return (
    <DeleteRecordButton
      title="Delete certification or course?"
      ariaLabel={`Delete ${certification.name}`}
      compact={compact}
      confirmLabel="Delete certification"
      pendingLabel="Deleting certification..."
      errorMessage="Unable to delete this certification. Please try again."
      deleteAction={deleteCertification.bind(null, certification.id)}
    >
      <Text size="sm">
        Delete <strong>{certification.name}</strong> from your profile?
      </Text>

      <Text size="sm" c="dimmed">
        This permanently removes this entry.
      </Text>
    </DeleteRecordButton>
  );
}
