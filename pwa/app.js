const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const STORE_KEY = "daily-tracker-pro:pwa:v1";
const STREAK_THRESHOLD = 0.8;

const translations = {
  cs: {
    appName: "Daily Tracker Pro",
    today: "Dnes",
    week: "Týden",
    tasks: "Úkoly",
    plan: "Plán",
    recap: "Recap",
    settings: "Nastavení",
    addTask: "Přidat úkol",
    taskName: "Název úkolu",
    reminder: "Připomínka",
    noReminder: "Bez času",
    moveTask: "Přesunout úkol",
    newTime: "Nový čas",
    moveTaskHint: "Nastav nový čas pro tento výskyt úkolu.",
    recurring: "Opakovaný",
    oneTime: "Jednorázový",
    weeklyDays: "Dny v týdnu",
    everyOtherDay: "Ob den",
    repeatStart: "Start opakování",
    save: "Uložit",
    cancel: "Zrušit",
    delete: "Smazat",
    dailyProgress: "Denní progres",
    yesterdayLeftovers: "Ze včera",
    addToday: "Přidat na dnes",
    addTodayHint: "Vyber čas, kdy se ti tenhle úkol hodí dnes.",
    nextTask: "Další úkol",
    fullDay: "Celý den",
    nextTaskEmpty: "Na dnes už nemáš žádný další úkol.",
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
    dataManagement: "Data",
    backupHint: "Stáhni si zálohu nebo obnov data z dříve exportovaného souboru.",
    exportData: "Exportovat data",
    importData: "Importovat data",
    importConfirm: "Import nahradí aktuální data v tomto zařízení. Pokračovat?",
    importSuccess: "Data byla obnovena.",
    importInvalid: "Soubor nejde načíst jako záloha Daily Tracker Pro.",
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
    taskDate: "Datum úkolu",
    addForDay: "Přidat na den",
    installHint: "Přidat na plochu",
    pwaLimit: "PWA notifikace jsou demo režim; pro přesné budíky je lepší pozdější iOS build.",
    taskTime: "Čas na úkol",
    weeklyRecap: "Týdenní recap",
    snooze: "Připomenout znovu",
    snooze15: "15 min",
    snooze30: "30 min",
    snooze60: "1 h",
    snoozedUntil: "Znovu v {time}",
    notToday: "Ne dnes"
    ,
    projects: "Projekty",
    addProject: "Přidat projekt",
    projectName: "Název projektu",
    projectAddress: "Adresa / místo",
    projectStart: "Začátek projektu",
    projectEnd: "Konec projektu",
    projectRange: "Rozsah projektu",
    projectProgress: "{completed} z {total} kroků tento měsíc hotovo",
    projectStep: "Krok projektu",
    addProjectStep: "Přidat krok",
    stepName: "Název kroku",
    plannedTime: "Plánovaný čas",
    from: "Od",
    to: "Do",
    monthPlanEmpty: "Vyber den v kalendáři nebo přidej projektový krok.",
    noProjects: "Zatím nemáš žádný projekt.",
    selectProject: "Vyber projekt",
    projectRequired: "Nejdřív přidej projekt.",
    previousMonth: "Předchozí měsíc",
    nextMonth: "Další měsíc"
  },
  en: {
    appName: "Daily Tracker Pro",
    today: "Today",
    week: "Week",
    tasks: "Tasks",
    plan: "Plan",
    recap: "Recap",
    settings: "Settings",
    addTask: "Add task",
    taskName: "Task name",
    reminder: "Reminder",
    noReminder: "No time",
    moveTask: "Move task",
    newTime: "New time",
    moveTaskHint: "Set a new time for this task occurrence.",
    recurring: "Recurring",
    oneTime: "One-time",
    weeklyDays: "Weekdays",
    everyOtherDay: "Every other day",
    repeatStart: "Repeat start",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    dailyProgress: "Daily progress",
    yesterdayLeftovers: "From yesterday",
    addToday: "Add today",
    addTodayHint: "Choose when this task fits today.",
    nextTask: "Next task",
    fullDay: "Full day",
    nextTaskEmpty: "No next task left for today.",
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
    dataManagement: "Data",
    backupHint: "Download a backup or restore data from an earlier export file.",
    exportData: "Export data",
    importData: "Import data",
    importConfirm: "Import will replace the current data on this device. Continue?",
    importSuccess: "Data was restored.",
    importInvalid: "This file cannot be read as a Daily Tracker Pro backup.",
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
    taskDate: "Task date",
    addForDay: "Add for day",
    installHint: "Add to Home Screen",
    pwaLimit: "PWA notifications are demo mode; a later iOS build is better for exact alarms.",
    taskTime: "Task time",
    weeklyRecap: "Weekly recap",
    snooze: "Remind again",
    snooze15: "15 min",
    snooze30: "30 min",
    snooze60: "1 h",
    snoozedUntil: "Again at {time}",
    notToday: "Not today",
    projects: "Projects",
    addProject: "Add project",
    projectName: "Project name",
    projectAddress: "Address / place",
    projectStart: "Project start",
    projectEnd: "Project end",
    projectRange: "Project range",
    projectProgress: "{completed} of {total} steps done this month",
    projectStep: "Project step",
    addProjectStep: "Add step",
    stepName: "Step name",
    plannedTime: "Planned time",
    from: "From",
    to: "To",
    monthPlanEmpty: "Pick a date in the calendar or add a project step.",
    noProjects: "You do not have any projects yet.",
    selectProject: "Select project",
    projectRequired: "Add a project first.",
    previousMonth: "Previous month",
    nextMonth: "Next month"
  }
};

