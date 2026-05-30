import type http from "node:http";
import { sendJson } from "../router";
import { getTaskSummary, type TaskDateRange } from "../services/tasks.service";
import { listHabits } from "../services/habits.service";
import { getTodaySessions } from "../services/pomodoro.service";

const isTaskRange = (value: string | null): value is TaskDateRange =>
  value === "today" || value === "week" || value === "all";

export async function summaryRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? "/summary", "http://localhost");
  const rangeParam = url.searchParams.get("range");
  
  // Default to today if range is omitted (e.g. from DeskBuddy request)
  const range = isTaskRange(rangeParam) ? rangeParam : "today";
  
  const [tasksSummary, habitsResult, sessions] = await Promise.all([
    getTaskSummary(range),
    listHabits(),
    getTodaySessions(),
  ]);

  const completedSessions = sessions.filter(
    (s) => s.status === "completed" && s.type === "focus"
  ).length;

  sendJson(res, 200, {
    tasks: {
      completed: tasksSummary.completed,
      total: tasksSummary.total,
      remaining: tasksSummary.remaining,
    },
    habits: {
      completed: habitsResult.summary.completed,
      total: habitsResult.summary.total,
    },
    pomodoro: {
      completed: completedSessions,
    },
  });
}
