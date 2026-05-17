import type http from "node:http";
import { sendJson, readBody } from "../router";
import { broadcaster } from "../ws/broadcaster";

// ─── In-memory store (swap for DB layer later) ────────────────────────────────

export interface ServerTask {
  id: number;
  title: string;
  subtitle: string;
  status: "TODO" | "IN PROGRESS" | "DONE";
  priority: "High" | "Medium" | "Low";
  estimate: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

class TaskStore {
  private tasks: ServerTask[] = [];
  private nextId = 1;

  list(): ServerTask[] {
    return this.tasks;
  }

  get(id: number): ServerTask | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  create(input: Omit<ServerTask, "id" | "createdAt" | "updatedAt">): ServerTask {
    const now = new Date().toISOString();
    const task: ServerTask = { ...input, id: this.nextId++, createdAt: now, updatedAt: now };
    this.tasks.unshift(task);
    return task;
  }

  update(id: number, patch: Partial<Omit<ServerTask, "id" | "createdAt">>): ServerTask | null {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.tasks[idx] = { ...this.tasks[idx], ...patch, updatedAt: new Date().toISOString() };
    return this.tasks[idx];
  }

  delete(id: number): boolean {
    const before = this.tasks.length;
    this.tasks = this.tasks.filter((t) => t.id !== id);
    return this.tasks.length < before;
  }
}

export const taskStore = new TaskStore();

// ─── Route handlers ───────────────────────────────────────────────────────────

/** GET /tasks */
export function listTasksRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
): void {
  sendJson(res, 200, { data: taskStore.list() });
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

  const task = taskStore.create({
    title: body.title.trim(),
    subtitle: body.subtitle ?? "",
    status: body.status ?? "TODO",
    priority: body.priority ?? "Medium",
    estimate: body.estimate ?? "",
    done: body.status === "DONE",
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
  const patch = { ...body };
  if (patch.status !== undefined) {
    patch.done = patch.status === "DONE";
  }

  const updated = taskStore.update(id, patch);
  if (!updated) {
    sendJson(res, 404, { error: "Task not found" });
    return;
  }

  broadcaster.broadcast({ type: "task:updated", payload: updated });
  sendJson(res, 200, { data: updated });
}

/** DELETE /tasks/:id */
export function deleteTaskRoute(
  _req: http.IncomingMessage,
  res: http.ServerResponse,
  id: number,
): void {
  const deleted = taskStore.delete(id);
  if (!deleted) {
    sendJson(res, 404, { error: "Task not found" });
    return;
  }

  broadcaster.broadcast({ type: "task:deleted", payload: { id } });
  sendJson(res, 200, { data: { id } });
}
