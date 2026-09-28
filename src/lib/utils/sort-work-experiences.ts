type DatedWorkExperience = {
  id: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  emphasis?: "detailed" | "brief";
};

export function sortWorkExperiences<T extends DatedWorkExperience>(
  entries: readonly T[],
): T[] {
  return [...entries].sort((a, b) => {
    if (a.isCurrent !== b.isCurrent) {
      return a.isCurrent ? -1 : 1;
    }

    // Completed jobs are ordered by end month.
    // Current jobs share the same recency group.
    if (!a.isCurrent && !b.isCurrent) {
      const aMonth = (a.endDate ?? a.startDate).slice(0, 7);
      const bMonth = (b.endDate ?? b.startDate).slice(0, 7);

      if (aMonth !== bMonth) {
        return aMonth > bMonth ? -1 : 1;
      }
    }

    const aRelevance = a.emphasis === "detailed" ? 1 : 0;
    const bRelevance = b.emphasis === "detailed" ? 1 : 0;

    if (aRelevance !== bRelevance) {
      return bRelevance - aRelevance;
    }

    if (a.startDate !== b.startDate) {
      return a.startDate > b.startDate ? -1 : 1;
    }

    return a.id.localeCompare(b.id);
  });
}
