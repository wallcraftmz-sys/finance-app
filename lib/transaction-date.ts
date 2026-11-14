export function dateForInput(date: string) {
  const legacyDate = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date);
  return legacyDate ? `${legacyDate[3]}-${legacyDate[2]}-${legacyDate[1]}` : date.slice(0, 10);
}

export function formatTransactionDate(value: string, locale: string) {
  const date = dateForInput(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return value;

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return value;

  return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(parsed);
}
