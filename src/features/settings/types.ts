export type UserSettings = {
  id: number;
  name: string;
  avatarUrl: string;
  timezone: string;
  wakeTime: string;
  sleepTime: string;
  dailyGoalTasks: number;
  dailyGoalHabits: number;
  syncServerUrl: string;
  deviceWifiSsid: string;
  deviceWifiPassword: string;
  focusDurationMins: number;
  focusShortBreakMins: number;
  focusLongBreakMins: number;
  wellnessStandupEnabled: boolean;
  wellnessHydrationEnabled: boolean;
  wellnessEyeStrainEnabled: boolean;
};
