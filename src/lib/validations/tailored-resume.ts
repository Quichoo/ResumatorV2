import { z } from "zod";

const supportedStatementSchema = z.strictObject({
  text: z.string().trim().min(1).max(500),
  evidenceIds: z.array(z.string().min(1).max(200)).min(1).max(10),
});

export const tailoredResumeSchema = z.strictObject({
  summary: z.array(supportedStatementSchema).min(1).max(3).nullable(),

  workExperiences: z.array(
    z.strictObject({
      sourceId: z.uuid(),
      emphasis: z.enum(["detailed", "brief"]),
      bulletPoints: z.array(supportedStatementSchema).max(5),
    }),
  ),

  projects: z.array(
    z.strictObject({
      sourceId: z.uuid(),
      bulletPoints: z.array(supportedStatementSchema).max(3),
    }),
  ),

  skillIds: z.array(z.uuid()),
});
