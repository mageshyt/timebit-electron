import type { UserProfile } from "@prisma/client";
import { getPrismaClient } from "../db";

const DEFAULT_USER_NAME = "Primary User";
const DEFAULT_SYNC_SERVER_URL = "http://magesh.local:5719";

const buildDefaultProfile = () => ({
  name: DEFAULT_USER_NAME,
  avatar: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  dailyGoalTasks: 6,
  dailyGoalHabits: 4,
  pomodoroWorkMins: 25,
  pomodoroBreakMins: 5,
  pomodoroLongBreakMins: 15,
  syncServerUrl: DEFAULT_SYNC_SERVER_URL,
  wakeTime: "07:00",
  sleepTime: "23:00",
});

export type UserProfileUpdateInput = {
  name?: string;
  avatar?: string;
  timezone?: string;
  dailyGoalTasks?: number;
  dailyGoalHabits?: number;
  pomodoroWorkMins?: number;
  pomodoroBreakMins?: number;
  pomodoroLongBreakMins?: number;
  syncServerUrl?: string;
  wakeTime?: string;
  sleepTime?: string;
};

export const ensureDefaultUser = async (): Promise<UserProfile> => {
  const prisma = getPrismaClient();
  const existing = await prisma.userProfile.findFirst({
    orderBy: { id: "asc" },
  });

  if (existing) {
    return existing;
  }

  return prisma.userProfile.create({
    data: buildDefaultProfile(),
  });
};

export const getDefaultUserProfile = async (): Promise<UserProfile> =>
  ensureDefaultUser();

export const getDefaultUserId = async (): Promise<number> => {
  const user = await ensureDefaultUser();
  return user.id;
};

export const updateDefaultUserProfile = async (
  input: UserProfileUpdateInput,
): Promise<UserProfile> => {
  const prisma = getPrismaClient();
  const user = await ensureDefaultUser();
  return prisma.userProfile.update({
    where: { id: user.id },
    data: input,
  });
};
