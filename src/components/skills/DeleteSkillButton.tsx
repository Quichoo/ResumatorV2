import { Text } from "@mantine/core";
import DeleteRecordButton from "@/components/ui/DeleteRecordButton";
import { deleteSkill } from "@/lib/actions/skill";
import type { Skill } from "@/types/skill";

type DeleteSkillButtonProps = {
  skill: Pick<Skill, "id" | "name">;
  compact?: boolean;
};

export default function DeleteSkillButton({
  skill,
  compact = false,
}: DeleteSkillButtonProps) {
  return (
    <DeleteRecordButton
      title="Delete skill?"
      ariaLabel={`Delete ${skill.name}`}
      compact={compact}
      confirmLabel="Delete skill"
      pendingLabel="Deleting skill..."
      errorMessage="Unable to delete this skill. Please try again."
      deleteAction={deleteSkill.bind(null, skill.id)}
    >
      <Text size="sm">
        Delete <strong>{skill.name}</strong> from your profile?
      </Text>

      <Text size="sm" c="dimmed">
        This permanently removes this skill entry.
      </Text>
    </DeleteRecordButton>
  );
}
