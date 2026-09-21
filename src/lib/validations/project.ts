import { z } from "zod";

const httpUrlSchema = z.url({
  protocol: /^https?$/,
});

const optionalHttpUrlSchema = z
  .string()
  .trim()
  .max(2048, "URL must be 2048 characters or fewer.")
  .default("")
  .refine(
    (value) =>
      value === "" ||
      (/^https?:\/\//i.test(value) && httpUrlSchema.safeParse(value).success),
    "Enter a full URL starting with https:// or http://.",
  );

const technologiesSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Technology names cannot be empty.")
      .max(50, "Each technology name must be 50 characters or fewer."),
  )
  .max(30, "Add up to 30 technologies.")
  .default([])
  .transform((technologies) => {
    const seen = new Set<string>();

    return technologies.filter((technology) => {
      const key = technology.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  });

const bulletPointsSchema = z
  .array(
    z
      .string()
      .trim()
      .min(1, "Bullet points cannot be empty.")
      .max(500, "Each bullet point must be 500 characters or fewer."),
  )
  .max(20, "Add up to 20 bullet points.")
  .default([]);

export const projectSchema = z
  .object({
    projectName: z
      .string()
      .trim()
      .min(1, "Enter a project name.")
      .max(160, "Project name must be 160 characters or fewer."),

    description: z
      .string()
      .trim()
      .max(5000, "Description must be 5000 characters or fewer.")
      .default(""),

    technologies: technologiesSchema,

    bulletPoints: bulletPointsSchema,

    projectUrl: optionalHttpUrlSchema,

    repositoryUrl: optionalHttpUrlSchema,
  })
  .transform((values) => ({
    ...values,
    description: values.description || null,
    projectUrl: values.projectUrl || null,
    repositoryUrl: values.repositoryUrl || null,
  }));
