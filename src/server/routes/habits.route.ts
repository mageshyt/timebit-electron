import type http from "node:http";
import { readBody, sendJson } from "../router";
import { broadcaster } from "../ws/broadcaster";
import { completeHabit, listHabits, resetHabitStreaks } from "../services/habits.service";

export async function listHabitsRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const result = await listHabits();
  sendJson(res, 200, result);
}



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

