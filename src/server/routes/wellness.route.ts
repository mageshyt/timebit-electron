import type http from "node:http";
import { sendJson } from "../router";
import { broadcaster } from "../ws/broadcaster";
import { logWaterIntake, getTodayWaterIntake } from "../services/wellness.service";

export async function getTodayWaterIntakeRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const count = await getTodayWaterIntake();
  sendJson(res, 200, { data: count });
}

export async function logWaterIntakeRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  await logWaterIntake();
  broadcaster.broadcast({ type: "wellness:updated", payload: { type: "water_intake" } });
  sendJson(res, 201, { ok: true });
}
