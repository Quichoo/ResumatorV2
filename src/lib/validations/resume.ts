import { z } from "zod";

export const resumeSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Enter a title for this resume.")
      .max(160, "Title must be 160 characters or fewer."),

    targetRole: z
      .string()
      .trim()
      .min(1, "Enter the role you are applying for.")
      .max(160, "Target role must be 160 characters or fewer."),

    companyName: z
      .string()
      .trim()
      .max(160, "Company name must be 160 characters or fewer.")
      .default(""),

    jobDescription: z
      .string()
      .trim()
      .min(1, "Paste the job description.")
      .max(30_000, "Job description must be 30,000 characters or fewer."),
  })
  .transform((values) => ({
    ...values,
    companyName: values.companyName || null,
  }));
