export const BACKUP_VERSION = 3;

const LIMITS = {
  tasks: 2000,
  projects: 500,
  mapEntries: 10000,
  title: 200,
  notes: 5000,
  checklistItems: 50,
  checklistItem: 500
};

const SAFE_ID = /^[A-Za-z0-9_-]{1,100}$/;
const SAFE_OCCURRENCE_ID = /^[A-Za-z0-9_:-]{1,180}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const WEEKDAYS = new Set(["sun", "mon", "tue", "wed", "thu", "fri", "sat"]);

export function defaultState() {
  return {
    projects: [],
    tasks: [],
    completions: {},
    snoozes: {},
    skips: {},
    nextTaskSkips: {},
    dailyFocus: {},
    morningPlans: {},
    callPrepDone: {},
    timeOverrides: {},
    settings: { language: "cs", theme: "light", notifications: "default", todayMode: "next" }
  };
}

// Local data from older releases is kept tolerant so an update never erases a user's setup.
export function normalizeState(value) {
  const fallback = defaultState();
  const source = isPlainObject(value) ? value : {};
  const settings = isPlainObject(source.settings) ? source.settings : {};
  return {
    projects: Array.isArray(source.projects) ? source.projects : fallback.projects,
    tasks: Array.isArray(source.tasks) ? source.tasks : fallback.tasks,
    completions: plainObjectOr(source.completions, fallback.completions),
    snoozes: plainObjectOr(source.snoozes, fallback.snoozes),
    skips: plainObjectOr(source.skips, fallback.skips),
    nextTaskSkips: plainObjectOr(source.nextTaskSkips, fallback.nextTaskSkips),
    dailyFocus: plainObjectOr(source.dailyFocus, fallback.dailyFocus),
    morningPlans: plainObjectOr(source.morningPlans, fallback.morningPlans),
    callPrepDone: plainObjectOr(source.callPrepDone, fallback.callPrepDone),
    timeOverrides: plainObjectOr(source.timeOverrides, fallback.timeOverrides),
    settings: {
      language: settings.language === "en" ? "en" : "cs",
      theme: settings.theme === "dark" ? "dark" : "light",
      notifications: ["default", "granted", "denied"].includes(settings.notifications)
        ? settings.notifications
        : "default",
      todayMode: settings.todayMode === "all" ? "all" : "next"
    }
  };
}

export function createBackup(state, exportedAt = new Date().toISOString()) {
  return {
    app: "daily-tracker-pro",
    version: BACKUP_VERSION,
    exportedAt,
    state: normalizeState(state)
  };
}

export function parseBackup(text) {
  if (typeof text !== "string" || text.length > 5_000_000) throw new Error("Backup is too large");
  const payload = JSON.parse(text);
  if (payload?.app && payload.app !== "daily-tracker-pro") throw new Error("Backup belongs to another app");
  if (payload?.version && (!Number.isInteger(payload.version) || payload.version > BACKUP_VERSION)) {
    throw new Error("Backup version is not supported");
  }
  const source = payload?.app === "daily-tracker-pro" ? payload.state : payload;
  validateState(source);
  return normalizeState(source);
}

function validateState(state) {
  if (!isPlainObject(state)) throw new Error("Invalid state");
  if (!Array.isArray(state.tasks) || state.tasks.length > LIMITS.tasks) throw new Error("Invalid tasks");
  if (!Array.isArray(state.projects) || state.projects.length > LIMITS.projects) throw new Error("Invalid projects");
  state.tasks.forEach(validateTask);
  state.projects.forEach(validateProject);
  validateRecord(state.completions, validateCompletion);
  validateRecord(state.snoozes, (value) => value === "" || isDateTime(value));
  validateRecord(state.skips, (value) => typeof value === "boolean");
  validateRecord(state.nextTaskSkips, (value) => typeof value === "boolean");
  validateDatedIdLists(state.dailyFocus);
  validateMorningPlans(state.morningPlans);
  validateRecord(state.callPrepDone, (value) =>
    Array.isArray(value) && value.length <= LIMITS.checklistItems && value.every((item) => Number.isInteger(item) && item >= 0)
  );
  validateRecord(state.timeOverrides, validateTimeOverride);
  if (state.settings !== undefined && !isPlainObject(state.settings)) throw new Error("Invalid settings");
}

