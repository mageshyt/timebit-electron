import type http from "node:http";
import { sendJson } from "../router";
import { getTaskSummary, type TaskDateRange } from "../services/tasks.service";

const isTaskRange = (value: string | null): value is TaskDateRange =>
  value === "today" || value === "week" || value === "all";

export async function summaryRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? "/summary", "http://localhost");
  const rangeParam = url.searchParams.get("range");
  const range = isTaskRange(rangeParam) ? rangeParam : undefined;
  const summary = await getTaskSummary(range);
  sendJson(res, 200, { tasks: summary });
}
