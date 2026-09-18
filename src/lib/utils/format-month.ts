const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonth(value: string): string {
  return monthFormatter.format(new Date(`${value}T00:00:00Z`));
}
