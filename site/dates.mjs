export const zone = 'Asia/Kolkata';
export function indiaDate(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {
    timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(now).map(({type, value}) => [type, value]));
  return [parts.year, parts.month, parts.day].join('-');
}
export function validDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(date + 'T00:00:00Z');
  return Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === date;
}
export function displayDate(date) {
  return new Intl.DateTimeFormat('en-IN', {dateStyle: 'long', timeZone: 'UTC'})
    .format(new Date(date + 'T00:00:00Z'));
}
