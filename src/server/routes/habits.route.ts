import type http from "node:http";
import { sendJson } from "../router";
import { broadcaster } from "../ws/broadcaster";
import {
  completeHabit,
  listHabits,
  resetHabitStreaks,
  toggleHabitLog,
} from "../services/habits.service";

export async function listHabitsRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const result = await listHabits();
  sendJson(res, 200, result);
}

/** POST /habits/:id/toggle — flip today's done state */
export async function toggleHabitRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number,
): Promise<void> {
  const result = await toggleHabitLog(id);
  if (!result) {
    sendJson(res, 404, { error: "Habit not found" });
    return;
  }

  broadcaster.broadcast({ type: "habit:updated", payload: result });
  sendJson(res, 200, { data: result });
}

/** POST /habits/:id/complete — mark done (one-way) */
export async function completeHabitRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number,
): Promise<void> {
  const habit = await completeHabit(id);
  if (!habit) {
    sendJson(res, 404, { error: "Habit not found" });
    return;
  }

  broadcaster.broadcast({ type: "habit:updated", payload: habit });
  sendJson(res, 200, { data: habit });
}

export async function resetHabitStreaksRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  await resetHabitStreaks();
  broadcaster.broadcast({ type: "habit:updated", payload: { reset: true } });
  sendJson(res, 200, { ok: true });
}
