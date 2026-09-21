"use client";

import { IconPencil, IconPlus } from "@tabler/icons-react";
import EducationEditorFields from "@/components/education/EducationEditorFields";
import RecordEditor from "@/components/ui/RecordEditor";
import {
  createEducationEntry,
  updateEducationEntry,
} from "@/lib/actions/education";
import type { EducationEntry, EducationFormValues } from "@/types/education";

type EducationEditorProps = {
  entry?: EducationEntry;
};

export default function EducationEditor({ entry }: EducationEditorProps) {
  const isEditing = Boolean(entry);
  const TriggerIcon = isEditing ? IconPencil : IconPlus;

  const saveAction = entry
    ? (formData: FormData) => updateEducationEntry(entry.id, formData)
    : createEducationEntry;

  return (
    <RecordEditor<keyof EducationFormValues>
      title={isEditing ? "Edit education" : "Add education"}
      triggerLabel={isEditing ? "Edit" : "Add education"}
      triggerAriaLabel={
        entry ? `Edit ${entry.degree} at ${entry.schoolName}` : "Add education"
      }
      triggerIcon={<TriggerIcon size={16} aria-hidden="true" />}
      submitLabel={isEditing ? "Save changes" : "Add education"}
      pendingLabel="Saving education…"
      errorTitle="Education not saved"
      errorMessage="Unable to save education. Please try again."
      saveAction={saveAction}
      renderFields={(fieldErrors) => (
        <EducationEditorFields entry={entry} fieldErrors={fieldErrors} />
      )}
    />
  );
}
