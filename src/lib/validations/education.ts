import { z } from "zod";

const optionalYearSchema = z
  .string()
  .trim()
  .regex(
    /^(?:[1-9]\d{3})?$/,
    "Enter a four-digit year between 1000 and 9999, or leave it empty.",
  )
  .default("")
  .transform((value) => (value === "" ? null : Number(value)));

export const educationSchema = z
  .object({
    schoolName: z
      .string()
      .trim()
      .min(1, "Enter your school or institution.")
      .max(160, "School name must be 160 characters or fewer."),

    degree: z
      .string()
      .trim()
      .min(1, "Enter your degree, qualification, or program.")
      .max(160, "Degree or program must be 160 characters or fewer."),

    fieldOfStudy: z
      .string()
      .trim()
      .max(160, "Field of study must be 160 characters or fewer.")
      .default(""),

    startYear: optionalYearSchema,
    endYear: optionalYearSchema,

    isCurrent: z.boolean(),

    description: z
      .string()
      .trim()
      .max(5000, "Description must be 5000 characters or fewer.")
      .default(""),
  })
  .superRefine((values, context) => {
    if (values.isCurrent) return;

    if (
      values.startYear !== null &&
      values.endYear !== null &&
      values.endYear < values.startYear
    ) {
      context.addIssue({
        code: "custom",
        path: ["endYear"],
        message: "End year must be on or after the start year.",
      });
    }
  })
  .transform((values) => ({
    ...values,
    fieldOfStudy: values.fieldOfStudy || null,
    description: values.description || null,
    endYear: values.isCurrent ? null : values.endYear,
  }));
