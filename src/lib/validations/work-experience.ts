import { z } from "zod";

// Accepts YYYY-MM, with months 01–12 and a nonzero four-digit year.
const monthPattern = /^(?!0000)\d{4}-(0[1-9]|1[0-2])$/;

export const workExperienceSchema = z
  .object({
    jobTitle: z
      .string()
      .trim()
      .min(1, "Enter your job title.")
      .max(120, "Job title must be 120 characters or fewer."),

    companyName: z
      .string()
      .trim()
      .min(1, "Enter the company or organization name.")
      .max(160, "Company name must be 160 characters or fewer."),

    location: z
      .string()
      .trim()
      .max(120, "Location must be 120 characters or fewer.")
      .default(""),

    startDate: z
      .string()
      .trim()
      .regex(monthPattern, "Select a valid start month and year."),

    endDate: z
      .string()
      .trim()
      .max(7, "Select a valid end month and year.")
      .default(""),

    isCurrent: z.boolean(),

    description: z
      .string()
      .trim()
      .max(
        5000,
        "Responsibilities and achievements must be 5000 characters or fewer.",
      )
      .default(""),
  })
  .superRefine((values, context) => {
    if (values.isCurrent) {
      return;
    }

    if (!values.endDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Select an end month or mark this as your current job.",
      });
      return;
    }

    if (!monthPattern.test(values.endDate)) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Select a valid end month and year.",
      });
      return;
    }

    if (
      monthPattern.test(values.startDate) &&
      values.endDate < values.startDate
    ) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after the start date.",
      });
    }
  })
  .transform((values) => ({
    ...values,
    location: values.location || null,
    description: values.description || null,
    startDate: `${values.startDate}-01`,
    endDate: values.isCurrent ? null : `${values.endDate}-01`,
  }));
