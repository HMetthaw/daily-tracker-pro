const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const STORE_KEY = "daily-tracker-pro:pwa:v1";
const STREAK_THRESHOLD = 0.8;

const translations = {
  cs: {
    appName: "Daily Tracker Pro",
    today: "Dnes",
    week: "Týden",
    tasks: "Úkoly",
    recap: "Recap",
    settings: "Nastavení",
    addTask: "Přidat úkol",
    taskName: "Název úkolu",
    reminder: "Připomínka",
    noReminder: "Bez času",
    recurring: "Opakovaný",
    oneTime: "Jednorázový",
    save: "Uložit",
    cancel: "Zrušit",
    delete: "Smazat",
    dailyProgress: "Denní progres",
    streak: "Streak",
    completedOf: "{completed} z {total}",
    todayEmpty: "Na dnešek zatím nic nemáš.",
    tasksEmpty: "Přidej první opakovaný nebo jednorázový úkol.",
    language: "Jazyk",
    appearance: "Vzhled",
    light: "Světlý",
    dark: "Tmavý",
    czech: "Čeština",
    english: "English",
    notifications: "Notifikace",
    allowNotifications: "Povolit notifikace",
    notificationReady: "Notifikace jsou povolené.",
    localOnly: "Data jsou uložená jen v tomto zařízení.",
    sunday: "Ne",
    monday: "Po",
    tuesday: "Út",
    wednesday: "St",
    thursday: "Čt",
    friday: "Pá",
    saturday: "So",
    bestTasks: "Nejlepší úkoly",
    worstTasks: "Nejslabší úkoly",
    bestDay: "Nejlepší den",
    worstDay: "Nejslabší den",
    recommendation: "Doporučení",
    noRecap: "Recap se objeví, až bude v týdnu co vyhodnotit.",
    noTasks: "Naplánuj si pár úkolů na další týden.",
    excellent: "Skvělý týden. Drž stejný rytmus.",
    focusWeakTask: "Zkus zjednodušit nejslabší úkol nebo mu dát pevný čas.",
    steady: "Jdeš dobře. Zaměř se na jeden úkol, který nejčastěji uniká.",
    addOneTimeToday: "Jednorázový na dnes",
    installHint: "Přidat na plochu",
    pwaLimit: "PWA notifikace jsou demo režim; pro přesné budíky je lepší pozdější iOS build.",
    taskTime: "Čas na úkol",
    weeklyRecap: "Týdenní recap"
  },
  en: {
    appName: "Daily Tracker Pro",
    today: "Today",
    week: "Week",
    tasks: "Tasks",
    recap: "Recap",
    settings: "Settings",
    addTask: "Add task",
    taskName: "Task name",
    reminder: "Reminder",
    noReminder: "No time",
    recurring: "Recurring",
    oneTime: "One-time",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    dailyProgress: "Daily progress",
    streak: "Streak",
    completedOf: "{completed} of {total}",
    todayEmpty: "Nothing planned for today yet.",
    tasksEmpty: "Add your first recurring or one-time task.",
    language: "Language",
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    czech: "Čeština",
    english: "English",
    notifications: "Notifications",
    allowNotifications: "Allow notifications",
    notificationReady: "Notifications are allowed.",
    localOnly: "Data is stored only on this device.",
    sunday: "Sun",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    bestTasks: "Best tasks",
    worstTasks: "Weakest tasks",
    bestDay: "Best day",
    worstDay: "Weakest day",
    recommendation: "Recommendation",
    noRecap: "The recap appears when there is something to evaluate.",
    noTasks: "Plan a few tasks for next week.",
    excellent: "Great week. Keep the same rhythm.",
    focusWeakTask: "Try simplifying the weakest task or giving it a fixed time.",
    steady: "You are moving well. Focus on the one task that slips most often.",
    addOneTimeToday: "One-time for today",
    installHint: "Add to Home Screen",
    pwaLimit: "PWA notifications are demo mode; a later iOS build is better for exact alarms.",
    taskTime: "Task time",
    weeklyRecap: "Weekly recap"
  }
};

let state = loadState();
let currentScreen = "today";
let editingTaskId = null;
let notifiedKeys = new Set();

const app = document.querySelector("#app");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

render();
startReminderLoop();

function t(key, params = {}) {
  const language = state.settings.language;
  const template = translations[language]?.[key] || translations.cs[key] || key;
  return Object.entries(params).reduce(
    (value, [param, replacement]) => value.replaceAll(`{${param}}`, String(replacement)),
    template
  );
}

