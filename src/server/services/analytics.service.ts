import { getPrismaClient } from "../db";
import { getDefaultUserId } from "./user.service";

const startOfDay = (value: Date): Date =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const addDays = (value: Date, days: number): Date => {
  const next = new Date(value);
  next.setDate(value.getDate() + days);
  return next;
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  return new Date(d.setDate(diff));
};

export const getPerformanceMetrics = async (daysRange: number) => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const now = new Date();
  const today = startOfDay(now);

  // 1. Date Range Boundaries
  const currentPeriodStart = addDays(today, -daysRange + 1);
  const currentPeriodEnd = now;

  const prevPeriodStart = addDays(today, -(daysRange * 2) + 1);
  const prevPeriodEnd = addDays(today, -daysRange + 1);

  // ─── 2. TOTAL FOCUS TIME KPI ──────────────────────────────────────────────────
  const currentSessions = await prisma.pomodoroSession.findMany({
    where: {
      userId,
      status: "completed",
      startedAt: { gte: currentPeriodStart, lte: currentPeriodEnd },
    },
    select: { durationMins: true, startedAt: true, category: true },
  });

  const prevSessionsSum = await prisma.pomodoroSession.aggregate({
    where: {
      userId,
      status: "completed",
      startedAt: { gte: prevPeriodStart, lt: prevPeriodEnd },
    },
    _sum: { durationMins: true },
  });

  const currentFocusMins = currentSessions.reduce((acc, s) => acc + s.durationMins, 0);
  const prevFocusMins = prevSessionsSum._sum.durationMins ?? 0;

  const focusHours = Math.round((currentFocusMins / 60) * 10) / 10;
  const focusTimeChange =
    prevFocusMins === 0
      ? currentFocusMins > 0
        ? 100
        : 0
      : Math.round(((currentFocusMins - prevFocusMins) / prevFocusMins) * 100);

  // ─── 3. TASKS DONE KPI ────────────────────────────────────────────────────────
  const currentTasksCount = await prisma.task.count({
    where: {
      userId,
      done: true,
      completedAt: { gte: currentPeriodStart, lte: currentPeriodEnd },
    },
  });

  const prevTasksCount = await prisma.task.count({
    where: {
      userId,
      done: true,
      completedAt: { gte: prevPeriodStart, lt: prevPeriodEnd },
    },
  });

  const tasksChange =
    prevTasksCount === 0
      ? currentTasksCount > 0
        ? 100
        : 0
      : Math.round(((currentTasksCount - prevTasksCount) / prevTasksCount) * 100);

  // ─── 4. FOCUS STREAKS ─────────────────────────────────────────────────────────
  // Fetch productivity streak directly from UserProfile
  const userProfile = await prisma.userProfile.findUnique({
    where: { id: userId },
    select: { productivityStreak: true, productivityBestStreak: true },
  });
  const currentStreak = userProfile?.productivityStreak ?? 0;
  const bestStreak = userProfile?.productivityBestStreak ?? 0;

  // Query completed sessions for peak performance window calculation (without expensive sorting)
  const allCompletedSessions = await prisma.pomodoroSession.findMany({
    where: { userId, status: "completed" },
    select: { startedAt: true },
  });

  // ─── 5. WEEKLY FOCUS DISTRIBUTION CHART ──────────────────────────────────────
  // Stacked categories minutes by day of week (MON-SUN)
  const weekdayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const weeklyFocusData = weekdayNames.map((day) => ({
    day,
    deepWork: 0,
    routine: 0,
  }));

  for (const session of currentSessions) {
    const date = new Date(session.startedAt);
    let dayIdx = date.getDay() - 1; // 0 = Mon, 6 = Sun
    if (dayIdx === -1) dayIdx = 6; // Sunday

    // Map category to Deep Work vs Routine
    const cat = (session.category ?? "").toLowerCase();
    const isDeep =
      cat.includes("project") ||
      cat.includes("study") ||
      cat.includes("personal") ||
      cat.includes("deep") ||
      cat === "focus" ||
      cat === ""; // default category or empty is deep work

    if (isDeep) {
      weeklyFocusData[dayIdx].deepWork += session.durationMins;
    } else {
      weeklyFocusData[dayIdx].routine += session.durationMins;
    }
  }

  // Convert to hours (rounded) for display
  const focusDistribution = weeklyFocusData.map((d) => ({
    day: d.day,
    deepWork: Math.round((d.deepWork / 60) * 10) / 10,
    routine: Math.round((d.routine / 60) * 10) / 10,
  }));

  // ─── 6. HABIT CONSISTENCY HEATMAP GRID ────────────────────────────────────────
  // We want MON-SUN as columns (index 0..6) and 5 rows (weeks)
  const currentWeekMon = getStartOfWeek(today);
  const gridStartDate = addDays(currentWeekMon, -28); // 4 weeks ago Monday

  // Fetch total habits
  const totalHabitsCount = await prisma.habit.count({ where: { userId } });

  // Fetch all completed habit logs in the last 35 days
  const habitLogs = await prisma.habitLog.findMany({
    where: {
      habit: { userId },
      completed: true,
      date: { gte: gridStartDate, lte: now },
    },
    select: { date: true },
  });

  // Group logs by start-of-day timestamp
  const logCountsMap = new Map<number, number>();
  for (const log of habitLogs) {
    const time = startOfDay(log.date).getTime();
    logCountsMap.set(time, (logCountsMap.get(time) ?? 0) + 1);
  }

  // Calculate 5 weeks of data (5 weeks x 7 days)
  // return habitConsistency[dayOfWeekIndex] = [w1Intensity, w2Intensity, w3Intensity, w4Intensity, w5Intensity]
  const habitConsistency: number[][] = Array.from({ length: 7 }, () => []);

  for (let w = 0; w < 5; w++) {
    const weekStart = addDays(gridStartDate, w * 7);
    for (let d = 0; d < 7; d++) {
      const dayDate = addDays(weekStart, d);
      const dayTime = dayDate.getTime();
      const completedCount = logCountsMap.get(dayTime) ?? 0;
      const intensity =
        totalHabitsCount === 0
          ? 0
          : Math.min(1.0, completedCount / totalHabitsCount);

      // Append to the corresponding weekday array
      habitConsistency[d].push(intensity);
    }
  }

  // ─── 7. RECENT SESSIONS ───────────────────────────────────────────────────────
  const rawRecentSessions = await prisma.pomodoroSession.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: 5,
    include: { task: true },
  });

  const recentSessions = rawRecentSessions.map((s) => {
    // Format duration
    const hours = Math.floor(s.durationMins / 60);
    const mins = s.durationMins % 60;
    const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

    // Map outcome
    const outcome = s.status === "completed" ? "Focused" : "Interrupted";

    // Determine category display name
    const title = s.task?.title ?? s.category ?? "General Focus Session";

    return {
      id: s.id,
      title,
      category: s.category ?? "General",
      duration: durationStr,
      startedAt: s.startedAt,
      outcome,
    };
  });

  // ─── 8. PEAK PERFORMANCE WINDOW ──────────────────────────────────────────────
  // Analyze all completed sessions to find the best 2.5 hour window.
  // We can group completions by hour of the day.
  const hourCounts = Array.from({ length: 24 }, () => 0);
  for (const session of allCompletedSessions) {
    const hour = new Date(session.startedAt).getHours();
    hourCounts[hour]++;
  }

  // Find 2.5 hour sliding window with max completions
  // We can check windows of 3 hours (e.g. 9:00 - 11:30 is 2.5 hours, let's slide by index)
  let maxCompletions = 0;
  let bestStartHour = 9; // Default fallback to 9 AM

  for (let h = 0; h < 22; h++) {
    // We sum hours h, h+1, h+2 (close to 2.5 hours)
    const sum = hourCounts[h] + hourCounts[h + 1] + hourCounts[h + 2];
    if (sum > maxCompletions) {
      maxCompletions = sum;
      bestStartHour = h;
    }
  }

  // Format peak performance window strings
  const formatAmPm = (hour: number) => {
    const ampm = hour >= 12 ? "PM" : "AM";
    let h12 = hour % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:00 ${ampm}`;
  };

  const formatAmPmHalf = (hour: number) => {
    const nextHour = hour + 2;
    const ampm = nextHour >= 12 ? "PM" : "AM";
    let h12 = nextHour % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:30 ${ampm}`;
  };

  const peakWindowStart = formatAmPm(bestStartHour);
  const peakWindowEnd = formatAmPmHalf(bestStartHour);

  // Compute a recommended category from active sessions
  const categoryCounts = new Map<string, number>();
  for (const s of currentSessions) {
    const cat = s.category ?? "General";
    categoryCounts.set(cat, (categoryCounts.get(cat) ?? 0) + 1);
  }

  let recommendedCategory = "Deep Work";
  let maxCatCount = 0;
  for (const [cat, count] of categoryCounts.entries()) {
    if (count > maxCatCount) {
      maxCatCount = count;
      recommendedCategory = cat;
    }
  }

  // Completion Rate: Task scheduled vs completed count
  const allTasksScheduled = await prisma.task.count({
    where: {
      userId,
      createdAt: { gte: currentPeriodStart, lte: currentPeriodEnd },
    },
  });

  const completionRate =
    allTasksScheduled === 0
      ? 100
      : Math.round((currentTasksCount / allTasksScheduled) * 100);

  return {
    kpis: {
      focusTime: { value: focusHours, change: focusTimeChange },
      tasksDone: { value: currentTasksCount, change: tasksChange },
      streak: { value: currentStreak, best: bestStreak },
    },
    completionRate: {
      rate: completionRate,
      scheduled: allTasksScheduled,
      success: currentTasksCount,
    },
    focusDistribution,
    habitConsistency,
    recentSessions,
    peakWindow: {
      start: peakWindowStart,
      end: peakWindowEnd,
      recommendedCategory,
    },
  };
};
