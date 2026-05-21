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
  syncServerUrl: profile.syncServerUrl ?? "",
  deviceWifiSsid: profile.deviceWifiSsid ?? "",
  deviceWifiPassword: profile.deviceWifiPassword ?? "",
  focusDurationMins: profile.focusDurationMins,
  focusShortBreakMins: profile.focusShortBreakMins,
  focusLongBreakMins: profile.focusLongBreakMins,
  wellnessStandupEnabled: profile.wellnessStandupEnabled,
  wellnessHydrationEnabled: profile.wellnessHydrationEnabled,
  wellnessEyeStrainEnabled: profile.wellnessEyeStrainEnabled,
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
      syncServerUrl: z.string().optional(),
      deviceWifiSsid: z.string().optional(),
      deviceWifiPassword: z.string().optional(),
      focusDurationMins: z.number().optional(),
      focusShortBreakMins: z.number().optional(),
      focusLongBreakMins: z.number().optional(),
      wellnessStandupEnabled: z.boolean().optional(),
      wellnessHydrationEnabled: z.boolean().optional(),
      wellnessEyeStrainEnabled: z.boolean().optional(),
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
