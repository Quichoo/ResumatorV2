import type { z } from "zod";
import type { profileSchema } from "@/lib/validations/profile";

export type ProfileFormValues = z.input<typeof profileSchema>;

export type ProfileFieldErrors = Partial<
  Record<keyof ProfileFormValues, string[]>
>;

export type SaveProfileResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: ProfileFieldErrors;
    };
