import type { z } from "zod";
import type { resumeDraftSchema } from "@/lib/validations/resume-draft";

export type ResumeDraft = z.infer<typeof resumeDraftSchema> & {
  sourceObservations?: string[];
};

export type ProfileDraft = ResumeDraft["profile"];

export type WorkExperienceDraft = ResumeDraft["workExperiences"][number];

export type EducationDraft = ResumeDraft["educationEntries"][number];

export type ProjectDraft = ResumeDraft["projects"][number];

export type SkillDraft = ResumeDraft["skills"][number];

export type ExtractResumeDraftResult =
  | {
      success: true;
      message: string;
      data: ResumeDraft;
    }
  | {
      success: false;
      message: string;
    };

export type CertificationDraft = ResumeDraft["certifications"][number];
