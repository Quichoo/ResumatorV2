import type { z } from "zod";
import type {
  jobSnapshotSchema,
  profileSnapshotSchema,
} from "@/lib/validations/resume-snapshot";
import type { tailoredResumeSchema } from "@/lib/validations/tailored-resume";

export type ProfileSnapshot = z.infer<typeof profileSnapshotSchema>;

export type JobSnapshot = z.infer<typeof jobSnapshotSchema>;

export type ResumeGenerationStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export type TailoredResumeDraft = z.infer<typeof tailoredResumeSchema>;

export type GetGenerationInputResult =
  | {
      success: true;
      profileSnapshot: ProfileSnapshot;
      jobSnapshot: JobSnapshot;
    }
  | {
      success: false;
      message: string;
    };

export type GenerateResumeResult =
  | {
      success: true;
      generationId: string;
      status: "running" | "completed";
      message: string;
    }
  | {
      success: false;
      message: string;
      retryMode?: "same" | "new";
    };
