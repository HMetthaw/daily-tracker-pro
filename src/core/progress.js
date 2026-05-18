export const STREAK_THRESHOLD = 0.8;

export function completionStats(occurrences) {
  const countable = occurrences.filter((item) => item.status !== "skipped");
  const total = countable.length;
  const completed = countable.filter((item) => item.status === "done").length;
  const percent = total === 0 ? 0 : completed / total;
  return { completed, total, percent };
}

export function isStreakDay(occurrences, threshold = STREAK_THRESHOLD) {
  const stats = completionStats(occurrences);
  return stats.total > 0 && stats.percent >= threshold;
}

export function currentStreak(dayGroups, threshold = STREAK_THRESHOLD) {
  let streak = 0;
  for (const day of [...dayGroups].reverse()) {
    if (!isStreakDay(day.occurrences, threshold)) break;
    streak += 1;
  }
  return streak;
}

export function weeklyRecap(occurrences, threshold = STREAK_THRESHOLD) {
  const stats = completionStats(occurrences);
  const byTask = groupBy(occurrences.filter((item) => item.status !== "skipped"), "taskId");
  const taskScores = Object.values(byTask)
    .map((items) => ({
      title: items[0]?.title || "",
      completed: items.filter((item) => item.status === "done").length,
      total: items.length,
      percent: items.length ? items.filter((item) => item.status === "done").length / items.length : 0
    }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.percent - a.percent || b.total - a.total);

  const byDate = groupBy(occurrences, "date");
  const dayScores = Object.entries(byDate)
    .map(([date, items]) => ({ date, ...completionStats(items) }))
    .filter((item) => item.total > 0)
    .sort((a, b) => b.percent - a.percent || b.completed - a.completed);

  return {
    ...stats,
    streakQualified: stats.percent >= threshold,
    bestTasks: taskScores.filter((item) => item.percent >= threshold).slice(0, 3),
    worstTasks: [...taskScores].sort((a, b) => a.percent - b.percent || b.total - a.total).slice(0, 3),
    bestDay: dayScores[0] || null,
    worstDay: dayScores.length ? dayScores[dayScores.length - 1] : null,
    recommendation: buildRecommendation(stats, taskScores)
  };
}

function buildRecommendation(stats, taskScores) {
  if (stats.total === 0) return "noTasks";
  if (stats.percent >= 0.9) return "excellent";
  const weakest = [...taskScores].sort((a, b) => a.percent - b.percent)[0];
  if (weakest && weakest.percent < STREAK_THRESHOLD) return "focusWeakTask";
  return "steady";
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key];
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
}
