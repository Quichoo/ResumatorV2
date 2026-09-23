import { z } from "zod";

const httpUrlSchema = z.url({
  protocol: /^https?$/,
});

const optionalCredentialUrlSchema = z
  .string()
  .trim()
  .max(2048, "Credential URL must be 2048 characters or fewer.")
  .default("")
  .refine(
    (value) =>
      value === "" ||
      (/^https?:\/\//i.test(value) && httpUrlSchema.safeParse(value).success),
    "Enter a full URL starting with https:// or http://.",
  );

const optionalIssueYearSchema = z
  .string()
  .trim()
  .regex(
    /^(?:[1-9]\d{3})?$/,
    "Enter a four-digit year between 1000 and 9999, or leave it empty.",
  )
  .default("")
  .transform((value) => (value === "" ? null : Number(value)));

export const certificationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Enter the certification or course name.")
      .max(200, "Name must be 200 characters or fewer."),

    issuer: z
      .string()
      .trim()
      .min(1, "Enter the issuer or platform.")
      .max(160, "Issuer must be 160 characters or fewer."),

    issueYear: optionalIssueYearSchema,

    credentialId: z
      .string()
      .trim()
      .max(200, "Credential ID must be 200 characters or fewer.")
      .default(""),

    credentialUrl: optionalCredentialUrlSchema,

    description: z
      .string()
      .trim()
      .max(5000, "Additional details must be 5000 characters or fewer.")
      .default(""),
  })
  .transform((values) => ({
    ...values,
    credentialId: values.credentialId || null,
    credentialUrl: values.credentialUrl || null,
    description: values.description || null,
  }));
