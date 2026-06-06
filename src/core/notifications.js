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

      if (Number.isInteger(occurrence.leadTimeMinutes) && occurrence.leadTimeMinutes > 0) {
        const leadDateTime = subtractMinutes(occurrence.date, occurrence.reminderTime, occurrence.leadTimeMinutes);
        if (leadDateTime && leadDateTime.date >= baseDateISO) {
          intents.push({
            identifier: `task:${occurrence.id}:lead:${occurrence.leadTimeMinutes}`,
            occurrenceId: occurrence.id,
            kind: "lead",
            title: occurrence.title,
            date: leadDateTime.date,
            time: leadDateTime.time,
            leadTimeMinutes: occurrence.leadTimeMinutes
          });
        }
      }

      intents.push({
        identifier: `task:${occurrence.id}:due`,
        occurrenceId: occurrence.id,
        kind: "due",
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

function subtractMinutes(dateISO, time, minutes) {
  const [year, month, day] = dateISO.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![year, month, day, hour, minute, minutes].every(Number.isFinite)) return null;

  const date = new Date(year, month - 1, day, hour, minute, 0);
  date.setMinutes(date.getMinutes() - minutes);

  return {
    date: [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0")
    ].join("-"),
    time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  };
}