let state = loadState();
let currentScreen = "today";
let currentPlanMonth = startOfMonthISO(todayISO());
let editingTaskId = null;
let notifiedKeys = new Set();
let dragState = null;
let suppressOccurrenceClickId = null;

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
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORE_KEY) || "{}"));
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function defaultState() {
  return {
    projects: [],
    tasks: [],
    completions: {},
    snoozes: {},
    skips: {},
    timeOverrides: {},
    settings: { language: "cs", theme: "light", notifications: "default", todayMode: "next" }
  };
}

function normalizeState(value) {
  const fallback = defaultState();
  const source = value && typeof value === "object" ? value : {};
  const settings = source.settings && typeof source.settings === "object" && !Array.isArray(source.settings) ? source.settings : {};
  return {
    projects: Array.isArray(source.projects) ? source.projects : fallback.projects,
    tasks: Array.isArray(source.tasks) ? source.tasks : fallback.tasks,
    completions:
      source.completions && typeof source.completions === "object" && !Array.isArray(source.completions)
        ? source.completions
        : fallback.completions,
    snoozes:
      source.snoozes && typeof source.snoozes === "object" && !Array.isArray(source.snoozes)
        ? source.snoozes
        : fallback.snoozes,
    skips:
      source.skips && typeof source.skips === "object" && !Array.isArray(source.skips)
        ? source.skips
        : fallback.skips,
    timeOverrides:
      source.timeOverrides && typeof source.timeOverrides === "object" && !Array.isArray(source.timeOverrides)
        ? source.timeOverrides
        : fallback.timeOverrides,
    settings: { ...fallback.settings, ...settings }
  };
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
  if (currentScreen === "plan") return renderPlan();
  if (currentScreen === "recap") return renderRecap();
  return renderSettings();
}

function renderToday() {
  const today = todayISO();
  const occurrences = hydratedOccurrencesForWeek(today).filter((item) => item.date === today);
  const leftovers = yesterdayLeftovers();
  const stats = completionStats(occurrences);
  const nextOccurrence = occurrences.find((occurrence) => occurrence.status !== "done");
  const showNext = state.settings.todayMode !== "full";
  return `
    ${renderProgressCard(t("dailyProgress"), stats)}
    ${renderYesterdayReset(leftovers)}
    <article class="card today-mode-card">
      <div class="segmented">
        ${renderSegment("todayMode", "next", t("nextTask"))}
        ${renderSegment("todayMode", "full", t("fullDay"))}
      </div>
    </article>
    <button class="secondary full" data-action="new-onetime">+ ${t("addOneTimeToday")}</button>
    ${showNext ? renderNextTask(nextOccurrence, occurrences.length) : occurrences.length ? occurrences.map((occurrence) => renderOccurrence(occurrence, false, true)).join("") : renderEmpty(t("todayEmpty"))}
  `;
}

function renderNextTask(nextOccurrence, total) {
  if (nextOccurrence) return renderOccurrence(nextOccurrence, true);
  return renderEmpty(total ? t("nextTaskEmpty") : t("todayEmpty"));
}

function yesterdayLeftovers() {
  const yesterday = addDays(todayISO(), -1);
  return hydratedOccurrencesForWeek(yesterday).filter((occurrence) => occurrence.date === yesterday && occurrence.status !== "done");
}

function renderYesterdayReset(leftovers) {
  if (!leftovers.length) return "";
  return `
    <article class="card reset-card">
      <h2>${t("yesterdayLeftovers")}</h2>
      ${leftovers.map(renderLeftover).join("")}
    </article>
  `;
}

