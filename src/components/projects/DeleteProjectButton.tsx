import { Text } from "@mantine/core";
import DeleteRecordButton from "@/components/ui/DeleteRecordButton";
import { deleteProject } from "@/lib/actions/project";
import type { Project } from "@/types/project";

type DeleteProjectButtonProps = {
  project: Pick<Project, "id" | "projectName">;
};

export default function DeleteProjectButton({
  project,
}: DeleteProjectButtonProps) {
  const deleteAction = deleteProject.bind(null, project.id);

  return (
    <DeleteRecordButton
      title="Delete project?"
      ariaLabel={`Delete ${project.projectName}`}
      confirmLabel="Delete project"
      pendingLabel="Deleting project…"
      errorMessage="Unable to delete this project. Please try again."
      deleteAction={deleteAction}
    >
      <Text size="sm">
        Delete <strong>{project.projectName}</strong>?
      </Text>

      <Text size="sm" c="dimmed">
        This permanently removes the entry from your profile.
      </Text>
    </DeleteRecordButton>
  );
}
