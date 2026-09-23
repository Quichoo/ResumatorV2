import type { z } from "zod";
import type { workExperienceSchema } from "@/lib/validations/work-experience";

export type WorkExperienceFormValues = z.input<typeof workExperienceSchema>;

export type WorkExperience = z.output<typeof workExperienceSchema> & {
  id: string;
};

export type WorkExperienceFieldErrors = Partial<
  Record<keyof WorkExperienceFormValues, string[]>
>;

export type WorkExperienceActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: WorkExperienceFieldErrors;
    };

export type WorkExperienceTextField = Exclude<
  keyof WorkExperienceFormValues,
  "isCurrent"
>;
