import { z } from "zod";

function nullableText(maxLength: number) {
  return z.string().trim().min(1).max(maxLength).nullable();
}

const monthSchema = z
  .string()
  .regex(/^[1-9]\d{3}-(0[1-9]|1[0-2])$/, "Dates must use YYYY-MM.")
  .nullable();

const yearSchema = z.number().int().min(1000).max(9999).nullable();

const profileDraftSchema = z.strictObject({
  fullName: nullableText(200),
  contactEmail: nullableText(320),
  phone: nullableText(80),
  location: nullableText(250),
  portfolioUrl: nullableText(2048),
  linkedinUrl: nullableText(2048),
  githubUrl: nullableText(2048),
  summary: nullableText(6000),
});

const workExperienceDraftSchema = z.strictObject({
  jobTitle: nullableText(250),
  companyName: nullableText(250),
  location: nullableText(250),
  startDate: monthSchema,
  endDate: monthSchema,
  isCurrent: z.boolean().nullable(),
  dateText: nullableText(500),
  description: nullableText(10000),
});

const educationDraftSchema = z.strictObject({
  schoolName: nullableText(250),
  degree: nullableText(250),
  fieldOfStudy: nullableText(250),
  startYear: yearSchema,
  endYear: yearSchema,
  isCurrent: z.boolean().nullable(),
  dateText: nullableText(500),
  description: nullableText(10000),
});

const projectDraftSchema = z.strictObject({
  projectName: nullableText(250),
  description: nullableText(10000),
  technologies: z.array(z.string().trim().min(1).max(150)).max(100),
  bulletPoints: z.array(z.string().trim().min(1).max(2000)).max(50),
  projectUrl: nullableText(2048),
  repositoryUrl: nullableText(2048),
});

const skillDraftSchema = z.strictObject({
  name: z.string().trim().min(1).max(150),
  category: nullableText(150),
});

const certificationDraftSchema = z
  .object({
    name: z.string().trim().min(1).max(200).nullable(),
    issuer: z.string().trim().min(1).max(160).nullable(),
    issueYear: z.number().int().min(1000).max(9999).nullable(),
    credentialId: z.string().trim().min(1).max(200).nullable(),
    credentialUrl: z.string().trim().min(1).max(2048).nullable(),
    description: z.string().trim().min(1).max(5000).nullable(),
  })
  .strict();

export const resumeDraftSchema = z.strictObject({
  profile: profileDraftSchema,
  workExperiences: z.array(workExperienceDraftSchema).max(50),
  educationEntries: z.array(educationDraftSchema).max(30),
  projects: z.array(projectDraftSchema).max(50),
  skills: z.array(skillDraftSchema).max(200),
  warnings: z.array(z.string().trim().min(1).max(1000)).max(100),
  certifications: z.array(certificationDraftSchema).max(50),
});