function renderLeftover(occurrence) {
  return `
    <div class="reset-row">
      <span>
        <strong>${escapeHtml(occurrence.title)}</strong>
        <small>${escapeHtml(occurrenceMeta(occurrence))}</small>
      </span>
      <button class="secondary" data-carry-over-occurrence="${occurrence.id}">${t("addToday")}</button>
    </div>
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
        <article class="card day-card" data-day-date="${date}">
          <div class="day-card-head">
            <div>
              <strong>${t(dayLabelKeys(weekdayKey(date)))} ${formatShortDate(date)}</strong>
              <span class="muted">${t("completedOf", { completed: stats.completed, total: stats.total })}</span>
            </div>
            <button class="day-add" data-add-onetime-date="${date}" aria-label="${t("addForDay")}">+</button>
          </div>
          ${renderMeter(stats.percent)}
          ${items.map((occurrence) => renderOccurrence(occurrence, false, true)).join("")}
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

function renderPlan() {
  const dates = monthGridDates(currentPlanMonth);
  const projectTasks = state.tasks.filter((task) => task.active !== false && task.projectId);
  const monthItems = projectOccurrencesForDates(dates).filter((occurrence) => occurrence.date.slice(0, 7) === currentPlanMonth.slice(0, 7));

  return `
    <article class="card plan-toolbar">
      <div class="row between">
        <button class="secondary compact" data-action="prev-month" aria-label="${t("previousMonth")}">‹</button>
        <h2>${monthName(currentPlanMonth)}</h2>
        <button class="secondary compact" data-action="next-month" aria-label="${t("nextMonth")}">›</button>
      </div>
      <div class="form-actions">
        <button class="secondary" data-action="new-project">+ ${t("addProject")}</button>
        <button class="primary" data-action="new-plan-step">+ ${t("addProjectStep")}</button>
      </div>
    </article>
    <article class="card">
      <h2>${t("projects")}</h2>
      ${state.projects.length ? state.projects.map(renderProject).join("") : `<p class="muted">${t("noProjects")}</p>`}
    </article>
    <article class="card calendar-card">
      <div class="calendar-grid calendar-head">
        ${WEEKDAYS.map((day) => `<strong>${t(dayLabelKeys(day))}</strong>`).join("")}
      </div>
      <div class="calendar-grid">
        ${dates.map((date) => renderCalendarDay(date, monthItems)).join("")}
      </div>
    </article>
    ${projectTasks.length ? "" : renderEmpty(t("monthPlanEmpty"))}
  `;
}

function renderProject(project) {
  const monthOccurrences = projectOccurrencesForDates(monthGridDates(currentPlanMonth)).filter(
    (occurrence) => occurrence.projectId === project.id && occurrence.date.slice(0, 7) === currentPlanMonth.slice(0, 7)
  );
  const completed = monthOccurrences.filter((occurrence) => state.completions[occurrence.id] === "done").length;
  const total = monthOccurrences.length;
  return `
    <div class="project-row">
      <span>
        <strong>${escapeHtml(project.name)}</strong>
        <small>${escapeHtml(project.address || "")}</small>
        <small>${projectDateRange(project)}</small>
        <small>${t("projectProgress", { completed, total })}</small>
      </span>
      <em>${total ? Math.round((completed / total) * 100) : 0}%</em>
    </div>
  `;
}

function renderCalendarDay(date, monthItems) {
  const inMonth = date.slice(0, 7) === currentPlanMonth.slice(0, 7);
  const items = monthItems.filter((task) => task.date === date);
  return `
    <button class="calendar-day ${inMonth ? "" : "outside"} ${date === todayISO() ? "today" : ""}" data-plan-date="${date}">
      <span>${Number(date.slice(8, 10))}</span>
      ${items
        .slice(0, 3)
        .map((item) => `<small>${escapeHtml(item.title)}</small>`)
        .join("")}
      ${items.length > 3 ? `<small>+${items.length - 3}</small>` : ""}
    </button>
  `;
}

function renderRecap() {
  const recap = weeklyRecap(recapOccurrences(), recapWindowDates());
  if (!recap.total) return `${renderProgressCard(t("recap"), recap)}${renderEmpty(t("noRecap"))}`;
  return `
    ${renderProgressCard(t("recap"), recap)}
    ${renderWeekChart(recap.days)}
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

function recapOccurrences() {
  const dates = recapWindowDates();
  const baseDate = dates[dates.length - 1] || todayISO();
  return hydratedOccurrencesForWeek(baseDate).filter((occurrence) => dates.includes(occurrence.date));
}

function recapWindowDates() {
  const today = todayISO();
  const baseDate = weekdayKey(today) === "sun" ? addDays(today, -1) : today;
  return weekDates(baseDate).filter((date) => date <= baseDate);
}

function renderSettings() {
  const notificationText = "Notification" in window && Notification.permission === "granted" ? t("notificationReady") : t("pwaLimit");
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
    <article class="card">
      <h2>${t("dataManagement")}</h2>
      <p class="muted">${t("backupHint")}</p>
      <div class="form-actions settings-actions">
        <button class="secondary" data-action="export-data">${t("exportData")}</button>
        <button class="primary" data-action="import-data">${t("importData")}</button>
      </div>
      <input class="hidden" data-import-file type="file" accept="application/json,.json" />
    </article>
  `;
}

function projectOccurrencesForDates(dates) {
  const activeProjectTasks = state.tasks.filter((task) => task.active !== false && task.projectId);
  const itemsById = new Map();
  for (const date of dates) {
    for (const occurrence of occurrencesForWeek(activeProjectTasks, date)) {
      if (dates.includes(occurrence.date)) itemsById.set(occurrence.id, occurrence);
    }
  }
  return [...itemsById.values()].sort((a, b) => a.date.localeCompare(b.date) || (a.reminderTime || "99:99").localeCompare(b.reminderTime || "99:99"));
}

function renderTabs() {
  const tabs = [
    ["today", "✓", "today"],
    ["week", "▦", "week"],
    ["tasks", "+", "tasks"],
    ["plan", "□", "plan"],
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

function renderOccurrence(occurrence, showActions = true, draggable = false) {
  const done = occurrence.status === "done";
  return `
    <article class="occurrence-card ${draggable && !done ? "draggable-occurrence" : ""}" data-occurrence-card="${occurrence.id}" data-occurrence-date="${occurrence.date}" ${draggable && !done ? "data-draggable-occurrence=\"true\"" : ""}>
      <button class="occurrence ${done ? "done" : ""}" data-occurrence="${occurrence.id}">
        <span>${done ? "●" : "○"}</span>
        <span>
          <strong>${escapeHtml(occurrence.title)}</strong>
          <small>${escapeHtml(occurrenceMeta(occurrence))}</small>
        </span>
      </button>
      ${!showActions || done ? "" : renderSnoozeActions(occurrence)}
    </article>
  `;
}

function renderSnoozeActions(occurrence) {
  return `
    <div class="snooze-row" aria-label="${t("snooze")}">
      <button class="secondary" data-not-today-occurrence="${occurrence.id}">${t("notToday")}</button>
      <button class="secondary" data-snooze-occurrence="${occurrence.id}" data-snooze-minutes="15">${t("snooze15")}</button>
      <button class="secondary" data-snooze-occurrence="${occurrence.id}" data-snooze-minutes="30">${t("snooze30")}</button>
      <button class="secondary" data-snooze-occurrence="${occurrence.id}" data-snooze-minutes="60">${t("snooze60")}</button>
    </div>
  `;
}

function renderTask(task) {
  const detail = task.type === "oneTime" ? t("oneTime") : t("recurring");
  return `
    <article class="task-card">
      <button class="task-main" data-edit-task="${task.id}">
        <strong>${escapeHtml(task.title)}</strong>
        <small>${escapeHtml(task.projectId ? projectTaskMeta(task) : `${detail} - ${task.reminderTime || t("noReminder")}`)}</small>
      </button>
      <button class="danger" data-delete-task="${task.id}">${t("delete")}</button>
    </article>
  `;
}

function occurrenceMeta(occurrence) {
  const time = timeRange(occurrence);
  const project = occurrence.projectId ? projectName(occurrence.projectId) : "";
  const base = time && project ? `${time} - ${project}` : time || project || occurrence.reminderTime || t("noReminder");
  const snooze = snoozeLabel(occurrence.snoozeAt);
  return snooze ? `${base} - ${snooze}` : base;
}

function projectTaskMeta(task) {
  const project = projectName(task.projectId);
  const time = timeRange(task);
  const plan =
    task.type === "recurring"
      ? task.recurrence === "everyOtherDay"
        ? `${t("everyOtherDay")} ${task.date ? `${t("from").toLowerCase()} ${formatShortDate(task.date)}` : ""}`
        : `${t("recurring")} ${daysSummary(task.daysOfWeek || [])}`
      : task.date || "";
  return `${plan}${time ? ` - ${time}` : ""}${project ? ` - ${project}` : ""}`;
}

function daysSummary(days) {
  if (!days.length) return "";
  return days.map((day) => t(dayLabelKeys(day))).join(", ");
}

function timeRange(item) {
  if (item.startTime && item.endTime) return `${item.startTime}-${item.endTime}`;
  return item.startTime || item.endTime || item.reminderTime || "";
}

function projectName(projectId) {
  return state.projects.find((project) => project.id === projectId)?.name || "";
}

function projectDateRange(project) {
  if (project.startDate && project.endDate) return `${formatShortDate(project.startDate)} - ${formatShortDate(project.endDate)}`;
  if (project.startDate) return `${t("projectStart")}: ${formatShortDate(project.startDate)}`;
  if (project.endDate) return `${t("projectEnd")}: ${formatShortDate(project.endDate)}`;
  return t("projectRange");
}

function isDateWithinProject(dateISO, project) {
  const startsOk = !project.startDate || dateISO >= project.startDate;
  const endsOk = !project.endDate || dateISO <= project.endDate;
  return startsOk && endsOk;
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

function renderWeekChart(days) {
  if (!days.length) return "";
  return `
    <article class="card chart-card">
      <div class="week-chart">
        ${days.map(renderChartBar).join("")}
      </div>
    </article>
  `;
}

function renderChartBar(day) {
  const percent = Math.round(day.percent * 100);
  return `
    <div class="chart-day">
      <strong>${percent}%</strong>
      <div class="chart-track">
        <span style="height:${percent}%"></span>
      </div>
      <small>${t(dayLabelKeys(weekdayKey(day.date)))}</small>
    </div>
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
    button.addEventListener("click", () => {
      if (suppressOccurrenceClickId === button.dataset.occurrence) {
        suppressOccurrenceClickId = null;
        return;
      }
      toggleOccurrence(button.dataset.occurrence);
    });
  });
  bindOccurrenceDragEvents();
  document.querySelectorAll("[data-snooze-occurrence]").forEach((button) => {
    button.addEventListener("click", () => {
      snoozeOccurrence(button.dataset.snoozeOccurrence, Number(button.dataset.snoozeMinutes));
    });
  });
  document.querySelectorAll("[data-not-today-occurrence]").forEach((button) => {
    button.addEventListener("click", () => notTodayOccurrence(button.dataset.notTodayOccurrence));
  });
  document.querySelectorAll("[data-carry-over-occurrence]").forEach((button) => {
    button.addEventListener("click", () => openCarryOverModal(button.dataset.carryOverOccurrence));
  });
  document.querySelector("[data-action='new-recurring']")?.addEventListener("click", () => openTaskModal("recurring"));
  document.querySelector("[data-action='new-onetime']")?.addEventListener("click", () => openTaskModal("oneTime"));
  document.querySelectorAll("[data-add-onetime-date]").forEach((button) => {
    button.addEventListener("click", () => openTaskModal("oneTime", null, button.dataset.addOnetimeDate));
  });
  document.querySelector("[data-action='new-project']")?.addEventListener("click", openProjectModal);
  document.querySelector("[data-action='new-plan-step']")?.addEventListener("click", () => openPlanStepModal(todayISO()));
  document.querySelector("[data-action='prev-month']")?.addEventListener("click", () => {
    currentPlanMonth = addMonths(currentPlanMonth, -1);
    render();
  });
  document.querySelector("[data-action='next-month']")?.addEventListener("click", () => {
    currentPlanMonth = addMonths(currentPlanMonth, 1);
    render();
  });
  document.querySelectorAll("[data-plan-date]").forEach((button) => {
    button.addEventListener("click", () => openPlanStepModal(button.dataset.planDate));
  });
  document.querySelector("[data-action='notifications']")?.addEventListener("click", requestNotifications);
  document.querySelector("[data-action='export-data']")?.addEventListener("click", exportData);
  document.querySelector("[data-action='import-data']")?.addEventListener("click", () => {
    document.querySelector("[data-import-file]")?.click();
  });
  document.querySelector("[data-import-file]")?.addEventListener("change", (event) => {
    const [file] = event.target.files || [];
    if (file) importData(file);
    event.target.value = "";
  });
  document.querySelectorAll("[data-edit-task]").forEach((button) => {
    button.addEventListener("click", () => {
      const task = state.tasks.find((item) => item.id === button.dataset.editTask);
      if (task?.projectId) {
        openPlanStepModal(task.date || todayISO(), task.id);
      } else {
        openTaskModal(null, button.dataset.editTask);
      }
    });
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

function bindOccurrenceDragEvents() {
  document.querySelectorAll("[data-draggable-occurrence]").forEach((card) => {
    card.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".snooze-row")) return;
      const occurrenceId = card.dataset.occurrenceCard;
      dragState = {
        card,
        occurrenceId,
        sourceDate: card.dataset.occurrenceDate,
        startX: event.clientX,
        startY: event.clientY,
        latestX: event.clientX,
        latestY: event.clientY,
        dragging: false,
        timer: window.setTimeout(() => startOccurrenceDrag(), 280)
      };
      window.addEventListener("pointermove", trackOccurrenceDrag);
      window.addEventListener("pointerup", finishOccurrenceDrag, { once: true });
      window.addEventListener("pointercancel", cancelOccurrenceDrag, { once: true });
    });
  });
}

