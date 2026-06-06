import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WEEKDAY_KEYS, formatShortDate, todayISO, weekDates, weekdayKey } from "./src/core/date.js";
import { completionStats, currentStreak, weeklyRecap } from "./src/core/progress.js";
import {
  deleteTask,
  getSetting,
  getTasks,
  hydratedOccurrencesForWeek,
  saveTask,
  setCompletion,
  setSetting
} from "./src/data/database.js";
import { rescheduleNotifications } from "./src/services/notificationService.js";
import { t } from "./src/i18n/translations.js";

const dayLabelKeys = {
  sun: "sunday",
  mon: "monday",
  tue: "tuesday",
  wed: "wednesday",
  thu: "thursday",
  fri: "friday",
  sat: "saturday"
};

const emptyForm = {
  id: null,
  title: "",
  type: "recurring",
  daysOfWeek: [...WEEKDAY_KEYS],
  reminderTime: "",
  leadTimeMinutes: null,
  date: todayISO()
};

const leadTimePresets = [5, 10, 15, 30, 60];

const themes = {
  light: {
    mode: "light",
    background: "#f8fafc",
    surface: "#ffffff",
    elevated: "#ffffff",
    text: "#0f172a",
    muted: "#64748b",
    border: "#cbd5e1",
    inputBorder: "#94a3b8",
    primary: "#0f766e",
    primaryText: "#ffffff",
    primarySoft: "#ccfbf1",
    secondary: "#e0f2fe",
    secondaryText: "#155e75",
    track: "#e2e8f0",
    danger: "#be123c",
    dangerSoft: "#fff1f2",
    modalShade: "rgba(15, 23, 42, 0.35)",
    nested: "#f8fafc"
  },
  dark: {
    mode: "dark",
    background: "#0b1120",
    surface: "#111827",
    elevated: "#1f2937",
    text: "#f8fafc",
    muted: "#94a3b8",
    border: "#334155",
    inputBorder: "#475569",
    primary: "#2dd4bf",
    primaryText: "#042f2e",
    primarySoft: "#134e4a",
    secondary: "#164e63",
    secondaryText: "#cffafe",
    track: "#334155",
    danger: "#fb7185",
    dangerSoft: "#4c0519",
    modalShade: "rgba(2, 6, 23, 0.72)",
    nested: "#0f172a"
  }
};

