import type { z } from "zod";
import type { resumeImportSchema } from "@/lib/validations/resume-import";

export type ResumeImportInput = z.input<typeof resumeImportSchema>;

export type ValidatedResumeImport = z.output<typeof resumeImportSchema>;

export type ResumeImportIssue = {
  path: Array<string | number>;
  message: string;
};

export type SaveResumeImportResult =
  | {
      success: true;
      message: string;
      alreadyImported: boolean;
    }
  | {
      success: false;
      message: string;
      issues?: ResumeImportIssue[];
    };

export type ResumeTextPreview = {
  text: string;
  pageCount: number;
};

export type ExtractResumeTextResult =
  | {
      success: true;
      message: string;
      data: ResumeTextPreview;
    }
  | {
      success: false;
      message: string;
    };
