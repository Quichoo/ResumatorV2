"use client";

import { useState } from "react";
import { useSelectableEntries } from "@/hooks/useSelectableEntries";
import type { EducationReviewEntry } from "@/types/education";
import type { ProfileFormValues } from "@/types/profile";
import type { ProjectReviewEntry } from "@/types/project";
import type {
  ProfileDraft,
  ResumeDraft,
  WorkExperienceDraft,
} from "@/types/resume-draft";
import { prepareProjectReview } from "@/lib/resume-import/prepare-project-review";
import type { SkillReviewEntry } from "@/types/skill";

export function useResumeDraftReview(initialDraft: ResumeDraft) {
  const [profile, setProfile] = useState<ProfileDraft>(initialDraft.profile);
  const [includeProfile, setIncludeProfile] = useState(false);

  const work = useSelectableEntries<WorkExperienceDraft>(
    () => initialDraft.workExperiences,
  );

  const education = useSelectableEntries<EducationReviewEntry>(() =>
    initialDraft.educationEntries.map((entry) => ({
      schoolName: entry.schoolName ?? "",
      degree: entry.degree ?? "",
      fieldOfStudy: entry.fieldOfStudy ?? "",
      startYear: entry.startYear?.toString() ?? "",
      endYear: entry.endYear?.toString() ?? "",
      isCurrent: entry.isCurrent,
      description: entry.description ?? "",
      dateText: entry.dateText,
    })),
  );

  const projects = useSelectableEntries<ProjectReviewEntry>(() =>
    initialDraft.projects.map((project) => ({
      projectName: project.projectName ?? "",
      description: project.description ?? "",
      technologies: [...project.technologies],
      bulletPointsText: project.bulletPoints.join("\n"),
      projectUrl: project.projectUrl ?? "",
      repositoryUrl: project.repositoryUrl ?? "",
    })),
  );

  const skills = useSelectableEntries<SkillReviewEntry>(() =>
    initialDraft.skills.map((skill) => ({
      name: skill.name,
      category: skill.category ?? "",
    })),
  );

  const profileValues: ProfileFormValues = {
    fullName: profile.fullName ?? "",
    contactEmail: profile.contactEmail ?? "",
    phone: profile.phone ?? "",
    location: profile.location ?? "",
    portfolioUrl: profile.portfolioUrl ?? "",
    linkedinUrl: profile.linkedinUrl ?? "",
    githubUrl: profile.githubUrl ?? "",
    summary: profile.summary ?? "",
  };

  function updateProfile(field: keyof ProfileFormValues, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value === "" ? null : value,
    }));
  }

  // Summary counts describe all extracted entries, including excluded ones.
  // Original extraction warnings remain unchanged.
  const summaryDraft: ResumeDraft = {
    ...initialDraft,
    profile,
    workExperiences: work.entries,
    skills: skills.entries.map((skill) => ({
      name: skill.name,
      category: skill.category || null,
    })),
  };

  function getImportContent() {
    return {
      profile: includeProfile ? profileValues : null,

      workExperiences: work.entries
        .filter((_, index) => work.selected[index])
        .map((entry) => ({
          jobTitle: entry.jobTitle ?? "",
          companyName: entry.companyName ?? "",
          location: entry.location ?? "",
          startDate: entry.startDate ?? "",
          endDate: entry.endDate ?? "",
          isCurrent: entry.isCurrent,
          description: entry.description ?? "",
        })),

      educationEntries: education.entries
        .filter((_, index) => education.selected[index])
        .map((entry) => ({
          schoolName: entry.schoolName,
          degree: entry.degree,
          fieldOfStudy: entry.fieldOfStudy,
          startYear: entry.startYear,
          endYear: entry.endYear,
          isCurrent: entry.isCurrent,
          description: entry.description,
        })),

      projects: projects.entries
        .filter((_, index) => projects.selected[index])
        .map(prepareProjectReview),

      skills: skills.entries.filter((_, index) => skills.selected[index]),
    };
  }

  return {
    summaryDraft,
    profileValues,
    includeProfile,
    setIncludeProfile,
    updateProfile,
    work,
    education,
    projects,
    skills,
    getImportContent,
  };
}
