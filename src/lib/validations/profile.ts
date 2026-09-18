import { z } from "zod";

function optionalText(label: string, maxLength: number) {
  return z
    .string()
    .trim()
    .max(maxLength, `${label} must be ${maxLength} characters or fewer.`)
    .optional()
    .transform((value) => value || null);
}

const webUrlSchema = z.url({
  protocol: /^https?$/,
});

const optionalUrl = z
  .string()
  .trim()
  .max(2048, "URL must be 2048 characters or fewer.")
  .refine((value) => value === "" || webUrlSchema.safeParse(value).success, {
    message: "Enter a complete URL using https:// or http://.",
  })
  .optional()
  .transform((value) => value || null);

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Enter your full name.")
    .max(120, "Full name must be 120 characters or fewer."),

  contactEmail: z
    .string()
    .trim()
    .min(1, "Enter your contact email.")
    .max(254, "Email must be 254 characters or fewer.")
    .pipe(z.email({ error: "Enter a valid email address." })),

  phone: optionalText("Phone number", 40),
  location: optionalText("Location", 120),

  portfolioUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,

  summary: optionalText("Professional summary", 5000),
});
