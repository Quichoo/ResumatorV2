import { getDateWarnings } from "@/lib/resume-import/get-date-warnings";
import type { ResumeDraft } from "@/types/resume-draft";

export function getDraftWarnings(
  draft: ResumeDraft,
  currentDate: string,
): string[] {
  const warnings = getDateWarnings(draft, currentDate);

  function requireText(value: string | null, label: string, field: string) {
    if (!value?.trim()) {
      warnings.push(`${label}: ${field} is missing.`);
    }
  }

  requireText(draft.profile.fullName, "Profile", "full name");
  requireText(draft.profile.contactEmail, "Profile", "contact email");

  for (const [index, entry] of draft.workExperiences.entries()) {
    const label = `Work experience ${index + 1}`;

    requireText(entry.jobTitle, label, "job title");
    requireText(entry.companyName, label, "company or organization");

    if (!entry.startDate) {
      warnings.push(`${label}: select a start month and year.`);
    }

    if (entry.isCurrent === null) {
      warnings.push(`${label}: confirm whether this is a current role.`);
    } else if (!entry.isCurrent && !entry.endDate) {
      warnings.push(`${label}: select an end month and year.`);
    }

    if (entry.isCurrent && entry.endDate) {
      warnings.push(`${label}: a current role should not have an end date.`);
    }

    if (entry.startDate && entry.endDate && entry.endDate < entry.startDate) {
      warnings.push(`${label}: the end date precedes the start date.`);
    }
  }

  for (const [index, entry] of draft.educationEntries.entries()) {
    const label = `Education ${index + 1}`;

    requireText(entry.schoolName, label, "school or institution");
    requireText(entry.degree, label, "degree or program");

    if (entry.isCurrent === null) {
      warnings.push(`${label}: confirm whether you currently study here.`);
    }

    if (entry.isCurrent && entry.endYear !== null) {
      warnings.push(
        `${label}: ongoing study should not have a completed end year.`,
      );
    }

    if (
      entry.startYear !== null &&
      entry.endYear !== null &&
      entry.endYear < entry.startYear
    ) {
      warnings.push(`${label}: the end year precedes the start year.`);
    }
  }

  for (const [index, entry] of draft.projects.entries()) {
    requireText(entry.projectName, `Project ${index + 1}`, "project name");
  }

  for (const [index, entry] of draft.skills.entries()) {
    requireText(entry.name, `Skill ${index + 1}`, "skill name");
  }

  for (const [index, entry] of draft.certifications.entries()) {
    const label = `Certification ${index + 1}`;

    requireText(entry.name, label, "name");
    requireText(entry.issuer, label, "issuer");
  }

  return [...new Set(warnings)];
}
