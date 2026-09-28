import { z } from "zod";

const requiredText = (maxLength: number) =>
  z.string().trim().min(1).max(maxLength);

const nullableText = (maxLength: number) =>
  z.string().max(maxLength).nullable();

const nullableUrl = z
  .url({ protocol: /^https?$/ })
  .max(2048)
  .nullable();

const nullableYear = z.number().int().min(1000).max(9999).nullable();

const profileSnapshotDetailsSchema = z.strictObject({
  fullName: requiredText(120),
  contactEmail: z.email().max(254),
  phone: nullableText(40),
  location: nullableText(120),
  portfolioUrl: nullableUrl,
  linkedinUrl: nullableUrl,
  githubUrl: nullableUrl,
  summary: nullableText(5000),
});

const workExperienceSnapshotSchema = z
  .strictObject({
    id: z.uuid(),
    jobTitle: requiredText(120),
    companyName: requiredText(160),
    location: nullableText(120),
    startDate: z.iso.date(),
    endDate: z.iso.date().nullable(),
    isCurrent: z.boolean(),
    description: nullableText(5000),
  })
  .superRefine((entry, context) => {
    if (entry.isCurrent && entry.endDate !== null) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Current employment must not have an end date.",
      });
    }

    if (!entry.isCurrent && entry.endDate === null) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Completed employment must have an end date.",
      });
    }

    if (entry.endDate !== null && entry.endDate < entry.startDate) {
      context.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be on or after the start date.",
      });
    }
  });

const educationSnapshotSchema = z
  .strictObject({
    id: z.uuid(),
    schoolName: requiredText(160),
    degree: requiredText(160),
    fieldOfStudy: nullableText(160),
    startYear: nullableYear,
    endYear: nullableYear,
    isCurrent: z.boolean(),
    description: nullableText(5000),
  })
  .superRefine((entry, context) => {
    if (entry.isCurrent && entry.endYear !== null) {
      context.addIssue({
        code: "custom",
        path: ["endYear"],
        message: "Ongoing education must not have a completed end year.",
      });
    }

    if (
      entry.startYear !== null &&
      entry.endYear !== null &&
      entry.endYear < entry.startYear
    ) {
      context.addIssue({
        code: "custom",
        path: ["endYear"],
        message: "End year must be on or after the start year.",
      });
    }
  });

const projectSnapshotSchema = z.strictObject({
  id: z.uuid(),
  projectName: requiredText(160),
  description: nullableText(5000),
  technologies: z.array(requiredText(50)).max(30),
  bulletPoints: z.array(requiredText(500)).max(20),
  projectUrl: nullableUrl,
  repositoryUrl: nullableUrl,
});

const skillSnapshotSchema = z.strictObject({
  id: z.uuid(),
  name: requiredText(80),
  category: nullableText(60),
});

const certificationSnapshotSchema = z.strictObject({
  id: z.uuid(),
  name: requiredText(160),
  issuer: requiredText(160),
  issueYear: nullableYear,
  credentialId: nullableText(200),
  credentialUrl: nullableUrl,
  description: nullableText(5000),
});

export const profileSnapshotSchema = z
  .strictObject({
    profile: profileSnapshotDetailsSchema,
    workExperiences: z.array(workExperienceSnapshotSchema),
    educationEntries: z.array(educationSnapshotSchema),
    projects: z.array(projectSnapshotSchema),
    skills: z.array(skillSnapshotSchema),
    certifications: z.array(certificationSnapshotSchema),
  })
  .superRefine((snapshot, context) => {
    const sections = [
      "workExperiences",
      "educationEntries",
      "projects",
      "skills",
      "certifications",
    ] as const;

    for (const section of sections) {
      const seen = new Set<string>();

      snapshot[section].forEach((entry, index) => {
        if (seen.has(entry.id)) {
          context.addIssue({
            code: "custom",
            path: [section, index, "id"],
            message: "A snapshot cannot contain duplicate entry IDs.",
          });
        }

        seen.add(entry.id);
      });
    }
  });

export const jobSnapshotSchema = z.strictObject({
  title: requiredText(160),
  targetRole: requiredText(160),
  companyName: nullableText(160),
  jobDescription: requiredText(30_000),
});
