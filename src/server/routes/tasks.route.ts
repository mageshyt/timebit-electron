import type http from "node:http";
import { readBody, sendJson } from "../router";
import { broadcaster } from "../ws/broadcaster";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
  type ServerTask,
  type TaskDateRange,
  type TaskPriority,
  type TaskStatus,
} from "../services/tasks.service";

const MAX_PAGE_SIZE = 100;

const parsePositiveInt = (value: string | null, fallback: number): number => {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return fallback;
  }
  return parsed;
};

const isTaskStatus = (value: string | null): value is TaskStatus =>
  value === "TODO" || value === "IN PROGRESS" || value === "DONE";

const isTaskPriority = (value: string | null): value is TaskPriority =>
  value === "High" || value === "Medium" || value === "Low";

const isTaskRange = (value: string | null): value is TaskDateRange =>
  value === "today" || value === "week" || value === "all";

// ─── Route handlers ───────────────────────────────────────────────────────────

/** GET /tasks */
export async function listTasksRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? "/tasks", "http://localhost");
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const pageSize = Math.min(
    parsePositiveInt(url.searchParams.get("pageSize"), 20),
    MAX_PAGE_SIZE,
  );
  const rangeParam = url.searchParams.get("range");
  const range = isTaskRange(rangeParam) ? rangeParam : undefined;
  const statusParam = url.searchParams.get("status");
  const priorityParam = url.searchParams.get("priority");
  const status = isTaskStatus(statusParam) ? statusParam : undefined;
  const priority = isTaskPriority(priorityParam) ? priorityParam : undefined;
  const query = url.searchParams.get("q")?.trim() || undefined;

  const result = await listTasks({
    page,
    pageSize,
    range,
    status,
    priority,
    query,
  });

  console.log(result)

  sendJson(res, 200, {
    data: result.data,
    meta: {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
}

/** POST /tasks */
export async function createTaskRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const body = await readBody<Partial<ServerTask>>(req);

  if (!body?.title?.trim()) {
    sendJson(res, 400, { error: "title is required" });
    return;
  }

  if (body.status && !isTaskStatus(body.status)) {
    sendJson(res, 400, { error: "Invalid status" });
    return;
  }

  if (body.priority && !isTaskPriority(body.priority)) {
    sendJson(res, 400, { error: "Invalid priority" });
    return;
  }

  const task = await createTask({
    title: body.title.trim(),
    subtitle: body.subtitle ?? "",
    category: body.category,
    status: body.status,
    priority: body.priority,
    estimate: body.estimate ?? "",
    done: body.done,
    scheduleAt: body.scheduleAt,
    dueTime: body.dueTime,
  });

  broadcaster.broadcast({ type: "task:created", payload: task });
  sendJson(res, 201, { data: task });
}

/** PATCH /tasks/:id */
export async function updateTaskRoute(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number,
): Promise<void> {
  const body = await readBody<Partial<ServerTask>>(req);

  if (body.title !== undefined && !body.title.trim()) {
    sendJson(res, 400, { error: "title cannot be empty" });
    return;
  }

  if (body.status && !isTaskStatus(body.status)) {
    sendJson(res, 400, { error: "Invalid status" });
    return;
  }

  if (body.priority && !isTaskPriority(body.priority)) {
    sendJson(res, 400, { error: "Invalid priority" });
    return;
  }

  const updated = await updateTask(id, {
    title: body.title?.trim(),
    subtitle: body.subtitle,
    category: body.category,
    status: body.status,
    priority: body.priority,
    estimate: body.estimate,
    done: body.done,
    scheduleAt: body.scheduleAt,
    dueTime: body.dueTime,
  });
  if (!updated) {
    sendJson(res, 404, { error: "Task not found" });
    return;
  }

  broadcaster.broadcast({ type: "task:updated", payload: updated });
  sendJson(res, 200, { data: updated });
}

/** DELETE /tasks/:id */
export async function deleteTaskRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number,
): Promise<void> {
  const deleted = await deleteTask(id);
  if (!deleted) {
    sendJson(res, 404, { error: "Task not found" });
    return;
  }

  broadcaster.broadcast({ type: "task:deleted", payload: { id } });
  sendJson(res, 200, { data: { id } });
}
