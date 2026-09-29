import type { z } from "zod";
import type { resumeSchema } from "@/lib/validations/resume";
import type { FieldErrors } from "@/types/action-result";

export type ResumeFormValues = z.input<typeof resumeSchema>;

export type ValidatedResumeValues = z.output<typeof resumeSchema>;

export type ResumeFieldErrors = FieldErrors<keyof ResumeFormValues>;

type ResumeSummary = {
  id: string;
  title: string;
  targetRole: string;
  companyName: string | null;
  updatedAt: string;
};

export type ResumeListItem = ResumeSummary & {
  hasGeneratedDraft: boolean;
};

export type ResumeDetails = ResumeSummary & {
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

export type UpdateResumeResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: ResumeFieldErrors;
    };
