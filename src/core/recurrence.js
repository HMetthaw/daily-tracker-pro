import { addDays, startOfWeekISO, weekdayKey } from "./date.js";

export function occurrencesForWeek(tasks, dateISO) {
  const weekStart = startOfWeekISO(dateISO);
  const dates = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const occurrences = [];

  for (const task of tasks.filter((item) => item.active !== false)) {
    if (task.type === "oneTime") {
      if (dates.includes(task.date)) {
        occurrences.push(createOccurrence(task, task.date));
      }
      continue;
    }

    for (const date of dates) {
      if ((task.daysOfWeek || []).includes(weekdayKey(date))) {
        occurrences.push(createOccurrence(task, date));
      }
    }
  }

  return occurrences.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.reminderTime || "99:99").localeCompare(b.reminderTime || "99:99");
  });
}

export function createOccurrence(task, date) {
  return {
    id: `${task.id}:${date}`,
    taskId: task.id,
    title: task.title,
    type: task.type,
    date,
    reminderTime: task.reminderTime || null,
    leadTimeMinutes: Number.isInteger(task.leadTimeMinutes) ? task.leadTimeMinutes : null,
    notes: task.notes || "",
    status: "pending"
  };
}
