type YearRange = {
  startYear: number | null;
  endYear: number | null;
  isCurrent: boolean;
};

export function formatYearRange({
  startYear,
  endYear,
  isCurrent,
}: YearRange): string | null {
  if (isCurrent) {
    return startYear !== null ? `${startYear} – Present` : "Present";
  }

  if (startYear !== null && endYear !== null) {
    return startYear === endYear
      ? String(startYear)
      : `${startYear} – ${endYear}`;
  }

  if (startYear !== null) {
    return `Started ${startYear}`;
  }

  if (endYear !== null) {
    return `Until ${endYear}`;
  }

  return null;
}
