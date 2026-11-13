export function dateForInput(date: string) {
  const legacyDate = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(date);
  return legacyDate ? `${legacyDate[3]}-${legacyDate[2]}-${legacyDate[1]}` : date.slice(0, 10);
}
