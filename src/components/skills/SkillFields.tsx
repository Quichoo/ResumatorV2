import { Stack, TextInput } from "@mantine/core";
import type { Skill, SkillFieldErrors } from "@/types/skill";

type SkillFieldsProps = {
  skill?: Skill;
  fieldErrors?: SkillFieldErrors;
  disabled?: boolean;
};

export default function SkillFields({
  skill,
  fieldErrors,
  disabled = false,
}: SkillFieldsProps) {
  return (
    <Stack gap="md">
      <TextInput
        name="name"
        label="Skill name"
        placeholder="For example: React"
        defaultValue={skill?.name ?? ""}
        error={fieldErrors?.name?.join(" ")}
        maxLength={80}
        disabled={disabled}
        required
        data-autofocus
      />

      <TextInput
        name="category"
        label="Category"
        description="Optional. For example: Frameworks, Databases, or Tools."
        defaultValue={skill?.category ?? ""}
        error={fieldErrors?.category?.join(" ")}
        maxLength={60}
        disabled={disabled}
      />
    </Stack>
  );
}