export default function App() {
  const [language, setLanguageState] = useState("cs");
  const [themeMode, setThemeMode] = useState("light");
  const [screen, setScreen] = useState("today");
  const [tasks, setTasks] = useState([]);
  const [occurrences, setOccurrences] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const today = todayISO();
  const dates = useMemo(() => weekDates(today), [today]);
  const theme = themes[themeMode] || themes.light;
  const styles = useMemo(() => createStyles(theme), [themeMode]);

  useEffect(() => {
    boot();
  }, []);

  async function boot() {
    const savedLanguage = await getSetting("language", "cs");
    const savedTheme = await getSetting("theme", "light");
    setLanguageState(savedLanguage);
    setThemeMode(savedTheme === "dark" ? "dark" : "light");
    await refresh(savedLanguage);
  }

  async function refresh(nextLanguage = language) {
    const nextTasks = await getTasks();
    const nextOccurrences = await hydratedOccurrencesForWeek(today);
    setTasks(nextTasks);
    setOccurrences(nextOccurrences);
    await rescheduleNotifications(nextTasks, nextLanguage);
  }

  async function changeLanguage(nextLanguage) {
    setLanguageState(nextLanguage);
    await setSetting("language", nextLanguage);
    await refresh(nextLanguage);
  }

  async function changeTheme(nextTheme) {
    setThemeMode(nextTheme);
    await setSetting("theme", nextTheme);
  }

  const todayOccurrences = occurrences.filter((item) => item.date === today);
  const todayStats = completionStats(todayOccurrences);
  const dayGroups = dates
    .filter((date) => date <= today)
    .map((date) => ({ date, occurrences: occurrences.filter((item) => item.date === date) }));
  const streak = currentStreak(dayGroups);
  const recap = weeklyRecap(occurrences);

  async function toggleOccurrence(occurrence) {
    await setCompletion(occurrence.id, occurrence.status === "done" ? "pending" : "done");
    await refresh();
  }

  function openNewTask(type = "recurring") {
    setForm({ ...emptyForm, type, date: today });
    setFormOpen(true);
  }

  function openEditTask(task) {
    setForm({
      id: task.id,
      title: task.title,
      type: task.type,
      daysOfWeek: task.daysOfWeek?.length ? task.daysOfWeek : [...WEEKDAY_KEYS],
      reminderTime: task.reminderTime || "",
      leadTimeMinutes: task.leadTimeMinutes || null,
      date: task.date || today
    });
    setFormOpen(true);
  }

  async function submitTask() {
    if (!form.title.trim()) return;
    if (form.reminderTime && !/^\d{2}:\d{2}$/.test(form.reminderTime)) {
      Alert.alert(t(language, "reminder"), t(language, "timePlaceholder"));
      return;
    }
    if (form.leadTimeMinutes != null && (!Number.isInteger(form.leadTimeMinutes) || form.leadTimeMinutes < 1 || form.leadTimeMinutes > 1440)) {
      Alert.alert(t(language, "leadTime"), t(language, "leadTimeCustomHint"));
      return;
    }
    const task = {
      ...form,
      id: form.id || `${Date.now()}`,
      reminderTime: form.reminderTime || null,
      leadTimeMinutes: form.reminderTime ? form.leadTimeMinutes : null,
      daysOfWeek: form.type === "recurring" ? form.daysOfWeek : [],
      date: form.type === "oneTime" ? form.date : null,
      active: true
    };
    await saveTask(task);
    setFormOpen(false);
    await refresh();
  }

  async function removeTask(task) {
    await deleteTask(task.id);
    await refresh();
  }

  function renderHeader() {
    return (
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>{t(language, "appName")}</Text>
          <Text style={styles.subtle}>{t(language, "localOnly")}</Text>
        </View>
        <View style={styles.streakBadge}>
          <Ionicons name="flame" size={18} color={theme.primary} />
          <Text style={styles.streakText}>{streak}</Text>
        </View>
      </View>
    );
  }

  function renderToday() {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <ProgressCard stats={todayStats} label={t(language, "dailyProgress")} language={language} styles={styles} />
        <TouchableOpacity style={styles.secondaryButton} onPress={() => openNewTask("oneTime")}>
          <Ionicons name="add-circle-outline" size={20} color={theme.secondaryText} />
          <Text style={styles.secondaryButtonText}>{t(language, "addOneTimeToday")}</Text>
        </TouchableOpacity>
        {todayOccurrences.length === 0 ? (
          <Empty text={t(language, "todayEmpty")} styles={styles} theme={theme} />
        ) : (
          todayOccurrences.map((occurrence) => (
            <OccurrenceRow
              key={occurrence.id}
              occurrence={occurrence}
              language={language}
              theme={theme}
              styles={styles}
              onPress={() => toggleOccurrence(occurrence)}
            />
          ))
        )}
      </ScrollView>
    );
  }

  function renderWeek() {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        {dates.map((date) => {
          const items = occurrences.filter((occurrence) => occurrence.date === date);
          const stats = completionStats(items);
          return (
            <View key={date} style={styles.dayBlock}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>
                  {t(language, dayLabelKeys[weekdayKey(date)])} {formatShortDate(date)}
                </Text>
                <Text style={styles.subtle}>
                  {t(language, "completedOf", { completed: stats.completed, total: stats.total })}
                </Text>
              </View>
              <View style={styles.meter}>
                <View style={[styles.meterFill, { width: `${Math.round(stats.percent * 100)}%` }]} />
              </View>
              {items.map((occurrence) => (
                <OccurrenceRow
                  compact
                  key={occurrence.id}
                  occurrence={occurrence}
                  language={language}
                  theme={theme}
                  styles={styles}
                  onPress={() => toggleOccurrence(occurrence)}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    );
  }

  function renderTasks() {
    const activeTasks = tasks.filter((task) => task.active !== false);
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => openNewTask("recurring")}>
          <Ionicons name="add" size={20} color={theme.primaryText} />
          <Text style={styles.primaryButtonText}>{t(language, "addTask")}</Text>
        </TouchableOpacity>
        {activeTasks.length === 0 ? (
          <Empty text={t(language, "tasksEmpty")} styles={styles} theme={theme} />
        ) : (
          activeTasks.map((task) => (
            <TouchableOpacity key={task.id} style={styles.taskCard} onPress={() => openEditTask(task)}>
              <View style={styles.taskCardText}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.subtle}>
                  {task.type === "oneTime" ? t(language, "oneTime") : t(language, "recurring")}
                  {` - ${taskReminderLabel(task, language)}`}
                </Text>
              </View>
              <TouchableOpacity style={styles.iconButton} onPress={() => removeTask(task)}>
                <Ionicons name="trash-outline" size={19} color={theme.danger} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    );
  }

  function renderRecap() {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <ProgressCard stats={recap} label={t(language, "recap")} language={language} styles={styles} />
        {recap.total === 0 ? (
          <Empty text={t(language, "noRecap")} styles={styles} theme={theme} />
        ) : (
          <>
            <RecapList title={t(language, "bestTasks")} items={recap.bestTasks} styles={styles} />
            <RecapList title={t(language, "worstTasks")} items={recap.worstTasks} styles={styles} />
            <View style={styles.recapCard}>
              <Text style={styles.sectionTitle}>{t(language, "bestDay")}</Text>
              <DayScore day={recap.bestDay} language={language} styles={styles} />
              <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>{t(language, "worstDay")}</Text>
              <DayScore day={recap.worstDay} language={language} styles={styles} />
            </View>
            <View style={styles.recapCard}>
              <Text style={styles.sectionTitle}>{t(language, "recommendation")}</Text>
              <Text style={styles.body}>{t(language, recap.recommendation)}</Text>
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  function renderSettings() {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.recapCard}>
          <Text style={styles.sectionTitle}>{t(language, "language")}</Text>
          <View style={styles.segmented}>
            {["cs", "en"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.segment, language === item && styles.segmentActive]}
                onPress={() => changeLanguage(item)}
              >
                <Text style={[styles.segmentText, language === item && styles.segmentTextActive]}>
                  {item === "cs" ? t(language, "czech") : t(language, "english")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.recapCard}>
          <Text style={styles.sectionTitle}>{t(language, "appearance")}</Text>
          <View style={styles.segmented}>
            {["light", "dark"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.segment, themeMode === item && styles.segmentActive]}
                onPress={() => changeTheme(item)}
              >
                <Text style={[styles.segmentText, themeMode === item && styles.segmentTextActive]}>
                  {t(language, item)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }

  const screens = {
    today: renderToday,
    week: renderWeek,
    tasks: renderTasks,
    recap: renderRecap,
    settings: renderSettings
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />
      {renderHeader()}
      {screens[screen]()}
      <TabBar screen={screen} setScreen={setScreen} language={language} theme={theme} styles={styles} />
      <TaskForm
        form={form}
        language={language}
        open={formOpen}
        setForm={setForm}
        theme={theme}
        styles={styles}
        onClose={() => setFormOpen(false)}
        onSubmit={submitTask}
      />
    </SafeAreaView>
  );
}

function ProgressCard({ stats, label, language, styles }) {
  const percent = Math.round(stats.percent * 100);
  return (
    <View style={styles.progressCard}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <Text style={styles.bigNumber}>{percent}%</Text>
      <Text style={styles.subtle}>
        {t(language, "completedOf", { completed: stats.completed, total: stats.total })}
      </Text>
      <View style={styles.meterLarge}>
        <View style={[styles.meterFill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

function OccurrenceRow({ occurrence, language, theme, styles, onPress, compact = false }) {
  const done = occurrence.status === "done";
  return (
    <TouchableOpacity style={[styles.occurrenceRow, compact && styles.compactRow]} onPress={onPress}>
      <Ionicons
        name={done ? "checkmark-circle" : "ellipse-outline"}
        size={24}
        color={done ? theme.primary : theme.muted}
      />
      <View style={styles.taskCardText}>
        <Text style={[styles.taskTitle, done && styles.doneText]}>{occurrence.title}</Text>
        <Text style={styles.subtle}>{occurrence.reminderTime || t(language, "noReminder")}</Text>
      </View>
    </TouchableOpacity>
  );
}

function RecapList({ title, items, styles }) {
  if (!items.length) return null;
  return (
    <View style={styles.recapCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item.title} style={styles.recapLine}>
          <Text style={styles.body}>{item.title}</Text>
          <Text style={styles.subtle}>{Math.round(item.percent * 100)}%</Text>
        </View>
      ))}
    </View>
  );
}

function DayScore({ day, language, styles }) {
  if (!day) return <Text style={styles.subtle}>{t(language, "noRecap")}</Text>;
  return (
    <View style={styles.recapLine}>
      <Text style={styles.body}>
        {t(language, dayLabelKeys[weekdayKey(day.date)])} {formatShortDate(day.date)}
      </Text>
      <Text style={styles.subtle}>{Math.round(day.percent * 100)}%</Text>
    </View>
  );
}

function Empty({ text, styles, theme }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="calendar-outline" size={28} color={theme.muted} />
      <Text style={styles.subtle}>{text}</Text>
    </View>
  );
}

function taskReminderLabel(task, language) {
  if (!task.reminderTime) return t(language, "noReminder");
  if (!task.leadTimeMinutes) return task.reminderTime;
  return `${task.reminderTime} - ${leadTimeLabel(task.leadTimeMinutes, language)}`;
}

function leadTimeLabel(minutes, language) {
  return t(language, "leadTimeMinutes", { minutes });
}

function TaskForm({ form, language, open, setForm, theme, styles, onClose, onSubmit }) {
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [customLeadTime, setCustomLeadTime] = useState("");

  useEffect(() => {
    setCustomLeadTime(
      form.leadTimeMinutes && !leadTimePresets.includes(form.leadTimeMinutes)
        ? String(form.leadTimeMinutes)
        : ""
    );
  }, [form.id, form.leadTimeMinutes, open]);

  function toggleDay(day) {
    const selected = form.daysOfWeek.includes(day);
    setForm({
      ...form,
      daysOfWeek: selected
        ? form.daysOfWeek.filter((item) => item !== day)
        : [...form.daysOfWeek, day]
    });
  }

  return (
    <Modal animationType="slide" transparent visible={open} onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalShade}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={18}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.modalScroll}>
          <View style={styles.modal}>
            <Text style={styles.sectionTitle}>{t(language, "addTask")}</Text>
            <TextInput
              style={styles.input}
              value={form.title}
              onChangeText={(title) => setForm({ ...form, title })}
              placeholder={t(language, "taskName")}
              placeholderTextColor={theme.muted}
              returnKeyType="done"
            />
            <View style={styles.segmented}>
              {["recurring", "oneTime"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.segment, form.type === type && styles.segmentActive]}
                  onPress={() => setForm({ ...form, type })}
                >
                  <Text style={[styles.segmentText, form.type === type && styles.segmentTextActive]}>
                    {t(language, type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {form.type === "recurring" && (
              <View style={styles.daysRow}>
                {WEEKDAY_KEYS.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.dayChip, form.daysOfWeek.includes(day) && styles.dayChipActive]}
                    onPress={() => toggleDay(day)}
                  >
                    <Text style={[styles.dayChipText, form.daysOfWeek.includes(day) && styles.dayChipTextActive]}>
                      {t(language, dayLabelKeys[day])}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity style={styles.timeButton} onPress={() => setTimePickerOpen(!timePickerOpen)}>
              <View>
                <Text style={styles.timeLabel}>{t(language, "reminder")}</Text>
                <Text style={styles.timeValue}>{form.reminderTime || t(language, "noReminder")}</Text>
              </View>
              <Ionicons name={timePickerOpen ? "chevron-up" : "chevron-down"} size={20} color={theme.muted} />
            </TouchableOpacity>
            {timePickerOpen && (
              <TimePicker
                value={form.reminderTime}
                language={language}
                styles={styles}
                onClear={() => {
                  setForm({ ...form, reminderTime: "", leadTimeMinutes: null });
                  setTimePickerOpen(false);
                }}
                onSelect={(reminderTime) => {
                  setForm({ ...form, reminderTime });
                  setTimePickerOpen(false);
                }}
              />
            )}
            <LeadTimePicker
              customLeadTime={customLeadTime}
              disabled={!form.reminderTime}
              form={form}
              language={language}
              setCustomLeadTime={setCustomLeadTime}
              setForm={setForm}
              styles={styles}
              theme={theme}
            />
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
                <Text style={styles.secondaryButtonText}>{t(language, "cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
                <Ionicons name="save-outline" size={18} color={theme.primaryText} />
                <Text style={styles.primaryButtonText}>{t(language, "save")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function LeadTimePicker({ customLeadTime, disabled, form, language, setCustomLeadTime, setForm, styles, theme }) {
  function selectLeadTime(minutes) {
    setCustomLeadTime("");
    setForm({ ...form, leadTimeMinutes: form.leadTimeMinutes === minutes ? null : minutes });
  }

  function changeCustomLeadTime(value) {
    const sanitized = value.replace(/\D/g, "").slice(0, 4);
    setCustomLeadTime(sanitized);
    setForm({ ...form, leadTimeMinutes: sanitized ? Number(sanitized) : null });
  }

  return (
    <View style={[styles.leadTimePanel, disabled && styles.disabledPanel]}>
      <View>
        <Text style={styles.timeLabel}>{t(language, "leadTime")}</Text>
        <Text style={styles.leadTimeHint}>
          {disabled ? t(language, "leadTimeNeedsTaskTime") : t(language, "leadTimeHint")}
        </Text>
      </View>
      <View style={styles.leadChipRow}>
        {leadTimePresets.map((minutes) => (
          <TouchableOpacity
            key={minutes}
            disabled={disabled}
            style={[
              styles.leadChip,
              form.leadTimeMinutes === minutes && !customLeadTime && styles.leadChipActive,
              disabled && styles.disabledChip
            ]}
            onPress={() => selectLeadTime(minutes)}
          >
            <Text
              style={[
                styles.leadChipText,
                form.leadTimeMinutes === minutes && !customLeadTime && styles.leadChipTextActive
              ]}
            >
              {minutes}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={customLeadTime}
        onChangeText={changeCustomLeadTime}
        placeholder={t(language, "leadTimeCustomPlaceholder")}
        placeholderTextColor={theme.muted}
        keyboardType="number-pad"
        editable={!disabled}
      />
    </View>
  );
}

function TimePicker({ value, language, styles, onClear, onSelect }) {
  const [hour, setHour] = useState(value ? value.slice(0, 2) : "08");
  const [minute, setMinute] = useState(value ? value.slice(3, 5) : "00");
  const hours = useMemo(() => range(0, 23), []);
  const minutes = useMemo(() => range(0, 59), []);

  return (
    <View style={styles.timePicker}>
      <View style={styles.timeColumns}>
        <PickerColumn values={hours} selected={hour} onSelect={setHour} styles={styles} />
        <Text style={styles.timeColon}>:</Text>
        <PickerColumn values={minutes} selected={minute} onSelect={setMinute} styles={styles} />
      </View>
      <View style={styles.formActions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onClear}>
          <Text style={styles.secondaryButtonText}>{t(language, "noReminder")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={() => onSelect(`${hour}:${minute}`)}>
          <Text style={styles.primaryButtonText}>{t(language, "save")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PickerColumn({ values, selected, onSelect, styles }) {
  return (
    <ScrollView style={styles.pickerColumn} contentContainerStyle={styles.pickerColumnContent}>
      {values.map((value) => (
        <TouchableOpacity
          key={value}
          style={[styles.pickerItem, selected === value && styles.pickerItemActive]}
          onPress={() => onSelect(value)}
        >
          <Text style={[styles.pickerItemText, selected === value && styles.pickerItemTextActive]}>
            {value}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function range(start, end) {
  return Array.from({ length: end - start + 1 }, (_, index) => String(start + index).padStart(2, "0"));
}

function TabBar({ screen, setScreen, language, theme, styles }) {
  const tabs = [
    ["today", "today", "checkmark-done-outline"],
    ["week", "week", "calendar-outline"],
    ["tasks", "tasks", "list-outline"],
    ["recap", "recap", "stats-chart-outline"],
    ["settings", "settings", "settings-outline"]
  ];
  return (
    <View style={styles.tabBar}>
      {tabs.map(([key, label, icon]) => (
        <TouchableOpacity key={key} style={styles.tab} onPress={() => setScreen(key)}>
          <Ionicons name={icon} size={22} color={screen === key ? theme.primary : theme.muted} />
          <Text style={[styles.tabText, screen === key && styles.tabTextActive]}>{t(language, label)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: theme.background
    },
    header: {
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border
    },
    appTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: theme.text
    },
    subtle: {
      color: theme.muted,
      fontSize: 13
    },
    content: {
      padding: 16,
      gap: 12,
      paddingBottom: 110
    },
    streakBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.primarySoft
    },
    streakText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "800"
    },
    progressCard: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 16,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 8
    },
    sectionTitleSpaced: {
      marginTop: 12
    },
    bigNumber: {
      color: theme.primary,
      fontSize: 44,
      fontWeight: "900"
    },
    meterLarge: {
      marginTop: 12,
      height: 10,
      backgroundColor: theme.track,
      borderRadius: 5,
      overflow: "hidden"
    },
    meter: {
      height: 8,
      backgroundColor: theme.track,
      borderRadius: 4,
      overflow: "hidden"
    },
    meterFill: {
      height: "100%",
      backgroundColor: theme.primary
    },
    primaryButton: {
      minHeight: 46,
      borderRadius: 8,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 14
    },
    primaryButtonText: {
      color: theme.primaryText,
      fontWeight: "800"
    },
    secondaryButton: {
      minHeight: 44,
      borderRadius: 8,
      backgroundColor: theme.secondary,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
      paddingHorizontal: 14,
      flex: 1
    },
    secondaryButtonText: {
      color: theme.secondaryText,
      fontWeight: "800"
    },
    empty: {
      minHeight: 120,
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    },
    occurrenceRow: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    compactRow: {
      paddingVertical: 10,
      borderWidth: 0,
      backgroundColor: theme.nested
    },
    taskCard: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 12
    },
    taskCardText: {
      flex: 1,
      gap: 2
    },
    taskTitle: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "700"
    },
    doneText: {
      color: theme.muted,
      textDecorationLine: "line-through"
    },
    iconButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      backgroundColor: theme.dangerSoft
    },
    dayBlock: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      padding: 12,
      gap: 10
    },
    dayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    dayTitle: {
      color: theme.text,
      fontSize: 15,
      fontWeight: "800"
    },
    recapCard: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 14,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border
    },
    recapLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 12,
      paddingVertical: 6
    },
    body: {
      color: theme.text,
      fontSize: 15,
      flex: 1
    },
    modalShade: {
      flex: 1,
      backgroundColor: theme.modalShade
    },
    modalScroll: {
      flexGrow: 1,
      justifyContent: "flex-end"
    },
    modal: {
      backgroundColor: theme.elevated,
      padding: 18,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      gap: 12
    },
    input: {
      minHeight: 46,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      fontSize: 16,
      color: theme.text,
      backgroundColor: theme.surface
    },
    inputDisabled: {
      opacity: 0.45
    },
    segmented: {
      flexDirection: "row",
      backgroundColor: theme.track,
      borderRadius: 8,
      padding: 3,
      gap: 3
    },
    segment: {
      flex: 1,
      minHeight: 38,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 7
    },
    segmentActive: {
      backgroundColor: theme.surface
    },
    segmentText: {
      color: theme.muted,
      fontWeight: "700"
    },
    segmentTextActive: {
      color: theme.primary
    },
    daysRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8
    },
    dayChip: {
      minWidth: 42,
      minHeight: 34,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 17,
      backgroundColor: theme.track
    },
    dayChipActive: {
      backgroundColor: theme.primary
    },
    dayChipText: {
      color: theme.muted,
      fontWeight: "800"
    },
    dayChipTextActive: {
      color: theme.primaryText
    },
    formActions: {
      flexDirection: "row",
      gap: 10
    },
    timeButton: {
      minHeight: 54,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.inputBorder,
      borderRadius: 8,
      paddingHorizontal: 12,
      alignItems: "center",
      justifyContent: "space-between",
      flexDirection: "row",
      backgroundColor: theme.surface
    },
    timeLabel: {
      color: theme.muted,
      fontSize: 12,
      fontWeight: "700"
    },
    timeValue: {
      color: theme.text,
      fontSize: 17,
      fontWeight: "800",
      marginTop: 2
    },
    timePicker: {
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      padding: 10,
      gap: 10
    },
    leadTimePanel: {
      borderRadius: 8,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      backgroundColor: theme.nested,
      padding: 12,
      gap: 10
    },
    disabledPanel: {
      opacity: 0.62
    },
    leadTimeHint: {
      color: theme.muted,
      fontSize: 12,
      lineHeight: 17,
      marginTop: 3
    },
    leadChipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8
    },
    leadChip: {
      minWidth: 48,
      height: 36,
      borderRadius: 18,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.surface
    },
    disabledChip: {
      opacity: 0.5
    },
    leadChipActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primarySoft
    },
    leadChipText: {
      color: theme.muted,
      fontSize: 14,
      fontWeight: "800"
    },
    leadChipTextActive: {
      color: theme.primary
    },
    timeColumns: {
      height: 190,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    },
    timeColon: {
      color: theme.text,
      fontSize: 28,
      fontWeight: "900"
    },
    pickerColumn: {
      width: 92,
      maxHeight: 176
    },
    pickerColumnContent: {
      gap: 5,
      paddingVertical: 6
    },
    pickerItem: {
      height: 38,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center"
    },
    pickerItemActive: {
      backgroundColor: theme.primarySoft
    },
    pickerItemText: {
      color: theme.muted,
      fontSize: 20,
      fontWeight: "700"
    },
    pickerItemTextActive: {
      color: theme.primary,
      fontSize: 24,
      fontWeight: "900"
    },
    tabBar: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      minHeight: 72,
      backgroundColor: theme.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.border,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingTop: 8,
      paddingBottom: 10
    },
    tab: {
      flex: 1,
      alignItems: "center",
      gap: 3
    },
    tabText: {
      color: theme.muted,
      fontSize: 11,
      fontWeight: "700"
    },
    tabTextActive: {
      color: theme.primary
    }
  });
}
