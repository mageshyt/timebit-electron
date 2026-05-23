import type http from "node:http";
import { readBody, sendJson } from "../router";
import { broadcaster } from "../ws/broadcaster";
import {
  logWaterIntake,
  getTodayWaterIntake,
  logWellnessBreak,
} from "../services/wellness.service";

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

export async function logWellnessBreakRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const body = await readBody<{ type: unknown }>(req);
  const { type } = body;

  if (type !== "standup" && type !== "eye_strain") {
    sendJson(res, 400, { error: "Invalid type. Must be 'standup' or 'eye_strain'" });
    return;
  }

  await logWellnessBreak(type);
  broadcaster.broadcast({ type: "wellness:updated", payload: { type } });
  sendJson(res, 201, { ok: true });
}

