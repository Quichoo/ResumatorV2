"use client";

import { IconPencil, IconPlus } from "@tabler/icons-react";
import ProjectFields from "@/components/projects/ProjectFields";
import RecordEditor from "@/components/ui/RecordEditor";
import { createProject, updateProject } from "@/lib/actions/project";
import type { Project, ProjectFormValues } from "@/types/project";

type ProjectEditorProps = {
  project?: Project;
};

export default function ProjectEditor({ project }: ProjectEditorProps) {
  const isEditing = Boolean(project);
  const TriggerIcon = isEditing ? IconPencil : IconPlus;

  const saveAction = project
    ? updateProject.bind(null, project.id)
    : createProject;

  return (
    <RecordEditor<keyof ProjectFormValues>
      title={isEditing ? "Edit project" : "Add project"}
      triggerLabel={isEditing ? "Edit" : "Add project"}
      triggerAriaLabel={project ? `Edit ${project.projectName}` : "Add project"}
      triggerIcon={<TriggerIcon size={16} aria-hidden="true" />}
      submitLabel={isEditing ? "Save changes" : "Add project"}
      pendingLabel="Saving project…"
      errorTitle="Project not saved"
      errorMessage="Unable to save this project. Please try again."
      saveAction={saveAction}
      renderFields={(fieldErrors, pending) => (
        <ProjectFields
          project={project}
          fieldErrors={fieldErrors}
          disabled={pending}
        />
      )}
    />
  );
}
