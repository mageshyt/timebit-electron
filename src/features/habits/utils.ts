import type { HabitListResponse, Habit } from "./types";

export const fetchJson = async <T,>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return (await response.json()) as T;
};

export const fetchHabits = (baseUrl: string) =>
  fetchJson<HabitListResponse>(new URL("/habits", baseUrl).toString());

export const completeHabit = (baseUrl: string, id: number) =>
  fetchJson<{ data: Habit }>(
    new URL(`/habits/${id}/complete`, baseUrl).toString(),
    { method: "POST" },
  );

export const resetHabitStreaks = (baseUrl: string) =>
  fetchJson<{ ok: boolean }>(new URL("/habits/reset", baseUrl).toString(), {
    method: "POST",
  });