function startOccurrenceDrag() {
  if (!dragState) return;
  dragState.dragging = true;
  suppressOccurrenceClickId = dragState.occurrenceId;
  dragState.card.classList.add("dragging");
  document.body.classList.add("dragging-occurrence");
}

function trackOccurrenceDrag(event) {
  if (!dragState) return;
  dragState.latestX = event.clientX;
  dragState.latestY = event.clientY;
  if (dragState.dragging) event.preventDefault();
  if (!dragState.dragging && distanceBetween(dragState.startX, dragState.startY, event.clientX, event.clientY) > 10) {
    clearTimeout(dragState.timer);
  }
}

function finishOccurrenceDrag(event) {
  if (!dragState) return;
  clearTimeout(dragState.timer);
  window.removeEventListener("pointermove", trackOccurrenceDrag);
  const currentDrag = dragState;
  dragState = null;
  document.body.classList.remove("dragging-occurrence");
  currentDrag.card.classList.remove("dragging");
  if (!currentDrag.dragging) return;
  const target = document.elementFromPoint(event.clientX, event.clientY);
  const targetDate = target?.closest("[data-day-date]")?.dataset.dayDate || target?.closest("[data-occurrence-card]")?.dataset.occurrenceDate;
  if (targetDate === currentDrag.sourceDate) {
    openRescheduleModal(currentDrag.occurrenceId);
  }
  window.setTimeout(() => {
    if (suppressOccurrenceClickId === currentDrag.occurrenceId) suppressOccurrenceClickId = null;
  }, 600);
}

