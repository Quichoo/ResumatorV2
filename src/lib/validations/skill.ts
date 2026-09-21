import { z } from "zod";

export const skillSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Enter a skill name.")
      .max(80, "Skill name must be 80 characters or fewer."),

    category: z
      .string()
      .trim()
      .max(60, "Category must be 60 characters or fewer.")
      .default(""),
  })
  .transform((values) => ({
    ...values,
    category: values.category || null,
  }));
