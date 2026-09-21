"use client";

import { IconPencil, IconPlus } from "@tabler/icons-react";
import SkillFields from "@/components/skills/SkillFields";
import RecordEditor from "@/components/ui/RecordEditor";
import { saveSkill } from "@/lib/actions/skill";
import type { Skill, SkillFormValues } from "@/types/skill";

type SkillEditorProps = {
  skill?: Skill;
};

export default function SkillEditor({ skill }: SkillEditorProps) {
  const TriggerIcon = skill ? IconPencil : IconPlus;
  const saveAction = saveSkill.bind(null, skill?.id ?? null);

  return (
    <RecordEditor<keyof SkillFormValues>
      title={skill ? "Edit skill" : "Add skill"}
      triggerLabel={skill ? "Edit" : "Add skill"}
      triggerAriaLabel={skill ? `Edit ${skill.name}` : "Add skill"}
      triggerIcon={<TriggerIcon size={16} aria-hidden="true" />}
      submitLabel={skill ? "Save changes" : "Add skill"}
      pendingLabel="Saving skill…"
      errorTitle="Skill not saved"
      errorMessage="Unable to save this skill. Please try again."
      saveAction={saveAction}
      renderFields={(fieldErrors, pending) => (
        <SkillFields
          skill={skill}
          fieldErrors={fieldErrors}
          disabled={pending}
        />
      )}
    />
  );
}
