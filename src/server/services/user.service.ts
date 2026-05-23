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
  syncServerUrl: DEFAULT_SYNC_SERVER_URL,
  deviceWifiSsid: "",
  deviceWifiPassword: "",
  focusDurationMins: 25,
  focusShortBreakMins: 5,
  focusLongBreakMins: 15,
  wellnessStandupEnabled: true,
  wellnessHydrationEnabled: true,
  wellnessEyeStrainEnabled: true,
  wakeTime: "07:00",
  sleepTime: "23:00",
});

export type UserProfileUpdateInput = {
  name?: string;
  avatar?: string;
  timezone?: string;
  dailyGoalTasks?: number;
  dailyGoalHabits?: number;
  syncServerUrl?: string;
  deviceWifiSsid?: string;
  deviceWifiPassword?: string;
  focusDurationMins?: number;
  focusShortBreakMins?: number;
  focusLongBreakMins?: number;
  wellnessStandupEnabled?: boolean;
  wellnessHydrationEnabled?: boolean;
  wellnessEyeStrainEnabled?: boolean;
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

export const updateProductivityStreak = async (): Promise<void> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const user = await prisma.userProfile.findUnique({
    where: { id: userId },
    select: { productivityStreak: true, productivityBestStreak: true, streakLastActive: true },
  });

  if (!user) return;

  const now = new Date();
  const lastActive = user.streakLastActive;

  if (!lastActive) {
    // First time activity -> start streak at 1
    await prisma.userProfile.update({
      where: { id: userId },
      data: {
        productivityStreak: 1,
        productivityBestStreak: Math.max(user.productivityBestStreak, 1),
        streakLastActive: now,
      },
    });
    return;
  }

  // Calculate day difference using calendar dates in local time
  const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d2 = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  const diffTime = d1.getTime() - d2.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Same day -> do nothing
    return;
  }

  if (diffDays === 1) {
    // Next day -> increment streak
    const newStreak = user.productivityStreak + 1;
    await prisma.userProfile.update({
      where: { id: userId },
      data: {
        productivityStreak: newStreak,
        productivityBestStreak: Math.max(user.productivityBestStreak, newStreak),
        streakLastActive: now,
      },
    });
  } else {
    // Skipped day -> reset streak to 1
    await prisma.userProfile.update({
      where: { id: userId },
      data: {
        productivityStreak: 1,
        productivityBestStreak: Math.max(user.productivityBestStreak, 1),
        streakLastActive: now,
      },
    });
  }
};
