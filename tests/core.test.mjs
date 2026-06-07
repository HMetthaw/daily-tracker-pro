import test from "node:test";
import assert from "node:assert/strict";
import { startOfWeekISO, weekDates, weekdayKey } from "../src/core/date.js";
import { occurrencesForWeek } from "../src/core/recurrence.js";
import { completionStats, currentStreak, isStreakDay, weeklyRecap } from "../src/core/progress.js";
import { taskNotificationIntents, weeklyRecapIntent } from "../src/core/notifications.js";
import { assertTranslationParity, t } from "../src/i18n/translations.js";

test("weeks run from Sunday to Saturday", () => {
  assert.equal(startOfWeekISO("2026-05-20"), "2026-05-17");
  assert.deepEqual(weekDates("2026-05-20"), [
    "2026-05-17",
    "2026-05-18",
    "2026-05-19",
    "2026-05-20",
    "2026-05-21",
    "2026-05-22",
    "2026-05-23"
  ]);
  assert.equal(weekdayKey("2026-05-17"), "sun");
});

test("recurring tasks generate occurrences for selected weekdays", () => {
  const tasks = [
    {
      id: "exercise",
      title: "Exercise",
      type: "recurring",
      daysOfWeek: ["sun", "tue", "thu"],
      reminderTime: "07:30",
      callPrepItems: ["Open notes", "Check agenda"],
      active: true
    },
    {
      id: "boss",
      title: "Write boss",
      type: "oneTime",
      date: "2026-05-20",
      daysOfWeek: [],
      active: true
    }
  ];

  const occurrences = occurrencesForWeek(tasks, "2026-05-20");
  assert.deepEqual(
    occurrences.map((item) => `${item.taskId}:${item.date}`),
    [
      "exercise:2026-05-17",
      "exercise:2026-05-19",
      "boss:2026-05-20",
      "exercise:2026-05-21"
    ]
  );
  assert.deepEqual(occurrences[0].callPrepItems, ["Open notes", "Check agenda"]);
});

test("80 percent threshold controls daily streak qualification", () => {
  const day = [
    { status: "done" },
    { status: "done" },
    { status: "done" },
    { status: "done" },
    { status: "pending" }
  ];

  assert.equal(completionStats(day).percent, 0.8);
  assert.equal(isStreakDay(day), true);
  assert.equal(isStreakDay(day, 0.9), false);
});

test("current streak counts consecutive qualifying days", () => {
  const groups = [
    { date: "2026-05-17", occurrences: [{ status: "done" }] },
    { date: "2026-05-18", occurrences: [{ status: "done" }, { status: "pending" }] },
    { date: "2026-05-19", occurrences: [{ status: "done" }, { status: "done" }] },
    { date: "2026-05-20", occurrences: [{ status: "done" }, { status: "done" }] }
  ];

  assert.equal(currentStreak(groups), 2);
});

test("weekly recap identifies best, worst, and recommendation", () => {
  const occurrences = [
    { taskId: "a", title: "A", date: "2026-05-17", status: "done" },
    { taskId: "a", title: "A", date: "2026-05-18", status: "done" },
    { taskId: "b", title: "B", date: "2026-05-17", status: "pending" },
    { taskId: "b", title: "B", date: "2026-05-18", status: "done" }
  ];
  const recap = weeklyRecap(occurrences);

  assert.equal(recap.completed, 3);
  assert.equal(recap.total, 4);
  assert.equal(recap.bestTasks[0].title, "A");
  assert.equal(recap.worstTasks[0].title, "B");
  assert.equal(recap.recommendation, "focusWeakTask");
});

test("notification intents cover task reminders and Sunday recap", () => {
  const tasks = [
    {
      id: "a",
      title: "A",
      type: "recurring",
      daysOfWeek: ["sun", "mon"],
      reminderTime: "09:00",
      leadTimeMinutes: 15,
      active: true
    }
  ];

  const intents = taskNotificationIntents(tasks, "2026-05-17", 7);
  assert.equal(intents.length, 4);
  assert.deepEqual(
    intents.map((item) => `${item.kind}:${item.date}:${item.time}`),
    [
      "lead:2026-05-17:08:45",
      "due:2026-05-17:09:00",
      "lead:2026-05-18:08:45",
      "due:2026-05-18:09:00"
    ]
  );
  assert.equal(weeklyRecapIntent("2026-05-17").time, "09:00");
});

test("i18n dictionaries have the same keys and interpolate values", () => {
  assert.equal(assertTranslationParity(), true);
  assert.equal(t("en", "completedOf", { completed: 2, total: 5 }), "2 of 5");
  assert.equal(t("cs", "completedOf", { completed: 2, total: 5 }), "2 z 5");
});
