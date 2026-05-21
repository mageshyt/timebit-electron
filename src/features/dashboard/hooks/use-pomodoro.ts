import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE = "http://localhost:5719";

export interface PomodoroSession {
  id: number;
  taskId: number | null;
  userId: number | null;
  type: "focus" | "short_break" | "long_break";
  category: string;
  durationMins: number;
  status: "active" | "completed" | "abandoned";
  startedAt: string;
  endedAt: string | null;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const POMODORO_KEYS = {
  today: ["pomodoro", "today"] as const,
};

export function useTodaySessions() {
  return useQuery<PomodoroSession[]>({
    queryKey: POMODORO_KEYS.today,
    queryFn: async () => {
      const res = await fetch(`${BASE}/pomodoro/sessions/today`);
      const json = (await res.json()) as { data: PomodoroSession[] };
      return json.data;
    },
    refetchInterval: 30_000, // refresh every 30s
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useStartSession() {
  const qc = useQueryClient();
  return useMutation<
    PomodoroSession,
    Error,
    { type?: string; category?: string; taskId?: number | null; durationMins?: number }
  >({
    mutationFn: async (body) => {
      const res = await fetch(`${BASE}/pomodoro/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { data: PomodoroSession };
      return json.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: POMODORO_KEYS.today });
    },
  });
}

export function useCompleteSession() {
  const qc = useQueryClient();
  return useMutation<
    PomodoroSession,
    Error,
    { id: number; actualMins?: number }
  >({
    mutationFn: async ({ id, actualMins }) => {
      const res = await fetch(`${BASE}/pomodoro/sessions/${id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actualMins }),
      });
      const json = (await res.json()) as { data: PomodoroSession };
      return json.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: POMODORO_KEYS.today });
    },
  });
}

export function useAbandonSession() {
  const qc = useQueryClient();
  return useMutation<PomodoroSession, Error, { id: number }>({
    mutationFn: async ({ id }) => {
      const res = await fetch(`${BASE}/pomodoro/sessions/${id}/abandon`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = (await res.json()) as { data: PomodoroSession };
      return json.data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: POMODORO_KEYS.today });
    },
  });
}
