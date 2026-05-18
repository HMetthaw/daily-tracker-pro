import { addDays, todayISO } from "./date.js";
import { occurrencesForWeek } from "./recurrence.js";

export function taskNotificationIntents(tasks, baseDateISO = todayISO(), daysAhead = 14) {
  const seen = new Set();
  const intents = [];

  for (let index = 0; index < daysAhead; index += 7) {
    const weekOccurrences = occurrencesForWeek(tasks, addDays(baseDateISO, index));
    for (const occurrence of weekOccurrences) {
      if (!occurrence.reminderTime || occurrence.date < baseDateISO || seen.has(occurrence.id)) continue;
      seen.add(occurrence.id);
      intents.push({
        identifier: `task:${occurrence.id}`,
        occurrenceId: occurrence.id,
        title: occurrence.title,
        date: occurrence.date,
        time: occurrence.reminderTime
      });
    }
  }

  return intents;
}

export function weeklyRecapIntent(dateISO = todayISO(), time = "09:00") {
  return {
    identifier: "weekly-recap",
    weekday: 1,
    repeats: true,
    time,
    dateISO
  };
}
