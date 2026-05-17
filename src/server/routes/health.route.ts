import type http from "node:http";
import { sendJson } from "../router";

export function healthRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  sendJson(res, 200, { status: "ok", ts: Date.now() });
}
