import type http from "node:http";
import { readBody, sendJson } from "../router";
import { broadcaster } from "../ws/broadcaster";
import {
  startSession,
  completeSession,
  abandonSession,
  getTodaySessions,
} from "../services/pomodoro.service";

function extractId(url: string, prefix: string): number | null {
  const raw = url.slice(prefix.length).split("/")[0];
  const id = Number.parseInt(raw, 10);
  return Number.isNaN(id) ? null : id;
}

/** POST /pomodoro/sessions */
export async function startSessionRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const body = await readBody<{
    type?: string;
    category?: string;
    taskId?: number | null;
    durationMins?: number;
  }>(req);

  const session = await startSession({
    type: (body.type as "focus" | "short_break" | "long_break") ?? "focus",
    category: body.category ?? "General",
    taskId: body.taskId ?? null,
    durationMins: body.durationMins ?? 25,
  });

  broadcaster.broadcast({ type: "pomodoro:started", payload: session });
  sendJson(res, 201, { data: session });
}

/** PATCH /pomodoro/sessions/:id/complete */
export async function completeSessionRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number,
): Promise<void> {
  const body = await readBody<{ actualMins?: number }>(req);
  const session = await completeSession(id, body.actualMins);

  if (!session) {
    sendJson(res, 404, { error: "Session not found" });
    return;
  }

  broadcaster.broadcast({ type: "pomodoro:completed", payload: session });
  sendJson(res, 200, { data: session });
}

/** PATCH /pomodoro/sessions/:id/abandon */
export async function abandonSessionRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number,
): Promise<void> {
  const session = await abandonSession(id);

  if (!session) {
    sendJson(res, 404, { error: "Session not found" });
    return;
  }

  broadcaster.broadcast({ type: "pomodoro:abandoned", payload: session });
  sendJson(res, 200, { data: session });
}

/** GET /pomodoro/sessions/today */
export async function getTodaySessionsRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const sessions = await getTodaySessions();
  sendJson(res, 200, { data: sessions });
}
