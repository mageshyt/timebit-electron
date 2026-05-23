import type http from "node:http";
import { sendJson } from "../router";
import { getPerformanceMetrics } from "../services/analytics.service";

export async function getAnalyticsMetricsRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? "", `http://${req.headers.host}`);
  const daysParam = url.searchParams.get("days");
  const daysRange = daysParam ? Number.parseInt(daysParam, 10) : 7;

  // Validate range is valid (7, 14, 30)
  const range = [7, 14, 30].includes(daysRange) ? daysRange : 7;

  try {
    const result = await getPerformanceMetrics(range);
    sendJson(res, 200, result);
  } catch (error) {
    console.error("Error in getAnalyticsMetricsRoute:", error);
    sendJson(res, 500, { error: "Failed to load analytics metrics" });
  }
}