function validateTask(task) {
  if (!isPlainObject(task) || !SAFE_ID.test(task.id) || !isText(task.title, 1, LIMITS.title)) throw new Error("Invalid task");
  if (!["recurring", "oneTime"].includes(task.type)) throw new Error("Invalid task type");
  if (task.projectId && !SAFE_ID.test(task.projectId)) throw new Error("Invalid project reference");
  if (task.date && !isDate(task.date)) throw new Error("Invalid task date");
  if (task.reminderTime && !TIME.test(task.reminderTime)) throw new Error("Invalid reminder time");
  if (task.startTime && !TIME.test(task.startTime)) throw new Error("Invalid start time");
  if (task.endTime && !TIME.test(task.endTime)) throw new Error("Invalid end time");
  if (task.daysOfWeek !== undefined && (!Array.isArray(task.daysOfWeek) || task.daysOfWeek.some((day) => !WEEKDAYS.has(day)))) {
    throw new Error("Invalid weekdays");
  }
  if (task.notes !== undefined && !isText(task.notes, 0, LIMITS.notes)) throw new Error("Invalid notes");
  if (task.callPrepItems !== undefined) validateChecklist(task.callPrepItems);
  if (task.leadTimeMinutes != null && (!Number.isInteger(task.leadTimeMinutes) || task.leadTimeMinutes < 1 || task.leadTimeMinutes > 1440)) {
    throw new Error("Invalid lead time");
  }
}

function validateProject(project) {
  if (!isPlainObject(project) || !SAFE_ID.test(project.id) || !isText(project.name, 1, LIMITS.title)) throw new Error("Invalid project");
  if (project.address !== undefined && !isText(project.address, 0, 500)) throw new Error("Invalid address");
  if (project.startDate && !isDate(project.startDate)) throw new Error("Invalid project start");
  if (project.endDate && !isDate(project.endDate)) throw new Error("Invalid project end");
}

function validateChecklist(items) {
  if (!Array.isArray(items) || items.length > LIMITS.checklistItems || items.some((item) => !isText(item, 1, LIMITS.checklistItem))) {
    throw new Error("Invalid checklist");
  }
}

function validateRecord(record, valueValidator) {
  if (record === undefined) return;
  if (!isPlainObject(record)) throw new Error("Invalid data map");
  const entries = Object.entries(record);
  if (entries.length > LIMITS.mapEntries) throw new Error("Too many history entries");
  for (const [key, value] of entries) {
    if (!SAFE_OCCURRENCE_ID.test(key) || !valueValidator(value)) throw new Error("Invalid history entry");
  }
}

function validateDatedIdLists(record) {
  if (record === undefined) return;
  if (!isPlainObject(record) || Object.keys(record).length > 3660) throw new Error("Invalid focus history");
  for (const [date, ids] of Object.entries(record)) {
    if (!isDate(date) || !Array.isArray(ids) || ids.length > 3 || ids.some((id) => typeof id !== "string" || !SAFE_OCCURRENCE_ID.test(id))) {
      throw new Error("Invalid focus entry");
    }
  }
}

function validateMorningPlans(record) {
  if (record === undefined) return;
  if (!isPlainObject(record) || Object.keys(record).length > 3660) throw new Error("Invalid morning plans");
  for (const [date, plan] of Object.entries(record)) {
    if (
      !isDate(date) ||
      !isPlainObject(plan) ||
      typeof plan.completedAt !== "string" ||
      !Array.isArray(plan.focusIds) ||
      plan.focusIds.length > 3 ||
      plan.focusIds.some((id) => typeof id !== "string" || !SAFE_OCCURRENCE_ID.test(id))
    ) {
      throw new Error("Invalid morning plan");
    }
  }
}

function validateCompletion(value) {
  return ["pending", "done", "skipped"].includes(value);
}

function validateTimeOverride(value) {
  return isPlainObject(value) && [value.startTime, value.endTime, value.reminderTime].every((time) => !time || TIME.test(time));
}

function plainObjectOr(value, fallback) {
  return isPlainObject(value) ? value : fallback;
}

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isText(value, min, max) {
  return typeof value === "string" && value.trim().length >= min && value.length <= max;
}

function isDate(value) {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function isDateTime(value) {
  if (typeof value !== "string") return false;
  const [date, time] = value.split("T");
  return isDate(date) && TIME.test(time || "");
}
