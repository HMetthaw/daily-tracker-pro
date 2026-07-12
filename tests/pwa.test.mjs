import test from "node:test";
import assert from "node:assert/strict";
import { createBackup, defaultState, parseBackup } from "../pwa/lib/backup.js";
import { completionStats, occurrencesForWeek, weeklyRecap } from "../pwa/lib/domain.js";
import { completeMorningPlan, createMovedTask, dismissOccurrence, markNotToday, moveListItem, setSnooze } from "../pwa/lib/actions.js";

function validState() {
  const state = defaultState();
  state.projects.push({ id: "project-1", name: "Rekonstrukce", startDate: "2026-07-01", endDate: "2026-07-31" });
  state.tasks.push({
    id: "task-1",
    title: "Kontrola materiálu",
    type: "recurring",
    projectId: "project-1",
    recurrence: "weekdays",
    daysOfWeek: ["sun", "tue"],
    reminderTime: "08:30",
    active: true
  });
  return state;
}

test("PWA backup round-trip keeps valid user data", () => {
  const state = validState();
  const restored = parseBackup(JSON.stringify(createBackup(state, "2026-07-12T10:00:00.000Z")));
  assert.deepEqual(restored.tasks, state.tasks);
  assert.deepEqual(restored.projects, state.projects);
});

test("PWA backup rejects an HTML injection hidden in an id", () => {
  const state = validState();
  state.tasks[0].id = `task\" onmouseover=\"alert(1)`;
  assert.throws(() => parseBackup(JSON.stringify(createBackup(state))), /Invalid task/);
});

test("PWA backup rejects impossible times and oversized input", () => {
  const state = validState();
  state.tasks[0].reminderTime = "29:90";
  assert.throws(() => parseBackup(JSON.stringify(createBackup(state))), /Invalid reminder time/);
  assert.throws(() => parseBackup("x".repeat(5_000_001)), /too large/);
});

test("project occurrences stay inside the project range", () => {
  const project = { id: "p", name: "Zakázka", startDate: "2026-07-14", endDate: "2026-07-16" };
  const task = { id: "t", title: "Krok", type: "recurring", projectId: "p", daysOfWeek: ["sun", "tue", "thu", "sat"], active: true };
  const occurrences = occurrencesForWeek([task], "2026-07-15", [project]);
  assert.deepEqual(occurrences.map((item) => item.date), ["2026-07-14", "2026-07-16"]);
});

test("every-other-day recurrence uses a stable anchor date", () => {
  const task = { id: "t", title: "Obden", type: "recurring", recurrence: "everyOtherDay", date: "2026-07-12", active: true };
  const occurrences = occurrencesForWeek([task], "2026-07-15");
  assert.deepEqual(occurrences.map((item) => item.date), ["2026-07-12", "2026-07-14", "2026-07-16", "2026-07-18"]);
});

test("recap and completion stats use the supplied completed window", () => {
  const occurrences = [
    { taskId: "a", title: "A", date: "2026-07-12", status: "done" },
    { taskId: "b", title: "B", date: "2026-07-12", status: "pending" }
  ];
  assert.deepEqual(completionStats(occurrences), { completed: 1, total: 2, percent: 0.5 });
  assert.deepEqual(weeklyRecap(occurrences, ["2026-07-12"]).days, [
    { date: "2026-07-12", completed: 1, total: 2, percent: 0.5 }
  ]);
});

test("not-today, dismiss and snooze update only the intended occurrence", () => {
  const state = defaultState();
  state.completions.a = "done";
  state.snoozes.a = "2026-07-12T08:00";
  markNotToday(state, "a");
  assert.equal(state.completions.a, undefined);
  assert.equal(state.snoozes.a, undefined);
  assert.equal(state.nextTaskSkips.a, true);

  dismissOccurrence(state, "a");
  assert.equal(state.nextTaskSkips.a, undefined);
  assert.equal(state.skips.a, true);

  const time = setSnooze(state, "b", 30, new Date(2026, 6, 12, 23, 45));
  assert.equal(time, "00:15");
  assert.equal(state.snoozes.b, "2026-07-13T00:15");
});

test("carry-over creates a one-time task and keeps the original duration", () => {
  const task = createMovedTask({
    occurrence: { id: "routine:2026-07-11", title: "Schůzka", startTime: "09:00", endTime: "10:30", projectId: "p" },
    sourceTask: { id: "routine" },
    date: "2026-07-12",
    time: "13:00",
    id: "moved-1",
    createdAt: "2026-07-12T08:00:00.000Z"
  });
  assert.equal(task.type, "oneTime");
  assert.equal(task.date, "2026-07-12");
  assert.equal(task.endTime, "14:30");
  assert.equal(task.sourceOccurrenceId, "routine:2026-07-11");
});

test("morning plan keeps an ordered maximum of three unique priorities", () => {
  const state = defaultState();
  const plan = completeMorningPlan(state, "2026-07-12", ["a", "b", "a", "c", "d"], "2026-07-12T06:30:00.000Z");
  assert.deepEqual(plan.focusIds, ["a", "b", "c"]);
  assert.deepEqual(state.dailyFocus["2026-07-12"], ["a", "b", "c"]);
  assert.deepEqual(moveListItem(plan.focusIds, "c", "up"), ["a", "c", "b"]);
  assert.deepEqual(moveListItem(plan.focusIds, "a", "up"), plan.focusIds);
});
