"use client";

import { IconPencil, IconPlus } from "@tabler/icons-react";
import RecordEditor from "@/components/ui/RecordEditor";
import WorkExperienceEditorFields from "@/components/work-experience/WorkExperienceEditorFields";
import {
  createWorkExperience,
  updateWorkExperience,
} from "@/lib/actions/work-experience";
import type {
  WorkExperience,
  WorkExperienceFormValues,
} from "@/types/work-experience";

type WorkExperienceEditorProps = {
  experience?: WorkExperience;
};

export default function WorkExperienceEditor({
  experience,
}: WorkExperienceEditorProps) {
  const isEditing = Boolean(experience);
  const TriggerIcon = isEditing ? IconPencil : IconPlus;

  const saveAction = experience
    ? (formData: FormData) => updateWorkExperience(experience.id, formData)
    : createWorkExperience;

  return (
    <RecordEditor<keyof WorkExperienceFormValues>
      title={isEditing ? "Edit work experience" : "Add work experience"}
      triggerLabel={isEditing ? "Edit" : "Add experience"}
      triggerAriaLabel={
        experience
          ? `Edit ${experience.jobTitle} at ${experience.companyName}`
          : "Add work experience"
      }
      triggerIcon={<TriggerIcon size={16} aria-hidden="true" />}
      submitLabel={isEditing ? "Save changes" : "Add experience"}
      pendingLabel="Saving work experience…"
      errorTitle="Work experience not saved"
      errorMessage="Unable to save work experience. Please try again."
      saveAction={saveAction}
      renderFields={(fieldErrors) => (
        <WorkExperienceEditorFields
          experience={experience}
          fieldErrors={fieldErrors}
        />
      )}
    />
  );
}