function loadState() {
  const fallback = {
    tasks: [],
    completions: {},
    settings: { language: "cs", theme: "light", notifications: "default" }
  };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORE_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function render() {
  document.documentElement.dataset.theme = state.settings.theme;
  app.innerHTML = `
    <main class="app-shell">
      ${renderHeader()}
      <section class="screen">${renderScreen()}</section>
      ${renderTabs()}
    </main>
    <div id="modal-root"></div>
  `;
  bindEvents();
}

function renderHeader() {
  return `
    <header class="header">
      <div>
        <h1>${t("appName")}</h1>
        <p>${t("localOnly")}</p>
      </div>
      <div class="streak-pill">
        <span>🔥</span>
        <strong>${calculateStreak()}</strong>
      </div>
    </header>
  `;
}

function renderScreen() {
  if (currentScreen === "today") return renderToday();
  if (currentScreen === "week") return renderWeek();
  if (currentScreen === "tasks") return renderTasks();
  if (currentScreen === "recap") return renderRecap();
  return renderSettings();
}

function renderToday() {
  const today = todayISO();
  const occurrences = hydratedOccurrencesForWeek(today).filter((item) => item.date === today);
  const stats = completionStats(occurrences);
  return `
    ${renderProgressCard(t("dailyProgress"), stats)}
    <button class="secondary full" data-action="new-onetime">+ ${t("addOneTimeToday")}</button>
    ${occurrences.length ? occurrences.map(renderOccurrence).join("") : renderEmpty(t("todayEmpty"))}
  `;
}

function renderWeek() {
  const dates = weekDates(todayISO());
  const occurrences = hydratedOccurrencesForWeek(todayISO());
  return dates
    .map((date) => {
      const items = occurrences.filter((item) => item.date === date);
      const stats = completionStats(items);
      return `
        <article class="card day-card">
          <div class="row between">
            <strong>${t(dayLabelKeys(weekdayKey(date)))} ${formatShortDate(date)}</strong>
            <span class="muted">${t("completedOf", { completed: stats.completed, total: stats.total })}</span>
          </div>
          ${renderMeter(stats.percent)}
          ${items.map(renderOccurrence).join("")}
        </article>
      `;
    })
    .join("");
}

function renderTasks() {
  const tasks = state.tasks.filter((task) => task.active !== false);
  return `
    <button class="primary full" data-action="new-recurring">+ ${t("addTask")}</button>
    ${tasks.length ? tasks.map(renderTask).join("") : renderEmpty(t("tasksEmpty"))}
  `;
}

function renderRecap() {
  const recap = weeklyRecap(hydratedOccurrencesForWeek(todayISO()));
  if (!recap.total) return `${renderProgressCard(t("recap"), recap)}${renderEmpty(t("noRecap"))}`;
  return `
    ${renderProgressCard(t("recap"), recap)}
    ${renderScoreList(t("bestTasks"), recap.bestTasks)}
    ${renderScoreList(t("worstTasks"), recap.worstTasks)}
    <article class="card">
      <h2>${t("bestDay")}</h2>
      ${renderDayScore(recap.bestDay)}
      <h2>${t("worstDay")}</h2>
      ${renderDayScore(recap.worstDay)}
    </article>
    <article class="card">
      <h2>${t("recommendation")}</h2>
      <p>${t(recap.recommendation)}</p>
    </article>
  `;
}

function renderSettings() {
  const notificationText = Notification.permission === "granted" ? t("notificationReady") : t("pwaLimit");
  return `
    <article class="card">
      <h2>${t("language")}</h2>
      <div class="segmented">
        ${renderSegment("language", "cs", t("czech"))}
        ${renderSegment("language", "en", t("english"))}
      </div>
    </article>
    <article class="card">
      <h2>${t("appearance")}</h2>
      <div class="segmented">
        ${renderSegment("theme", "light", t("light"))}
        ${renderSegment("theme", "dark", t("dark"))}
      </div>
    </article>
    <article class="card">
      <h2>${t("notifications")}</h2>
      <p class="muted">${notificationText}</p>
      <button class="secondary full" data-action="notifications">${t("allowNotifications")}</button>
    </article>
  `;
}

function renderTabs() {
  const tabs = [
    ["today", "✓", "today"],
    ["week", "▦", "week"],
    ["tasks", "+", "tasks"],
    ["recap", "%", "recap"],
    ["settings", "⚙", "settings"]
  ];
  return `
    <nav class="tabs">
      ${tabs
        .map(
          ([screen, icon, label]) => `
            <button class="${currentScreen === screen ? "active" : ""}" data-screen="${screen}">
              <span>${icon}</span>
              ${t(label)}
            </button>
          `
        )
        .join("")}
    </nav>
  `;
}

function renderProgressCard(title, stats) {
  const percent = Math.round(stats.percent * 100);
  return `
    <article class="card progress-card">
      <h2>${title}</h2>
      <div class="big">${percent}%</div>
      <p class="muted">${t("completedOf", { completed: stats.completed, total: stats.total })}</p>
      ${renderMeter(stats.percent)}
    </article>
  `;
}

function renderOccurrence(occurrence) {
  const done = occurrence.status === "done";
  return `
    <button class="occurrence ${done ? "done" : ""}" data-occurrence="${occurrence.id}">
      <span>${done ? "●" : "○"}</span>
      <span>
        <strong>${escapeHtml(occurrence.title)}</strong>
        <small>${occurrence.reminderTime || t("noReminder")}</small>
      </span>
    </button>
  `;
}

function renderTask(task) {
  const detail = task.type === "oneTime" ? t("oneTime") : t("recurring");
  return `
    <article class="task-card">
      <button class="task-main" data-edit-task="${task.id}">
        <strong>${escapeHtml(task.title)}</strong>
        <small>${detail} - ${task.reminderTime || t("noReminder")}</small>
      </button>
      <button class="danger" data-delete-task="${task.id}">${t("delete")}</button>
    </article>
  `;
}

function renderScoreList(title, items) {
  if (!items.length) return "";
  return `
    <article class="card">
      <h2>${title}</h2>
      ${items
        .map(
          (item) => `
            <div class="row between score-line">
              <span>${escapeHtml(item.title)}</span>
              <strong>${Math.round(item.percent * 100)}%</strong>
            </div>
          `
        )
        .join("")}
    </article>
  `;
}

function renderDayScore(day) {
  if (!day) return `<p class="muted">${t("noRecap")}</p>`;
  return `
    <div class="row between score-line">
      <span>${t(dayLabelKeys(weekdayKey(day.date)))} ${formatShortDate(day.date)}</span>
      <strong>${Math.round(day.percent * 100)}%</strong>
    </div>
  `;
}

function renderSegment(setting, value, label) {
  const active = state.settings[setting] === value;
  return `<button class="${active ? "active" : ""}" data-setting="${setting}" data-value="${value}">${label}</button>`;
}

function renderEmpty(text) {
  return `<div class="empty"><span>▢</span><p>${text}</p></div>`;
}

function renderMeter(percent) {
  return `<div class="meter"><span style="width:${Math.round(percent * 100)}%"></span></div>`;
}

function bindEvents() {
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      currentScreen = button.dataset.screen;
      render();
    });
  });
  document.querySelectorAll("[data-occurrence]").forEach((button) => {
    button.addEventListener("click", () => toggleOccurrence(button.dataset.occurrence));
  });
  document.querySelector("[data-action='new-recurring']")?.addEventListener("click", () => openTaskModal("recurring"));
  document.querySelector("[data-action='new-onetime']")?.addEventListener("click", () => openTaskModal("oneTime"));
  document.querySelector("[data-action='notifications']")?.addEventListener("click", requestNotifications);
  document.querySelectorAll("[data-edit-task]").forEach((button) => {
    button.addEventListener("click", () => openTaskModal(null, button.dataset.editTask));
  });
  document.querySelectorAll("[data-delete-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.tasks.find((item) => item.id === button.dataset.deleteTask);
      if (task) task.active = false;
      saveState();
      render();
    });
  });
  document.querySelectorAll("[data-setting]").forEach((button) => {
    button.addEventListener("click", () => {
      state.settings[button.dataset.setting] = button.dataset.value;
      saveState();
      render();
    });
  });
}

