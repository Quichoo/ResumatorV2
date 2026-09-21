import type { z } from "zod";
import type { educationSchema } from "@/lib/validations/education";

export type EducationFormValues = z.input<typeof educationSchema>;

export type EducationEntry = z.output<typeof educationSchema> & {
  id: string;
};

export type EducationFieldErrors = Partial<
  Record<keyof EducationFormValues, string[]>
>;

export type EducationActionResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: EducationFieldErrors;
    };
