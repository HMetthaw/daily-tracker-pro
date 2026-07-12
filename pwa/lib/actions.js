import { todayISO, toISODate } from "./domain.js";

export function markNotToday(state, occurrenceId) {
  delete state.completions[occurrenceId];
  delete state.snoozes[occurrenceId];
  state.nextTaskSkips[occurrenceId] = true;
}

export function dismissOccurrence(state, occurrenceId) {
  clearOccurrenceState(state, occurrenceId);
  state.skips[occurrenceId] = true;
}

export function clearOccurrenceState(state, occurrenceId) {
  delete state.completions[occurrenceId];
  delete state.snoozes[occurrenceId];
  delete state.nextTaskSkips[occurrenceId];
  delete state.timeOverrides[occurrenceId];
}

export function setSnooze(state, occurrenceId, minutes, now = new Date()) {
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440) throw new Error("Invalid snooze duration");
  const snoozeAt = new Date(now);
  snoozeAt.setMinutes(snoozeAt.getMinutes() + minutes);
  const time = `${String(snoozeAt.getHours()).padStart(2, "0")}:${String(snoozeAt.getMinutes()).padStart(2, "0")}`;
  state.snoozes[occurrenceId] = `${toISODate(snoozeAt)}T${time}`;
  return time;
}

export function completeMorningPlan(state, dateISO, focusIds, completedAt = new Date().toISOString()) {
  const uniqueIds = [...new Set(focusIds)].slice(0, 3);
  state.dailyFocus[dateISO] = uniqueIds;
  state.morningPlans[dateISO] = { completedAt, focusIds: uniqueIds };
  return state.morningPlans[dateISO];
}

export function moveListItem(items, item, direction) {
  const index = items.indexOf(item);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= items.length) return [...items];
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function createMovedTask({ occurrence, sourceTask, date = todayISO(), time, id, createdAt }) {
  const endTime = shiftedEndTime(occurrence.startTime || occurrence.reminderTime, occurrence.endTime, time);
  return {
    id,
    title: occurrence.title,
    type: "oneTime",
    projectId: occurrence.projectId || "",
    daysOfWeek: [],
    date,
    startTime: occurrence.startTime || occurrence.endTime ? time : "",
    endTime,
    reminderTime: time,
    active: true,
    sourceTaskId: sourceTask.id,
    sourceOccurrenceId: occurrence.id,
    createdAt
  };
}

export function shiftedEndTime(oldStart, oldEnd, newStart) {
  if (!oldStart || !oldEnd) return oldEnd || "";
  const duration = minutesFromTime(oldEnd) - minutesFromTime(oldStart);
  if (duration <= 0) return oldEnd;
  return timeFromMinutes(minutesFromTime(newStart) + duration);
}

function minutesFromTime(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(value) {
  const minutesInDay = 24 * 60;
  const normalized = ((value % minutesInDay) + minutesInDay) % minutesInDay;
  return `${String(Math.floor(normalized / 60)).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")}`;
}
