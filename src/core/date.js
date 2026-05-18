export const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO() {
  return toISODate(new Date());
}

export function addDays(dateISO, amount) {
  const date = parseISODate(dateISO);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function startOfWeekISO(dateISO) {
  const date = parseISODate(dateISO);
  date.setDate(date.getDate() - date.getDay());
  return toISODate(date);
}

export function weekDates(dateISO) {
  const start = startOfWeekISO(dateISO);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function weekdayKey(dateISO) {
  return WEEKDAY_KEYS[parseISODate(dateISO).getDay()];
}

export function formatShortDate(dateISO) {
  const [year, month, day] = dateISO.split("-");
  return `${Number(day)}.${Number(month)}.`;
}
