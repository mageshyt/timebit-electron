import { os } from "@orpc/server";
import {
  getDefaultUserProfile,
  updateDefaultUserProfile,
  type UserProfileUpdateInput,
} from "@/server/services/user.service";
import z from "zod";

const normalizeProfile = (
  profile: Awaited<ReturnType<typeof getDefaultUserProfile>>
) => ({
  id: profile.id,
  name: profile.name,
  avatarUrl: profile.avatar ?? "",
  timezone: profile.timezone ?? "UTC",
  dailyGoalTasks: profile.dailyGoalTasks,
  dailyGoalHabits: profile.dailyGoalHabits,
  pomodoroWorkMins: profile.pomodoroWorkMins,
  pomodoroBreakMins: profile.pomodoroBreakMins,
  pomodoroLongBreakMins: profile.pomodoroLongBreakMins,
  syncServerUrl: profile.syncServerUrl ?? "",
  wakeTime: profile.wakeTime ?? "",
  sleepTime: profile.sleepTime ?? "",
});

export const getSettings = os.handler(async () => {
  const profile = await getDefaultUserProfile();
  return normalizeProfile(profile);
});

export const updateSettings = os
  .input(
    z.object({
      name: z.string().optional(),
      avatarUrl: z.string().optional(),
      timezone: z.string().optional(),
      dailyGoalTasks: z.number().optional(),
      dailyGoalHabits: z.number().optional(),
      pomodoroWorkMins: z.number().optional(),
      pomodoroBreakMins: z.number().optional(),
      pomodoroLongBreakMins: z.number().optional(),
      syncServerUrl: z.string().optional(),
      wakeTime: z.string().optional(),
      sleepTime: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    const { avatarUrl, ...rest } = input;
    const updateInput: UserProfileUpdateInput = { ...rest };
    if (avatarUrl !== undefined) {
      updateInput.avatar = avatarUrl;
    }
    const profile = await updateDefaultUserProfile(updateInput);
    return normalizeProfile(profile);
  });
