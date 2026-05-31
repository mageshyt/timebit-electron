import type http from "node:http";
import { readBody, sendJson } from "../router";
import { broadcaster } from "../ws/broadcaster";
import { showSystemNotification } from "../engine/wellness-engine";
import { OLED_IMAGES } from "../assets/oled-images";
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

export async function testWellnessNotificationRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const body = await readBody<{ type: unknown }>(req);
  const { type } = body;

  if (type !== "standup" && type !== "water_intake" && type !== "eye_strain") {
    sendJson(res, 400, { error: "Invalid type. Must be 'standup', 'water_intake', or 'eye_strain'" });
    return;
  }

  if (type === "standup") {
    showSystemNotification(
      "Time to stand up and stretch! 🚶‍♂️",
      "Click to log completion",
      "standup"
    );
  } else if (type === "water_intake") {
    showSystemNotification(
      "Time for a glass of water! 💧",
      "Click to log water intake",
      "water_intake"
    );
    // broadcaster.broadcast({
    //   type: "oled:image",
    //   payload: {
    //     image: OLED_IMAGES.hydration,
    //     persistent: false,
    //     durationMs: 30000,
    //   },
    // });
  } else if (type === "eye_strain") {
    showSystemNotification(
      "Look 20 feet away for 20 seconds! 👀",
      "Click to log eye break",
      "eye_strain"
    );
  }

  sendJson(res, 200, { ok: true });
}


