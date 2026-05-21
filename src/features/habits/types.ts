export type Habit = {
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

export type HabitListResponse = {
  data: Habit[];
  summary: HabitSummary;
};
