export const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export const STREAK_THRESHOLD = 0.8;

export function occurrencesForWeek(tasks, dateISO, projects = []) {
  const dates = weekDates(dateISO);
  const occurrences = [];
  for (const task of tasks.filter((item) => item.active !== false)) {
    const project = task.projectId ? projects.find((item) => item.id === task.projectId) : null;
    if (task.type === "oneTime") {
      if (dates.includes(task.date) && (!project || isDateWithinProject(task.date, project))) {
        occurrences.push(createOccurrence(task, task.date));
      }
      continue;
    }
    if (task.recurrence === "everyOtherDay") {
      const anchorDate = task.date || project?.startDate || dates[0];
      for (const date of dates) {
        if (date >= anchorDate && daysBetween(anchorDate, date) % 2 === 0 && (!project || isDateWithinProject(date, project))) {
          occurrences.push(createOccurrence(task, date));
        }
      }
      continue;
    }
    for (const date of dates) {
      if ((task.daysOfWeek || []).includes(weekdayKey(date)) && (!project || isDateWithinProject(date, project))) {
        occurrences.push(createOccurrence(task, date));
      }
    }
  }
  return occurrences.sort((a, b) => a.date.localeCompare(b.date) || (a.reminderTime || "99:99").localeCompare(b.reminderTime || "99:99"));
}

export function createOccurrence(task, date) {
  return {
    id: `${task.id}:${date}`,
    taskId: task.id,
    title: task.title,
    type: task.type,
    projectId: task.projectId || "",
    date,
    startTime: task.startTime || "",
    endTime: task.endTime || "",
    reminderTime: task.reminderTime || "",
    leadTimeMinutes: parseLeadTime(task.leadTimeMinutes),
    notes: task.notes || "",
    callPrepItems: Array.isArray(task.callPrepItems) ? task.callPrepItems : [],
    status: "pending"
  };
}

export function completionStats(occurrences) {
  const total = occurrences.length;
  const completed = occurrences.filter((item) => item.status === "done").length;
  return { completed, total, percent: total ? completed / total : 0 };
}

export function weeklyRecap(occurrences, dates = []) {
  const stats = completionStats(occurrences);
  const taskScores = Object.values(groupBy(occurrences, "taskId"))
    .map((items) => ({ title: items[0]?.title || "", ...completionStats(items) }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.percent - a.percent || b.total - a.total);
  const dayScores = Object.entries(groupBy(occurrences, "date"))
    .map(([date, items]) => ({ date, ...completionStats(items) }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.percent - a.percent || b.completed - a.completed);
  const chartDates = dates.length ? dates : Object.keys(groupBy(occurrences, "date")).sort();
  return {
    ...stats,
    days: chartDates.map((date) => ({ date, ...completionStats(occurrences.filter((item) => item.date === date)) })),
    bestTasks: taskScores.filter((item) => item.percent >= STREAK_THRESHOLD).slice(0, 3),
    worstTasks: [...taskScores].sort((a, b) => a.percent - b.percent || b.total - a.total).slice(0, 3),
    bestDay: dayScores[0] || null,
    worstDay: dayScores.length ? dayScores[dayScores.length - 1] : null,
    recommendation: recommendationKey(stats, taskScores)
  };
}

export function todayISO(now = new Date()) {
  return toISODate(now);
}

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

export function addDays(dateISO, amount) {
  const date = parseISODate(dateISO);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

export function weekDates(dateISO) {
  const start = parseISODate(dateISO);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, index) => addDays(toISODate(start), index));
}

export function weekdayKey(dateISO) {
  return WEEKDAYS[parseISODate(dateISO).getDay()];
}

export function daysBetween(startISO, endISO) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parseISODate(endISO) - parseISODate(startISO)) / millisecondsPerDay);
}

function isDateWithinProject(dateISO, project) {
  return (!project.startDate || dateISO >= project.startDate) && (!project.endDate || dateISO <= project.endDate);
}

function parseLeadTime(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= 1440 ? parsed : null;
}

function recommendationKey(stats, taskScores) {
  if (!stats.total) return "noTasks";
  if (stats.percent >= 0.9) return "excellent";
  if (taskScores.some((item) => item.percent < STREAK_THRESHOLD)) return "focusWeakTask";
  return "steady";
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    groups[item[key]] = groups[item[key]] || [];
    groups[item[key]].push(item);
    return groups;
  }, {});
}
