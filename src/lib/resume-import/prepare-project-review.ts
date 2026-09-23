import type { ProjectFormValues, ProjectReviewEntry } from "@/types/project";

export function prepareProjectReview(
  entry: ProjectReviewEntry,
): ProjectFormValues {
  return {
    projectName: entry.projectName,
    description: entry.description,
    technologies: entry.technologies,
    bulletPoints: entry.bulletPointsText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0),
    projectUrl: entry.projectUrl,
    repositoryUrl: entry.repositoryUrl,
  };
}
