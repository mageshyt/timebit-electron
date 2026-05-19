import { getPrismaClient } from "../db";
import { getDefaultUserId } from "./user.service";

export type HabitView = {
  id: number;
  title: string;
  category: string;
  resetFrequency: string;
  streak: number;
  done: boolean;
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
  const tomorrow = addDays(today, 1);

  const logs = await prisma.habitLog.findMany({
    where: {
      habitId: { in: ids },
      completed: true,
      date: { gte: today, lt: tomorrow },
    },
  });

  const completedIds = new Set(logs.map((log) => log.habitId));
  const bestStreak = habits.reduce((max, habit) => {
    const value = habit.summary?.longestStreak ?? 0;
    return Math.max(max, value);
  }, 0);

  return {
    data: habits.map((habit) => ({
      id: habit.id,
      title: habit.title,
      category: habit.category ?? "",
      resetFrequency: habit.resetFrequency ?? "",
      streak: habit.summary?.currentStreak ?? 0,
      done: completedIds.has(habit.id),
    })),
    summary: {
      total: habits.length,
      completed: completedIds.size,
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

  return {
    id: habit.id,
    title: habit.title,
    category: habit.category ?? "",
    resetFrequency: habit.resetFrequency ?? "",
    streak: currentStreak,
    done: true,
  };
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
