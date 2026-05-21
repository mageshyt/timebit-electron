import { getPrismaClient } from "../db";
import { getDefaultUserId } from "./user.service";

export type HabitView = {
  id: number;
  title: string;
  category: string;
  resetFrequency: string;
  streak: number;
  done: boolean;
  history: string[];
};

export type HabitSummary = {
  total: number;
  completed: number;
  bestStreak: number;
};

export type HabitListResult = {
  data: HabitView[];
  summary: HabitSummary;
};

export type HabitCreateInput = {
  title: string;
  category?: string;
  resetFrequency?: string;
};

export type HabitUpdateInput = {
  id: number;
  title: string;
  category?: string;
  resetFrequency?: string;
};

const startOfDay = (value: Date): Date =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const addDays = (value: Date, days: number): Date => {
  const next = new Date(value);
  next.setDate(value.getDate() + days);
  return next;
};

const daysBetween = (a: Date, b: Date): number => {
  const diff = startOfDay(a).getTime() - startOfDay(b).getTime();
  return Math.round(diff / (24 * 60 * 60 * 1000));
};

export const listHabits = async (): Promise<HabitListResult> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: { summary: true },
    orderBy: { createdAt: "asc" },
  });

  if (habits.length === 0) {
    return {
      data: [],
      summary: { total: 0, completed: 0, bestStreak: 0 },
    };
  }

  const ids = habits.map((habit) => habit.id);
  const today = startOfDay(new Date());

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const startOfWeekDate = getStartOfWeek(today);
  const endOfWeekDate = addDays(startOfWeekDate, 7);

  const logs = await prisma.habitLog.findMany({
    where: {
      habitId: { in: ids },
      completed: true,
      date: { gte: startOfWeekDate, lt: endOfWeekDate },
    },
  });

  const logsByHabitAndDate = logs.reduce((acc, log) => {
    if (!acc[log.habitId]) acc[log.habitId] = new Set();
    acc[log.habitId].add(startOfDay(log.date).getTime());
    return acc;
  }, {} as Record<number, Set<number>>);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i).getTime());

  const bestStreak = habits.reduce((max, habit) => {
    const value = habit.summary?.longestStreak ?? 0;
    return Math.max(max, value);
  }, 0);

  const todayTime = today.getTime();
  let totalCompletedToday = 0;

  const data = habits.map((habit) => {
    const done = logsByHabitAndDate[habit.id]?.has(todayTime) ?? false;
    if (done) totalCompletedToday++;
    return {
      id: habit.id,
      title: habit.title,
      category: habit.category ?? "",
      resetFrequency: habit.resetFrequency ?? "",
      streak: habit.summary?.currentStreak ?? 0,
      done,
      history: weekDays.map(time => {
        if (time > todayTime) return "empty";
        return logsByHabitAndDate[habit.id]?.has(time) ? "optimized" : "missed";
      }),
    };
  });

  return {
    data,
    summary: {
      total: habits.length,
      completed: totalCompletedToday,
      bestStreak,
    },
  };
};

export const createHabit = async (input: HabitCreateInput): Promise<HabitView> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const habit = await prisma.habit.create({
    data: {
      title: input.title,
      category: input.category ?? "",
      resetFrequency: input.resetFrequency ?? "",
      userId,
    },
  });

  return {
    id: habit.id,
    title: habit.title,
    category: habit.category ?? "",
    resetFrequency: habit.resetFrequency ?? "",
    streak: 0,
    done: false,
    history: Array(7).fill("missed"),
  };
};

export const updateHabit = async (input: HabitUpdateInput): Promise<HabitView | null> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const existing = await prisma.habit.findFirst({
    where: { id: input.id, userId },
    include: { summary: true },
  });

  if (!existing) {
    return null;
  }

  const updated = await prisma.habit.update({
    where: { id: existing.id },
    data: {
      title: input.title,
      category: input.category ?? "",
      resetFrequency: input.resetFrequency ?? "",
    },
  });

  return {
    id: updated.id,
    title: updated.title,
    category: updated.category ?? "",
    resetFrequency: updated.resetFrequency ?? "",
    streak: existing.summary?.currentStreak ?? 0,
    done: false,
    history: Array(7).fill("missed"),
  };
};

