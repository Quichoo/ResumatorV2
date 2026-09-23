import type { ChangeEvent } from "react";
import { Stack, TextInput } from "@mantine/core";
import type { Skill, SkillFieldErrors, SkillReviewEntry } from "@/types/skill";

type SkillFieldsProps = {
  skill?: Skill;
  fieldErrors?: SkillFieldErrors;
  disabled?: boolean;
  values?: SkillReviewEntry;
  onValuesChange?: (patch: Partial<SkillReviewEntry>) => void;
};

export default function SkillFields({
  skill,
  fieldErrors,
  disabled = false,
  values,
  onValuesChange,
}: SkillFieldsProps) {
  function inputProps(field: keyof SkillReviewEntry) {
    if (onValuesChange) {
      return {
        value: values?.[field] ?? "",
        onChange: (event: ChangeEvent<HTMLInputElement>) =>
          onValuesChange({ [field]: event.currentTarget.value }),
      };
    }

    return {
      defaultValue: skill?.[field] ?? "",
    };
  }

  return (
    <Stack gap="md">
      <TextInput
        name="name"
        label="Skill name"
        placeholder="For example: React"
        {...inputProps("name")}
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
        {...inputProps("category")}
        error={fieldErrors?.category?.join(" ")}
        maxLength={60}
        disabled={disabled}
      />
    </Stack>
  );
}