function openTaskModal(type = "recurring", taskId = null) {
  editingTaskId = taskId;
  const task =
    state.tasks.find((item) => item.id === taskId) ||
    {
      id: null,
      title: "",
      type,
      daysOfWeek: [...WEEKDAYS],
      reminderTime: "",
      date: todayISO(),
      active: true
    };
  const selectedDays = new Set(task.daysOfWeek || []);
  const [initialHour, initialMinute] = task.reminderTime ? task.reminderTime.split(":") : ["08", "00"];

  document.querySelector("#modal-root").innerHTML = `
    <div class="modal-backdrop">
      <form class="modal-card" id="task-form">
        <h2>${t("addTask")}</h2>
        <input name="title" autocomplete="off" value="${escapeAttr(task.title)}" placeholder="${t("taskName")}" />
        <div class="segmented">
          <button type="button" class="${task.type === "recurring" ? "active" : ""}" data-type="recurring">${t("recurring")}</button>
          <button type="button" class="${task.type === "oneTime" ? "active" : ""}" data-type="oneTime">${t("oneTime")}</button>
        </div>
        <input type="hidden" name="type" value="${task.type}" />
        <div class="days-row">
          ${WEEKDAYS.map(
            (day) => `
              <button type="button" class="${selectedDays.has(day) ? "active" : ""}" data-day="${day}">
                ${t(dayLabelKeys(day))}
              </button>
            `
          ).join("")}
        </div>
        <input type="hidden" name="days" value="${[...selectedDays].join(",")}" />
        <input type="hidden" name="hour" value="${initialHour}" />
        <input type="hidden" name="minute" value="${initialMinute}" />
        <input type="hidden" name="hasReminder" value="${task.reminderTime ? "1" : "0"}" />
        <button type="button" class="time-button" data-time-toggle>
          <span>
            <small>${t("reminder")}</small>
            <strong data-time-label>${task.reminderTime || t("noReminder")}</strong>
          </span>
          <span>⌄</span>
        </button>
        <div class="time-picker hidden">
          <div class="time-columns">
            ${renderTimeColumn("hour", 0, 23, initialHour)}
            <strong>:</strong>
            ${renderTimeColumn("minute", 0, 59, initialMinute)}
          </div>
          <button type="button" class="secondary full" data-clear-time>${t("noReminder")}</button>
        </div>
        <div class="form-actions">
          <button type="button" class="secondary" data-close>${t("cancel")}</button>
          <button type="submit" class="primary">${t("save")}</button>
        </div>
      </form>
    </div>
  `;

  const form = document.querySelector("#task-form");
  const titleInput = form.elements.title;
  titleInput.focus();
  setTimeout(() => titleInput.scrollIntoView({ block: "center", behavior: "smooth" }), 250);

  form.querySelector("[data-close]").addEventListener("click", closeModal);
  form.querySelectorAll("[data-type]").forEach((button) => {
    button.addEventListener("click", () => {
      form.elements.type.value = button.dataset.type;
      form.querySelectorAll("[data-type]").forEach((item) => item.classList.toggle("active", item === button));
      form.querySelector(".days-row").classList.toggle("hidden", button.dataset.type === "oneTime");
    });
  });
  form.querySelectorAll("[data-day]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      const days = [...form.querySelectorAll("[data-day].active")].map((item) => item.dataset.day);
      form.elements.days.value = days.join(",");
    });
  });
  form.querySelector("[data-time-toggle]").addEventListener("click", () => {
    form.querySelector(".time-picker").classList.toggle("hidden");
  });
  form.querySelector("[data-clear-time]").addEventListener("click", () => {
    form.elements.hasReminder.value = "0";
    form.querySelector("[data-time-label]").textContent = t("noReminder");
  });
  form.querySelectorAll("[data-time-kind]").forEach((button) => {
    button.addEventListener("click", () => {
      const kind = button.dataset.timeKind;
      form.elements[kind].value = button.dataset.value;
      form.elements.hasReminder.value = "1";
      form.querySelectorAll(`[data-time-kind="${kind}"]`).forEach((item) => item.classList.toggle("active", item === button));
      form.querySelector("[data-time-label]").textContent = `${form.elements.hour.value}:${form.elements.minute.value}`;
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveTaskFromForm(form);
  });
}

function renderTimeColumn(kind, start, end, selected) {
  const values = Array.from({ length: end - start + 1 }, (_, index) => String(start + index).padStart(2, "0"));
  return `
    <div class="time-column">
      ${values
        .map(
          (value) => `
            <button type="button" class="${value === selected ? "active" : ""}" data-time-kind="${kind}" data-value="${value}">
              ${value}
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function saveTaskFromForm(form) {
  const title = form.elements.title.value.trim();
  if (!title) return;
  const existing = state.tasks.find((item) => item.id === editingTaskId);
  const task = {
    id: existing?.id || String(Date.now()),
    title,
    type: form.elements.type.value,
    daysOfWeek: form.elements.type.value === "recurring" ? form.elements.days.value.split(",").filter(Boolean) : [],
    reminderTime: form.elements.hasReminder.value === "1" ? `${form.elements.hour.value}:${form.elements.minute.value}` : "",
    date: form.elements.type.value === "oneTime" ? todayISO() : "",
    active: true,
    createdAt: existing?.createdAt || new Date().toISOString()
  };
  if (existing) {
    state.tasks = state.tasks.map((item) => (item.id === task.id ? task : item));
  } else {
    state.tasks.push(task);
  }
  saveState();
  closeModal();
  render();
}

function closeModal() {
  document.querySelector("#modal-root").innerHTML = "";
  editingTaskId = null;
}

function requestNotifications() {
  if (!("Notification" in window)) return;
  Notification.requestPermission().then((permission) => {
    state.settings.notifications = permission;
    saveState();
    render();
  });
}

function startReminderLoop() {
  setInterval(checkReminders, 30000);
  checkReminders();
}

function checkReminders() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const currentDate = toISODate(now);
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  for (const occurrence of hydratedOccurrencesForWeek(currentDate)) {
    const key = `${occurrence.id}:${currentTime}`;
    if (occurrence.date === currentDate && occurrence.reminderTime === currentTime && !notifiedKeys.has(key)) {
      notifiedKeys.add(key);
      new Notification(t("taskTime"), { body: occurrence.title, icon: "./icons/icon.svg" });
    }
  }
  if (now.getDay() === 0 && currentTime === "09:00" && !notifiedKeys.has(`recap:${currentDate}`)) {
    notifiedKeys.add(`recap:${currentDate}`);
    new Notification(t("weeklyRecap"), { body: t("recap"), icon: "./icons/icon.svg" });
  }
}

function hydratedOccurrencesForWeek(dateISO) {
  return occurrencesForWeek(state.tasks.filter((task) => task.active !== false), dateISO).map((occurrence) => ({
    ...occurrence,
    status: state.completions[occurrence.id] || occurrence.status
  }));
}

function occurrencesForWeek(tasks, dateISO) {
  const dates = weekDates(dateISO);
  const occurrences = [];
  for (const task of tasks) {
    if (task.type === "oneTime") {
      if (dates.includes(task.date)) occurrences.push(createOccurrence(task, task.date));
      continue;
    }
    for (const date of dates) {
      if ((task.daysOfWeek || []).includes(weekdayKey(date))) occurrences.push(createOccurrence(task, date));
    }
  }
  return occurrences.sort((a, b) => a.date.localeCompare(b.date) || (a.reminderTime || "99:99").localeCompare(b.reminderTime || "99:99"));
}

function createOccurrence(task, date) {
  return {
    id: `${task.id}:${date}`,
    taskId: task.id,
    title: task.title,
    type: task.type,
    date,
    reminderTime: task.reminderTime || "",
    status: "pending"
  };
}

function toggleOccurrence(id) {
  state.completions[id] = state.completions[id] === "done" ? "pending" : "done";
  saveState();
  render();
}

function completionStats(occurrences) {
  const total = occurrences.length;
  const completed = occurrences.filter((item) => item.status === "done").length;
  return { completed, total, percent: total ? completed / total : 0 };
}

function calculateStreak() {
  let streak = 0;
  let cursor = todayISO();
  for (let index = 0; index < 30; index += 1) {
    const activeTasks = state.tasks.filter((task) => task.active !== false);
    const stats = completionStats(occurrencesForWeek(activeTasks, cursor).filter((item) => item.date === cursor).map((item) => ({
      ...item,
      status: state.completions[item.id] || item.status
    })));
    if (!stats.total || stats.percent < STREAK_THRESHOLD) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function weeklyRecap(occurrences) {
  const stats = completionStats(occurrences);
  const taskScores = Object.values(groupBy(occurrences, "taskId"))
    .map((items) => {
      const itemStats = completionStats(items);
      return { title: items[0]?.title || "", ...itemStats };
    })
    .filter((item) => item.total > 0)
    .sort((a, b) => b.percent - a.percent || b.total - a.total);
  const dayScores = Object.entries(groupBy(occurrences, "date"))
    .map(([date, items]) => ({ date, ...completionStats(items) }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.percent - a.percent || b.completed - a.completed);
  return {
    ...stats,
    bestTasks: taskScores.filter((item) => item.percent >= STREAK_THRESHOLD).slice(0, 3),
    worstTasks: [...taskScores].sort((a, b) => a.percent - b.percent || b.total - a.total).slice(0, 3),
    bestDay: dayScores[0] || null,
    worstDay: dayScores.length ? dayScores[dayScores.length - 1] : null,
    recommendation: recommendationKey(stats, taskScores)
  };
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

function todayISO() {
  return toISODate(new Date());
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(dateISO, amount) {
  const date = parseISODate(dateISO);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

function weekDates(dateISO) {
  const start = parseISODate(dateISO);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return toISODate(date);
  });
}

function weekdayKey(dateISO) {
  return WEEKDAYS[parseISODate(dateISO).getDay()];
}

function dayLabelKeys(day) {
  return {
    sun: "sunday",
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday"
  }[day];
}

function formatShortDate(dateISO) {
  const [, month, day] = dateISO.split("-");
  return `${Number(day)}.${Number(month)}.`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]);
}

function escapeAttr(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}