function cancelOccurrenceDrag() {
  if (!dragState) return;
  clearTimeout(dragState.timer);
  window.removeEventListener("pointermove", trackOccurrenceDrag);
  dragState.card.classList.remove("dragging");
  document.body.classList.remove("dragging-occurrence");
  dragState = null;
}

function distanceBetween(startX, startY, endX, endY) {
  return Math.hypot(endX - startX, endY - startY);
}

function openProjectModal() {
  const today = todayISO();
  document.querySelector("#modal-root").innerHTML = `
    <div class="modal-backdrop">
      <form class="modal-card" id="project-form">
        <h2>${t("addProject")}</h2>
        <input name="name" autocomplete="off" placeholder="${t("projectName")}" />
        <input name="address" autocomplete="off" placeholder="${t("projectAddress")}" />
        <div class="time-range">
          <label>
            <span>${t("projectStart")}</span>
            <input name="startDate" type="date" value="${today}" />
          </label>
          <label>
            <span>${t("projectEnd")}</span>
            <input name="endDate" type="date" value="${addMonths(today, 1)}" />
          </label>
        </div>
        <div class="form-actions">
          <button type="button" class="secondary" data-close>${t("cancel")}</button>
          <button type="submit" class="primary">${t("save")}</button>
        </div>
      </form>
    </div>
  `;

  const form = document.querySelector("#project-form");
  form.elements.name.focus();
  form.querySelector("[data-close]").addEventListener("click", closeModal);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    if (!name) return;
    state.projects.push({
      id: String(Date.now()),
      name,
      address: form.elements.address.value.trim(),
      startDate: form.elements.startDate.value || today,
      endDate: form.elements.endDate.value || form.elements.startDate.value || today,
      createdAt: new Date().toISOString()
    });
    saveState();
    closeModal();
    render();
  });
}

