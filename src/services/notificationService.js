import * as Notifications from "expo-notifications";
import { t } from "../i18n/translations.js";
import { taskNotificationIntents, weeklyRecapIntent } from "../core/notifications.js";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

export async function ensureNotificationPermission() {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted || existing.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED) {
    return true;
  }
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED;
}

export async function rescheduleNotifications(tasks, language) {
  const allowed = await ensureNotificationPermission();
  if (!allowed) return false;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const taskIntents = taskNotificationIntents(tasks);
  for (const intent of taskIntents) {
    const trigger = dateTimeToTrigger(intent.date, intent.time);
    if (!trigger) continue;
    await Notifications.scheduleNotificationAsync({
      identifier: intent.identifier,
      content: {
        title: intent.kind === "lead"
          ? t(language, "notificationLeadTitle", { minutes: intent.leadTimeMinutes })
          : t(language, "notificationTaskTitle"),
        body: intent.kind === "lead"
          ? t(language, "notificationLeadBody", { title: intent.title, minutes: intent.leadTimeMinutes })
          : t(language, "notificationTaskBody", { title: intent.title }),
        data: { occurrenceId: intent.occurrenceId, kind: intent.kind }
      },
      trigger
    });
  }

  const recapIntent = weeklyRecapIntent();
  const [hour, minute] = recapIntent.time.split(":").map(Number);
  await Notifications.scheduleNotificationAsync({
    identifier: recapIntent.identifier,
    content: {
      title: t(language, "notificationRecapTitle"),
      body: t(language, "notificationRecapBody"),
      data: { screen: "recap" }
    },
    trigger: {
      weekday: recapIntent.weekday,
      hour,
      minute,
      repeats: true
    }
  });

  return true;
}

function dateTimeToTrigger(dateISO, time) {
  const [year, month, day] = dateISO.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  const date = new Date(year, month - 1, day, hour, minute, 0);
  if (date.getTime() <= Date.now()) return null;
  return date;
}
