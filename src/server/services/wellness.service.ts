import { getPrismaClient } from "../db";
import { getDefaultUserId } from "./user.service";

const startOfDay = (value: Date): Date =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const addDays = (value: Date, days: number): Date => {
  const next = new Date(value);
  next.setDate(value.getDate() + days);
  return next;
};

export const logWaterIntake = async (): Promise<void> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  await prisma.wellnessLog.create({
    data: {
      userId,
      type: "water_intake",
      loggedAt: new Date(),
    },
  });
};

export const getTodayWaterIntake = async (): Promise<number> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);

  const count = await prisma.wellnessLog.count({
    where: {
      userId,
      type: "water_intake",
      loggedAt: { gte: today, lt: tomorrow },
    },
  });

  return count;
};