function openPlanStepModal(date = todayISO(), taskId = null) {
  if (!state.projects.length) {
    openProjectModal();
    return;
  }
  const activeProject = state.projects.find((project) => isDateWithinProject(date, project)) || state.projects[0];
  const task =
    state.tasks.find((item) => item.id === taskId) ||
    {
      id: null,
      title: "",
      projectId: activeProject.id,
      type: "oneTime",
      recurrence: "weekdays",
      daysOfWeek: [...WEEKDAYS],
      date,
      startTime: "08:00",
      endTime: "16:00"
    };
  const selectedDays = new Set(task.daysOfWeek?.length ? task.daysOfWeek : WEEKDAYS);
  const taskType = task.type || "oneTime";
  const recurrence = task.recurrence || "weekdays";
  const showDate = taskType === "oneTime" || (taskType === "recurring" && recurrence === "everyOtherDay");
  const showDays = taskType === "recurring" && recurrence === "weekdays";

  document.querySelector("#modal-root").innerHTML = `
    <div class="modal-backdrop">
      <form class="modal-card" id="plan-step-form">
        <h2>${t("projectStep")}</h2>
        <select name="projectId" class="select-input">
          ${state.projects
            .map(
              (project) => `
                <option value="${project.id}" ${project.id === task.projectId ? "selected" : ""}>
                  ${escapeHtml(project.name)} (${projectDateRange(project)})
                </option>
              `
            )
            .join("")}
        </select>
        <input name="title" autocomplete="off" value="${escapeAttr(task.title)}" placeholder="${t("stepName")}" />
        <div class="segmented">
          <button type="button" class="${taskType === "oneTime" ? "active" : ""}" data-plan-type="oneTime">${t("oneTime")}</button>
          <button type="button" class="${taskType === "recurring" ? "active" : ""}" data-plan-type="recurring">${t("recurring")}</button>
        </div>
        <input type="hidden" name="type" value="${taskType}" />
        <div class="segmented repeat-mode ${taskType === "recurring" ? "" : "hidden"}">
          <button type="button" class="${recurrence === "weekdays" ? "active" : ""}" data-recurrence="weekdays">${t("weeklyDays")}</button>
          <button type="button" class="${recurrence === "everyOtherDay" ? "active" : ""}" data-recurrence="everyOtherDay">${t("everyOtherDay")}</button>
        </div>
        <input type="hidden" name="recurrence" value="${recurrence}" />
        <label class="date-row ${showDate ? "" : "hidden"}">
          <span data-date-label>${taskType === "recurring" ? t("repeatStart") : t("taskDate")}</span>
          <input name="date" type="date" value="${task.date || date}" />
        </label>
        <div class="days-row ${showDays ? "" : "hidden"}">
          ${WEEKDAYS.map(
            (day) => `
              <button type="button" class="${selectedDays.has(day) ? "active" : ""}" data-plan-day="${day}">
                ${t(dayLabelKeys(day))}
              </button>
            `
          ).join("")}
        </div>
        <input type="hidden" name="days" value="${[...selectedDays].join(",")}" />
        <div class="time-range">
          <label>
            <span>${t("from")}</span>
            <input name="startTime" type="time" value="${task.startTime || task.reminderTime || "08:00"}" />
          </label>
          <label>
            <span>${t("to")}</span>
            <input name="endTime" type="time" value="${task.endTime || "16:00"}" />
          </label>
        </div>
        <p class="muted">${t("plannedTime")} - ${t("reminder")}: ${t("from").toLowerCase()}</p>
        <div class="form-actions">
          <button type="button" class="secondary" data-close>${t("cancel")}</button>
          <button type="submit" class="primary">${t("save")}</button>
        </div>
      </form>
    </div>
  `;

  const form = document.querySelector("#plan-step-form");
  form.elements.title.focus();
  setTimeout(() => form.elements.title.scrollIntoView({ block: "center", behavior: "smooth" }), 250);
  form.querySelector("[data-close]").addEventListener("click", closeModal);
  const updatePlanRepeatFields = () => {
    const isRecurring = form.elements.type.value === "recurring";
    const isEveryOtherDay = form.elements.recurrence.value === "everyOtherDay";
    form.querySelector(".repeat-mode").classList.toggle("hidden", !isRecurring);
    form.querySelector(".days-row").classList.toggle("hidden", !isRecurring || isEveryOtherDay);
    form.querySelector(".date-row").classList.toggle("hidden", !(form.elements.type.value === "oneTime" || (isRecurring && isEveryOtherDay)));
    form.querySelector("[data-date-label]").textContent = isRecurring ? t("repeatStart") : t("taskDate");
  };
  form.querySelectorAll("[data-plan-type]").forEach((button) => {
    button.addEventListener("click", () => {
      form.elements.type.value = button.dataset.planType;
      form.querySelectorAll("[data-plan-type]").forEach((item) => item.classList.toggle("active", item === button));
      updatePlanRepeatFields();
    });
  });
  form.querySelectorAll("[data-recurrence]").forEach((button) => {
    button.addEventListener("click", () => {
      form.elements.recurrence.value = button.dataset.recurrence;
      form.querySelectorAll("[data-recurrence]").forEach((item) => item.classList.toggle("active", item === button));
      updatePlanRepeatFields();
    });
  });
  form.querySelectorAll("[data-plan-day]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      const days = [...form.querySelectorAll("[data-plan-day].active")].map((item) => item.dataset.planDay);
      form.elements.days.value = days.join(",");
    });
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    savePlanStepFromForm(form, taskId);
  });
}

