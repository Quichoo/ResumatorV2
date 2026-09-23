import type { ResumeDraft } from "@/types/resume-draft";

export function getDateWarnings(
  draft: ResumeDraft,
  currentDate: string,
): string[] {
  const currentMonth = currentDate.slice(0, 7);
  const currentYear = Number(currentDate.slice(0, 4));
  const warnings: string[] = [];

  for (const entry of draft.workExperiences) {
    const label = entry.jobTitle ?? "Untitled work experience";

    if (entry.startDate && entry.startDate > currentMonth) {
      warnings.push(
        `Work experience "${label}" starts in ${entry.startDate}, ` +
          `after the current month (${currentMonth}). Please verify.`,
      );
    }

    if (entry.endDate && entry.endDate > currentMonth) {
      warnings.push(
        `Work experience "${label}" ends in ${entry.endDate}, ` +
          `after the current month (${currentMonth}). ` +
          "Confirm whether this is an expected end date.",
      );
    }
  }

  for (const entry of draft.educationEntries) {
    const label = entry.schoolName ?? "Untitled education entry";

    if (entry.startYear !== null && entry.startYear > currentYear) {
      warnings.push(
        `Education at "${label}" starts in ${entry.startYear}, ` +
          `after the current year (${currentYear}). Please verify.`,
      );
    }

    if (entry.endYear !== null && entry.endYear > currentYear) {
      warnings.push(
        `Education at "${label}" ends in ${entry.endYear}, ` +
          `after the current year (${currentYear}). ` +
          "Confirm whether this is an expected graduation year.",
      );
    }
  }

  return warnings;
}
