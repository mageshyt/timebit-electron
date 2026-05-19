export type UserSettings = {
  id: number;
  name: string;
  avatarUrl: string;
  timezone: string;
  wakeTime: string;
  sleepTime: string;
  dailyGoalTasks: number;
  dailyGoalHabits: number;
  pomodoroWorkMins: number;
  pomodoroBreakMins: number;
  pomodoroLongBreakMins: number;
  syncServerUrl: string;
};