export const completeHabit = async (id: number): Promise<HabitView | null> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const habit = await prisma.habit.findFirst({ where: { id, userId }, include: { summary: true } });

  if (!habit) {
    return null;
  }

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  const existingLog = await prisma.habitLog.findFirst({
    where: {
      habitId: id,
      date: { gte: today, lt: tomorrow },
    },
  });

  if (!existingLog) {
    await prisma.habitLog.create({
      data: {
        habitId: id,
        date: today,
        completed: true,
      },
    });
  } else if (!existingLog.completed) {
    await prisma.habitLog.update({
      where: { id: existingLog.id },
      data: { completed: true },
    });
  }

  const previousLog = await prisma.habitLog.findFirst({
    where: {
      habitId: id,
      completed: true,
      date: { lt: today },
    },
    orderBy: { date: "desc" },
  });

  const previousSummary = habit.summary;
  let currentStreak = previousSummary?.currentStreak ?? 0;
  let longestStreak = previousSummary?.longestStreak ?? 0;

  if (!existingLog || !existingLog.completed) {
    const continued =
      previousLog && daysBetween(today, previousLog.date) == 1;
    currentStreak = continued ? currentStreak + 1 : 1;
    longestStreak = Math.max(longestStreak, currentStreak);

    await prisma.habitSummary.upsert({
      where: { habitId: id },
      update: {
        currentStreak,
        longestStreak,
        userId,
      },
      create: {
        habitId: id,
        currentStreak,
        longestStreak,
        userId,
      },
    });
  }

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const startOfWeekDate = getStartOfWeek(today);
  const endOfWeekDate = addDays(startOfWeekDate, 7);

  const recentLogs = await prisma.habitLog.findMany({
    where: {
      habitId: id,
      completed: true,
      date: { gte: startOfWeekDate, lt: endOfWeekDate },
    },
  });
  
  const completedTimes = new Set(recentLogs.map(l => startOfDay(l.date).getTime()));
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i).getTime());

  const isDoneToday = completedTimes.has(today.getTime());

  return {
    id: habit.id,
    title: habit.title,
    category: habit.category ?? "",
    resetFrequency: habit.resetFrequency ?? "",
    streak: currentStreak,
    done: isDoneToday,
    history: weekDays.map(time => {
      if (time > today.getTime()) return "empty";
      return completedTimes.has(time) ? "optimized" : "missed";
    }),
  };
};

/**
 * Toggle today's completion state for a habit.
 * If already done → mark incomplete. If incomplete → mark complete (same as completeHabit).
 * Returns { done: boolean } indicating the NEW state.
 */
export const toggleHabitLog = async (id: number): Promise<{ id: number; done: boolean } | null> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const habit = await prisma.habit.findFirst({ where: { id, userId } });
  if (!habit) return null;

  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  const existingLog = await prisma.habitLog.findFirst({
    where: { habitId: id, date: { gte: today, lt: tomorrow } },
  });

  let newDone: boolean;

  if (!existingLog) {
    // No log yet → create as completed
    await prisma.habitLog.create({ data: { habitId: id, date: today, completed: true } });
    newDone = true;
  } else {
    // Flip existing log
    newDone = !existingLog.completed;
    await prisma.habitLog.update({
      where: { id: existingLog.id },
      data: { completed: newDone },
    });
  }

  return { id, done: newDone };
};

export const resetHabitStreaks = async (): Promise<void> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const habits = await prisma.habit.findMany({ where: { userId }, select: { id: true } });
  const habitIds = habits.map((habit) => habit.id);

  if (habitIds.length === 0) {
    return;
  }

  await prisma.habitSummary.updateMany({
    where: { habitId: { in: habitIds } },
    data: { currentStreak: 0, longestStreak: 0 },
  });

  await prisma.habitLog.deleteMany({
    where: { habitId: { in: habitIds } },
  });
};

export const deleteHabit = async (id: number): Promise<void> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  await prisma.habit.deleteMany({
    where: { id, userId },
  });
};
