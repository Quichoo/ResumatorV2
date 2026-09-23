import type { z } from "zod";
import type { resumeSchema } from "@/lib/validations/resume";
import type { FieldErrors } from "@/types/action-result";

export type ResumeFormValues = z.input<typeof resumeSchema>;

export type ValidatedResumeValues = z.output<typeof resumeSchema>;

export type ResumeFieldErrors = FieldErrors<keyof ResumeFormValues>;

export type ResumeListItem = {
  id: string;
  title: string;
  targetRole: string;
  companyName: string | null;
  updatedAt: string;
};

export type ResumeDetails = ResumeListItem & {
  jobDescription: string;
  createdAt: string;
};

export type CreateResumeResult =
  | {
      success: true;
      message: string;
      resumeId: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: ResumeFieldErrors;
    };

export type GetResumesResult =
  | {
      success: true;
      resumes: ResumeListItem[];
    }
  | {
      success: false;
      message: string;
    };
