import "server-only";

import { and, asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireUser } from "@/lib/auth-session";
import { db } from "@/lib/db";
import {
  certifications,
  educationEntries,
  profiles,
  projects,
  resumes,
  skills,
  workExperiences,
} from "@/lib/db/schema";
import {
  jobSnapshotSchema,
  profileSnapshotSchema,
} from "@/lib/validations/resume-snapshot";
import type { GetGenerationInputResult } from "@/types/resume-generation";
import { sortWorkExperiences } from "@/lib/utils/sort-work-experiences";

export async function getGenerationInput(
  resumeId: string,
): Promise<GetGenerationInputResult> {
  const user = await requireUser();

  if (!z.uuid().safeParse(resumeId).success) {
    return {
      success: false,
      message: "Resume not found.",
    };
  }

  const [resume] = await db
    .select({
      title: resumes.title,
      targetRole: resumes.targetRole,
      companyName: resumes.companyName,
      jobDescription: resumes.jobDescription,
    })
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, user.id)))
    .limit(1);

  if (!resume) {
    return {
      success: false,
      message: "Resume not found.",
    };
  }

  const [
    profileRows,
    workRows,
    educationRows,
    projectRows,
    skillRows,
    certificationRows,
  ] = await Promise.all([
    db
      .select({
        fullName: profiles.fullName,
        contactEmail: profiles.contactEmail,
        phone: profiles.phone,
        location: profiles.location,
        portfolioUrl: profiles.portfolioUrl,
        linkedinUrl: profiles.linkedinUrl,
        githubUrl: profiles.githubUrl,
        summary: profiles.summary,
      })
      .from(profiles)
      .where(eq(profiles.userId, user.id))
      .limit(1),

    db
      .select({
        id: workExperiences.id,
        jobTitle: workExperiences.jobTitle,
        companyName: workExperiences.companyName,
        location: workExperiences.location,
        startDate: workExperiences.startDate,
        endDate: workExperiences.endDate,
        isCurrent: workExperiences.isCurrent,
        description: workExperiences.description,
      })
      .from(workExperiences)
      .where(eq(workExperiences.userId, user.id))
      .orderBy(
        desc(workExperiences.isCurrent),
        desc(workExperiences.startDate),
        asc(workExperiences.id),
      ),

    db
      .select({
        id: educationEntries.id,
        schoolName: educationEntries.schoolName,
        degree: educationEntries.degree,
        fieldOfStudy: educationEntries.fieldOfStudy,
        startYear: educationEntries.startYear,
        endYear: educationEntries.endYear,
        isCurrent: educationEntries.isCurrent,
        description: educationEntries.description,
      })
      .from(educationEntries)
      .where(eq(educationEntries.userId, user.id))
      .orderBy(asc(educationEntries.id)),

    db
      .select({
        id: projects.id,
        projectName: projects.projectName,
        description: projects.description,
        technologies: projects.technologies,
        bulletPoints: projects.bulletPoints,
        projectUrl: projects.projectUrl,
        repositoryUrl: projects.repositoryUrl,
      })
      .from(projects)
      .where(eq(projects.userId, user.id))
      .orderBy(asc(projects.projectName), asc(projects.id)),

    db
      .select({
        id: skills.id,
        name: skills.name,
        category: skills.category,
      })
      .from(skills)
      .where(eq(skills.userId, user.id))
      .orderBy(asc(skills.name), asc(skills.id)),

    db
      .select({
        id: certifications.id,
        name: certifications.name,
        issuer: certifications.issuer,
        issueYear: certifications.issueYear,
        credentialId: certifications.credentialId,
        credentialUrl: certifications.credentialUrl,
        description: certifications.description,
      })
      .from(certifications)
      .where(eq(certifications.userId, user.id))
      .orderBy(asc(certifications.name), asc(certifications.id)),
  ]);

  const profile = profileRows[0];

  if (!profile) {
    return {
      success: false,
      message: "Save your master profile before generating a resume.",
    };
  }

  const parsedProfile = profileSnapshotSchema.safeParse({
    profile,
    workExperiences: sortWorkExperiences(workRows),
    educationEntries: educationRows,
    projects: projectRows,
    skills: skillRows,
    certifications: certificationRows,
  });

  if (!parsedProfile.success) {
    return {
      success: false,
      message:
        "Some saved profile information is not valid for generation. " +
        "Review your master profile before continuing.",
    };
  }

  const parsedJob = jobSnapshotSchema.safeParse(resume);

  if (!parsedJob.success) {
    return {
      success: false,
      message: "Review and save the job details before generating a resume.",
    };
  }

  return {
    success: true,
    profileSnapshot: parsedProfile.data,
    jobSnapshot: parsedJob.data,
  };
}
