import type http from "node:http";
import { sendJson } from "../router";
import { getTaskSummary } from "../services/tasks.service";

export async function summaryRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const summary = await getTaskSummary();
  sendJson(res, 200, { tasks: summary });
}
