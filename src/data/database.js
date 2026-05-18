import * as SQLite from "expo-sqlite";
import { occurrencesForWeek } from "../core/recurrence.js";

let databasePromise;

export async function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("daily-tracker-pro.db");
  }
  const db = await databasePromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      days_json TEXT NOT NULL,
      reminder_time TEXT,
      date TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS completions (
      occurrence_id TEXT PRIMARY KEY NOT NULL,
      status TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
  return db;
}

export async function getSetting(key, fallback) {
  const db = await getDatabase();
  const row = await db.getFirstAsync("SELECT value FROM settings WHERE key = ?", key);
  return row?.value ?? fallback;
}

export async function setSetting(key, value) {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
    key,
    value
  );
}

export async function getTasks() {
  const db = await getDatabase();
  const rows = await db.getAllAsync("SELECT * FROM tasks ORDER BY created_at ASC");
  return rows.map(rowToTask);
}

export async function saveTask(task) {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO tasks
      (id, title, type, days_json, reminder_time, date, active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM tasks WHERE id = ?), ?))`,
    task.id,
    task.title.trim(),
    task.type,
    JSON.stringify(task.daysOfWeek || []),
    task.reminderTime || null,
    task.date || null,
    task.active === false ? 0 : 1,
    task.id,
    now
  );
}

export async function deleteTask(taskId) {
  const db = await getDatabase();
  await db.runAsync("UPDATE tasks SET active = 0 WHERE id = ?", taskId);
}

export async function getCompletions() {
  const db = await getDatabase();
  const rows = await db.getAllAsync("SELECT * FROM completions");
  return Object.fromEntries(rows.map((row) => [row.occurrence_id, row.status]));
}

export async function setCompletion(occurrenceId, status) {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT OR REPLACE INTO completions (occurrence_id, status, updated_at) VALUES (?, ?, ?)",
    occurrenceId,
    status,
    new Date().toISOString()
  );
}

export async function hydratedOccurrencesForWeek(dateISO) {
  const [tasks, completions] = await Promise.all([getTasks(), getCompletions()]);
  return occurrencesForWeek(tasks, dateISO).map((occurrence) => ({
    ...occurrence,
    status: completions[occurrence.id] || occurrence.status
  }));
}

function rowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    daysOfWeek: JSON.parse(row.days_json || "[]"),
    reminderTime: row.reminder_time || null,
    date: row.date || null,
    active: row.active === 1,
    createdAt: row.created_at
  };
}