function savePlanStepFromForm(form, taskId = null) {
  const title = form.elements.title.value.trim();
  if (!title) return;
  const existing = state.tasks.find((item) => item.id === taskId);
  const startTime = form.elements.startTime.value || "";
  const type = form.elements.type.value;
  const recurrence = type === "recurring" ? form.elements.recurrence.value : "";
  const task = {
    id: existing?.id || String(Date.now()),
    title,
    type,
    recurrence,
    projectId: form.elements.projectId.value,
    daysOfWeek: type === "recurring" && recurrence === "weekdays" ? form.elements.days.value.split(",").filter(Boolean) : [],
    date: type === "oneTime" || recurrence === "everyOtherDay" ? form.elements.date.value || todayISO() : "",
    startTime,
    endTime: form.elements.endTime.value || "",
    reminderTime: startTime,
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

function openTaskModal(type = "recurring", taskId = null, defaultDate = todayISO()) {
  editingTaskId = taskId;
  const task =
    state.tasks.find((item) => item.id === taskId) ||
    {
      id: null,
      title: "",
      type,
      daysOfWeek: [...WEEKDAYS],
      reminderTime: "",
      date: defaultDate,
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
        <label class="date-row ${task.type === "oneTime" ? "" : "hidden"}">
          <span>${t("taskDate")}</span>
          <input name="date" type="date" value="${task.date || defaultDate}" />
        </label>
        <div class="days-row ${task.type === "oneTime" ? "hidden" : ""}">
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
      form.querySelector(".date-row").classList.toggle("hidden", button.dataset.type !== "oneTime");
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
    date: form.elements.type.value === "oneTime" ? form.elements.date.value || todayISO() : "",
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

function openRescheduleModal(occurrenceId) {
  const occurrence = findOccurrence(occurrenceId);
  if (!occurrence) return;
  document.querySelector("#modal-root").innerHTML = `
    <div class="modal-backdrop">
      <form class="modal-card" id="reschedule-form">
        <h2>${t("moveTask")}</h2>
        <p class="muted">${escapeHtml(occurrence.title)}</p>
        <label class="date-row">
          <span>${t("newTime")}</span>
          <input name="time" type="time" value="${occurrence.startTime || occurrence.reminderTime || "08:00"}" />
        </label>
        <p class="muted">${t("moveTaskHint")}</p>
        <div class="form-actions">
          <button type="button" class="secondary" data-close>${t("cancel")}</button>
          <button type="submit" class="primary">${t("save")}</button>
        </div>
      </form>
    </div>
  `;

  const form = document.querySelector("#reschedule-form");
  form.elements.time.focus();
  form.querySelector("[data-close]").addEventListener("click", closeModal);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveOccurrenceTime(occurrenceId, form.elements.time.value || "08:00");
    closeModal();
    render();
  });
}

function openCarryOverModal(occurrenceId) {
  const occurrence = findOccurrence(occurrenceId);
  if (!occurrence) return;
  document.querySelector("#modal-root").innerHTML = `
    <div class="modal-backdrop">
      <form class="modal-card" id="carry-over-form">
        <h2>${t("addToday")}</h2>
        <p class="muted">${escapeHtml(occurrence.title)}</p>
        <label class="date-row">
          <span>${t("newTime")}</span>
          <input name="time" type="time" value="${occurrence.startTime || occurrence.reminderTime || "08:00"}" />
        </label>
        <p class="muted">${t("addTodayHint")}</p>
        <div class="form-actions">
          <button type="button" class="secondary" data-close>${t("cancel")}</button>
          <button type="submit" class="primary">${t("save")}</button>
        </div>
      </form>
    </div>
  `;

  const form = document.querySelector("#carry-over-form");
  form.elements.time.focus();
  form.querySelector("[data-close]").addEventListener("click", closeModal);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    carryOverOccurrence(occurrenceId, form.elements.time.value || "08:00");
    closeModal();
    render();
  });
}

function saveOccurrenceTime(occurrenceId, newTime) {
  const occurrence = findOccurrence(occurrenceId);
  if (!occurrence) return;
  const task = state.tasks.find((item) => item.id === occurrence.taskId);
  const endTime = shiftedEndTime(occurrence.startTime || occurrence.reminderTime, occurrence.endTime, newTime);
  delete state.snoozes[occurrenceId];
  if (task?.type === "oneTime") {
    task.startTime = task.startTime || occurrence.startTime ? newTime : "";
    task.endTime = endTime;
    task.reminderTime = newTime;
  } else {
    state.timeOverrides[occurrenceId] = {
      startTime: newTime,
      endTime,
      reminderTime: newTime
    };
  }
  saveState();
}

function carryOverOccurrence(occurrenceId, newTime) {
  const occurrence = findOccurrence(occurrenceId);
  if (!occurrence) return;
  const task = state.tasks.find((item) => item.id === occurrence.taskId);
  if (!task) return;
  const endTime = shiftedEndTime(occurrence.startTime || occurrence.reminderTime, occurrence.endTime, newTime);
  delete state.completions[occurrenceId];
  delete state.snoozes[occurrenceId];
  delete state.timeOverrides[occurrenceId];
  if (task.type === "oneTime") {
    task.date = todayISO();
    task.startTime = task.startTime || occurrence.startTime || occurrence.endTime ? newTime : "";
    task.endTime = endTime;
    task.reminderTime = newTime;
  } else {
    state.skips[occurrenceId] = true;
    state.tasks.push({
      id: String(Date.now()),
      title: occurrence.title,
      type: "oneTime",
      projectId: occurrence.projectId || "",
      daysOfWeek: [],
      date: todayISO(),
      startTime: occurrence.startTime || occurrence.endTime ? newTime : "",
      endTime,
      reminderTime: newTime,
      active: true,
      sourceTaskId: task.id,
      sourceOccurrenceId: occurrenceId,
      createdAt: new Date().toISOString()
    });
  }
  saveState();
}

function requestNotifications() {
  if (!("Notification" in window)) return;
  Notification.requestPermission().then((permission) => {
    state.settings.notifications = permission;
    saveState();
    render();
  });
}

