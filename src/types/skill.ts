import type { z } from "zod";
import type { skillSchema } from "@/lib/validations/skill";
import type { FieldErrors, FormActionResult } from "@/types/action-result";

export type SkillFormValues = z.input<typeof skillSchema>;

export type Skill = z.output<typeof skillSchema> & {
  id: string;
};

export type SkillFieldErrors = FieldErrors<keyof SkillFormValues>;

export type SkillActionResult = FormActionResult<keyof SkillFormValues>;
