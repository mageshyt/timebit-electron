import type http from "node:http";
import { sendJson } from "../router";
import { taskStore } from "./tasks.route";

export function summaryRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  const tasks = taskStore.list();
  sendJson(res, 200, {
    tasks: {
      total: tasks.length,
      completed: tasks.filter((t) => t.done).length,
      remaining: tasks.filter((t) => !t.done).length,
    },
  });
}
