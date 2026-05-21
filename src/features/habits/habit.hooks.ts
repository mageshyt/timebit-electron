import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSyncServerUrl } from "@/state/sync-status";
import { fetchHabits, completeHabit, resetHabitStreaks, fetchJson } from "./utils";
import type { Habit } from "./types";
import { ipc } from "@/ipc/manager";

export function useHabitActions() {
  const syncServerUrl = useMemo(() => getSyncServerUrl(), []);
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ["habits", syncServerUrl],
    queryFn: () => fetchHabits(syncServerUrl),
  });

  const habits = listQuery.data?.data ?? [];
  const summary = listQuery.data?.summary ?? { total: 0, completed: 0, bestStreak: 0 };

  const invalidateHabits = () => {
    queryClient.invalidateQueries({ queryKey: ["habits"] });
  };

  const createHabitMutation = useMutation({
    mutationFn: (form: { title: string; category?: string; resetFrequency?: string }) =>
      ipc.client.habits.createHabit(form),
    onSuccess: () => invalidateHabits(),
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (id: number) =>
      ipc.client.habits.deleteHabit(id),
    onSuccess: () => invalidateHabits(),
  });

  const updateHabitMutation = useMutation({
    mutationFn: (form: { id: number; title: string; category?: string; resetFrequency?: string }) =>
      ipc.client.habits.updateHabit(form),
    onSuccess: () => invalidateHabits(),
  });

  const completeHabitMutation = useMutation({
    mutationFn: (id: number) => completeHabit(syncServerUrl, id),
    onSuccess: () => invalidateHabits(),
  });

  return {
    habits,
    summary,
    isLoading: listQuery.isLoading,
    createHabit: (form: { title: string; category?: string; resetFrequency?: string }) =>
      createHabitMutation.mutate(form),
    deleteHabit: (id: number) => deleteHabitMutation.mutate(id),
    updateHabit: (form: { id: number; title: string; category?: string; resetFrequency?: string }) =>
      updateHabitMutation.mutate(form),
    toggleHabit: (id: number) => completeHabitMutation.mutate(id),
  };
}

export function useWellnessActions() {
  const syncServerUrl = useMemo(() => getSyncServerUrl(), []);
  const queryClient = useQueryClient();

  const waterIntakeQuery = useQuery({
    queryKey: ["wellness", "water", syncServerUrl],
    queryFn: () => fetchJson<{ data: number }>(`${syncServerUrl}/wellness/water/today`),
  });

  const waterIntake = waterIntakeQuery.data?.data ?? 0;

  const logWaterMutation = useMutation({
    mutationFn: () =>
      fetchJson<{ ok: boolean }>(`${syncServerUrl}/wellness/water`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wellness", "water"] });
    },
  });

  return {
    waterIntake,
    isLoading: waterIntakeQuery.isLoading,
    logWater: () => logWaterMutation.mutate(),
  };
}
