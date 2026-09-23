import type { z } from "zod";
import type { projectSchema } from "@/lib/validations/project";
import type { FieldErrors, FormActionResult } from "@/types/action-result";

export type ProjectFormValues = z.input<typeof projectSchema>;

export type Project = z.output<typeof projectSchema> & {
  id: string;
};

export type ProjectFieldErrors = FieldErrors<keyof ProjectFormValues>;

export type ProjectActionResult = FormActionResult<keyof ProjectFormValues>;

export type ProjectReviewEntry = Omit<
  Required<ProjectFormValues>,
  "bulletPoints"
> & {
  bulletPointsText: string;
};

export type ProjectTextField = Exclude<
  keyof ProjectReviewEntry,
  "technologies"
>;
