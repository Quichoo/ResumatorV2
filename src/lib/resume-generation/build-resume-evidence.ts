import { buildWorkEvidence } from "./build-work-evidence";
import type { ProfileSnapshot } from "@/types/resume-generation";

export type ResumeEvidenceItem = {
  evidenceId: string;
  sourceType:
    | "profile"
    | "workExperience"
    | "project"
    | "skill"
    | "education"
    | "certification";
  sourceId: string | null;
  text: string;
};

export function buildResumeEvidence(
  snapshot: ProfileSnapshot,
): ResumeEvidenceItem[] {
  const evidence: ResumeEvidenceItem[] = [];

  if (snapshot.profile.summary?.trim()) {
    evidence.push({
      evidenceId: "profile:summary",
      sourceType: "profile",
      sourceId: null,
      text: snapshot.profile.summary,
    });
  }

  for (const entry of buildWorkEvidence(snapshot.workExperiences)) {
    for (const item of entry.evidence) {
      evidence.push({
        ...item,
        sourceType: "workExperience",
      });
    }
  }

  for (const entry of snapshot.workExperiences) {
    evidence.push({
      evidenceId: `work:${entry.id}:details`,
      sourceType: "workExperience",
      sourceId: entry.id,
      text: JSON.stringify({
        jobTitle: entry.jobTitle,
        companyName: entry.companyName,
        startDate: entry.startDate,
        endDate: entry.endDate,
        isCurrent: entry.isCurrent,
      }),
    });
  }

  for (const entry of snapshot.projects) {
    evidence.push({
      evidenceId: `project:${entry.id}:details`,
      sourceType: "project",
      sourceId: entry.id,
      text: JSON.stringify({
        projectName: entry.projectName,
        description: entry.description,
        technologies: entry.technologies,
      }),
    });

    entry.bulletPoints.forEach((text, index) => {
      evidence.push({
        evidenceId: `project:${entry.id}:bullet:${index + 1}`,
        sourceType: "project",
        sourceId: entry.id,
        text,
      });
    });
  }

  for (const entry of snapshot.skills) {
    evidence.push({
      evidenceId: `skill:${entry.id}`,
      sourceType: "skill",
      sourceId: entry.id,
      text: entry.name,
    });
  }

  for (const entry of snapshot.educationEntries) {
    evidence.push({
      evidenceId: `education:${entry.id}:details`,
      sourceType: "education",
      sourceId: entry.id,
      text: JSON.stringify({
        schoolName: entry.schoolName,
        degree: entry.degree,
        fieldOfStudy: entry.fieldOfStudy,
        startYear: entry.startYear,
        endYear: entry.endYear,
        isCurrent: entry.isCurrent,
        description: entry.description,
      }),
    });
  }

  for (const entry of snapshot.certifications) {
    evidence.push({
      evidenceId: `certification:${entry.id}:details`,
      sourceType: "certification",
      sourceId: entry.id,
      text: JSON.stringify({
        name: entry.name,
        issuer: entry.issuer,
        issueYear: entry.issueYear,
        description: entry.description,
      }),
    });
  }

  return evidence;
}