function exportData() {
  const backup = {
    app: "daily-tracker-pro",
    version: 1,
    exportedAt: new Date().toISOString(),
    state: normalizeState(state)
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `daily-tracker-pro-backup-${todayISO()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = parseBackup(String(reader.result || ""));
      if (!window.confirm(t("importConfirm"))) return;
      state = imported;
      saveState();
      currentPlanMonth = startOfMonthISO(todayISO());
      render();
      window.alert(t("importSuccess"));
    } catch {
      window.alert(t("importInvalid"));
    }
  });
  reader.readAsText(file);
}

function parseBackup(text) {
  const payload = JSON.parse(text);
  const importedState = payload?.app === "daily-tracker-pro" && payload.state ? payload.state : payload;
  if (
    !importedState ||
    typeof importedState !== "object" ||
    !Array.isArray(importedState.tasks) ||
    !Array.isArray(importedState.projects) ||
    !importedState.completions ||
    typeof importedState.completions !== "object" ||
    Array.isArray(importedState.completions)
  ) {
    throw new Error("Invalid backup");
  }
  return normalizeState(importedState);
}

function startReminderLoop() {
  setInterval(checkReminders, 30000);
  checkReminders();
}

function checkReminders() {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const now = new Date();
  const currentDate = toISODate(now);
  const currentTime = timeString(now);
  for (const occurrence of hydratedOccurrencesForWeek(currentDate)) {
    const key = `${occurrence.id}:${currentTime}`;
    if (occurrence.date === currentDate && occurrence.reminderTime === currentTime && !notifiedKeys.has(key)) {
      notifiedKeys.add(key);
      new Notification(t("taskTime"), { body: occurrence.title, icon: "./icons/icon.svg" });
    }
    const snoozeKey = `${occurrence.id}:snooze:${currentTime}`;
    if (occurrence.snoozeAt === `${currentDate}T${currentTime}` && !notifiedKeys.has(snoozeKey)) {
      notifiedKeys.add(snoozeKey);
      delete state.snoozes[occurrence.id];
      saveState();
      new Notification(t("snooze"), { body: occurrence.title, icon: "./icons/icon.svg" });
      render();
    }
  }
  if (now.getDay() === 0 && currentTime === "09:00" && !notifiedKeys.has(`recap:${currentDate}`)) {
    notifiedKeys.add(`recap:${currentDate}`);
    new Notification(t("weeklyRecap"), { body: t("recap"), icon: "./icons/icon.svg" });
  }
}

function hydratedOccurrencesForWeek(dateISO) {
  return occurrencesForWeek(state.tasks.filter((task) => task.active !== false), dateISO)
    .filter((occurrence) => !state.skips[occurrence.id])
    .map(hydrateOccurrence)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.reminderTime || "99:99").localeCompare(b.reminderTime || "99:99"));
}

function hydrateOccurrence(occurrence) {
  const override = state.timeOverrides[occurrence.id] || {};
  return {
    ...occurrence,
    ...override,
    status: state.completions[occurrence.id] || occurrence.status,
    snoozeAt: state.snoozes[occurrence.id] || ""
  };
}

function findOccurrence(occurrenceId) {
  const [, date] = splitOccurrenceId(occurrenceId);
  return hydratedOccurrencesForWeek(date).find((occurrence) => occurrence.id === occurrenceId);
}

function occurrencesForWeek(tasks, dateISO) {
  const dates = weekDates(dateISO);
  const occurrences = [];
  for (const task of tasks) {
    const project = task.projectId ? state.projects.find((item) => item.id === task.projectId) : null;
    if (task.type === "oneTime") {
      if (dates.includes(task.date) && (!project || isDateWithinProject(task.date, project))) occurrences.push(createOccurrence(task, task.date));
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

function createOccurrence(task, date) {
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
    status: "pending"
  };
}

function splitOccurrenceId(id) {
  const separator = id.lastIndexOf(":");
  return [id.slice(0, separator), id.slice(separator + 1)];
}

function toggleOccurrence(id) {
  state.completions[id] = state.completions[id] === "done" ? "pending" : "done";
  if (state.completions[id] === "done") delete state.snoozes[id];
  saveState();
  render();
}

function notTodayOccurrence(id) {
  const [taskId, date] = splitOccurrenceId(id);
  const task = state.tasks.find((item) => item.id === taskId);
  delete state.completions[id];
  delete state.snoozes[id];
  if (task?.type === "oneTime") {
    task.date = addDays(date, 1);
  } else {
    state.skips[id] = true;
  }
  saveState();
  render();
}

function snoozeOccurrence(id, minutes) {
  const snoozeAt = addMinutes(new Date(), minutes);
  state.snoozes[id] = `${toISODate(snoozeAt)}T${timeString(snoozeAt)}`;
  notifiedKeys.delete(`${id}:snooze:${timeString(snoozeAt)}`);
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

function weeklyRecap(occurrences, dates = []) {
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
  const chartDates = dates.length ? dates : Object.keys(groupBy(occurrences, "date")).sort();
  const chartDays = chartDates.map((date) => ({
    date,
    ...completionStats(occurrences.filter((item) => item.date === date))
  }));
  return {
    ...stats,
    days: chartDays,
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

function timeString(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function shiftedEndTime(oldStart, oldEnd, newStart) {
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

function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addMinutes(date, amount) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + amount);
  return next;
}

function snoozeLabel(value) {
  if (!value) return "";
  const [date, time] = value.split("T");
  if (!date || !time) return "";
  const label = date === todayISO() ? time : `${formatShortDate(date)} ${time}`;
  return t("snoozedUntil", { time: label });
}

function addDays(dateISO, amount) {
  const date = parseISODate(dateISO);
  date.setDate(date.getDate() + amount);
  return toISODate(date);
}

function daysBetween(startISO, endISO) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((parseISODate(endISO) - parseISODate(startISO)) / millisecondsPerDay);
}

function startOfMonthISO(dateISO) {
  const date = parseISODate(dateISO);
  date.setDate(1);
  return toISODate(date);
}

function addMonths(dateISO, amount) {
  const date = parseISODate(dateISO);
  date.setDate(1);
  date.setMonth(date.getMonth() + amount);
  return toISODate(date);
}

function monthName(dateISO) {
  return parseISODate(dateISO).toLocaleDateString(state.settings.language === "cs" ? "cs-CZ" : "en-US", {
    month: "long",
    year: "numeric"
  });
}

function monthGridDates(dateISO) {
  const first = parseISODate(startOfMonthISO(dateISO));
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return toISODate(date);
  });
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
