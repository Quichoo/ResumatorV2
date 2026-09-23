import { z } from "zod";
import { profileSchema } from "@/lib/validations/profile";
import { workExperienceSchema } from "@/lib/validations/work-experience";
import { educationSchema } from "@/lib/validations/education";
import { projectSchema } from "@/lib/validations/project";
import { skillSchema } from "@/lib/validations/skill";
import { certificationSchema } from "@/lib/validations/certification";

export const resumeImportSchema = z
  .strictObject({
    requestId: z.uuid(),

    profile: profileSchema.nullable(),

    workExperiences: z
      .array(workExperienceSchema)
      .max(50, "Import up to 50 work experiences at once."),

    educationEntries: z
      .array(educationSchema)
      .max(30, "Import up to 30 education entries at once."),

    projects: z
      .array(projectSchema)
      .max(50, "Import up to 50 projects at once."),

    skills: z.array(skillSchema).max(200, "Import up to 200 skills at once."),

    certifications: z
      .array(certificationSchema)
      .max(50, "Import up to 50 certifications or courses at once.")
      .default([]),
  })
  .superRefine((values, context) => {
    const hasSelection =
      values.profile !== null ||
      values.workExperiences.length > 0 ||
      values.educationEntries.length > 0 ||
      values.projects.length > 0 ||
      values.skills.length > 0 ||
      values.certifications.length > 0;

    if (!hasSelection) {
      context.addIssue({
        code: "custom",
        path: [],
        message: "Select personal details or at least one entry to import.",
      });
    }

    const seenSkills = new Set<string>();

    values.skills.forEach((skill, index) => {
      const normalizedName = skill.name.trim().toLowerCase();

      if (seenSkills.has(normalizedName)) {
        context.addIssue({
          code: "custom",
          path: ["skills", index, "name"],
          message:
            "This skill is selected more than once. Rename or exclude the duplicate.",
        });
      }

      seenSkills.add(normalizedName);
    });
  });
