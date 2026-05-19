import type { Prisma, Task as PrismaTask } from "@prisma/client";
import { getPrismaClient } from "../db";
import { getDefaultUserId } from "./user.service";

export type TaskStatus = "TODO" | "IN PROGRESS" | "DONE";
export type TaskPriority = "High" | "Medium" | "Low";
export type TaskDateRange = "today" | "week" | "all";

export interface ServerTask {
  id: number;
  title: string;
  subtitle: string;
  category: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  estimate: string;
  done: boolean;
  scheduleAt: string;
  completedAt: string | null;
  dueTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListInput {
  page: number;
  pageSize: number;
  range?: TaskDateRange;
  status?: TaskStatus;
  priority?: TaskPriority;
  query?: string;
}

export interface TaskListResult {
  data: ServerTask[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TaskCreateInput {
  title: string;
  subtitle?: string;
  category?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimate?: string;
  done?: boolean;
  scheduleAt?: string;
  dueTime?: string;
}

export interface TaskUpdateInput {
  title?: string;
  subtitle?: string;
  category?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimate?: string;
  done?: boolean;
  scheduleAt?: string;
  dueTime?: string;
}

export interface TaskSummary {
  total: number;
  completed: number;
  remaining: number;
}

const serializeTask = (task: PrismaTask): ServerTask => ({
  id: task.id,
  title: task.title,
  subtitle: task.subtitle ?? "",
  category: task.category,
  status: task.status as TaskStatus,
  priority: task.priority as TaskPriority,
  estimate: task.estimate ?? "",
  done: task.done,
  scheduleAt: task.scheduleAt.toISOString(),
  completedAt: task.completedAt?.toISOString() ?? null,
  dueTime: task.dueTime?.toISOString() ?? null,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});

const startOfDay = (value: Date): Date =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const addDays = (value: Date, days: number): Date => {
  const next = new Date(value);
  next.setDate(value.getDate() + days);
  return next;
};

const buildRangeWhere = (range?: TaskDateRange): Prisma.TaskWhereInput => {
  if (!range || range === "all") {
    return {};
  }

  const now = new Date();
  if (range === "today") {
    const start = startOfDay(now);
    const end = addDays(start, 1);
    return { createdAt: { gte: start, lt: end } };
  }

  const start = startOfDay(now);
  const day = start.getDay();
  const offset = (day + 6) % 7;
  start.setDate(start.getDate() - offset);
  const end = addDays(start, 7);
  return { createdAt: { gte: start, lt: end } };
};

const buildWhere = (
  input: TaskListInput,
  userId: number,
): Prisma.TaskWhereInput => {
  const where: Prisma.TaskWhereInput = {
    ...buildRangeWhere(input.range),
    userId,
  };

  if (input.status) {
    where.status = input.status;
  }

  if (input.priority) {
    where.priority = input.priority;
  }

  const query = input.query?.trim();
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { subtitle: { contains: query } },
    ];
  }

  return where;
};

export const listTasks = async (input: TaskListInput): Promise<TaskListResult> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const where = buildWhere(input, userId);
  const skip = (input.page - 1) * input.pageSize;

  const [total, rows] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: input.pageSize,
    }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / input.pageSize);

  return {
    data: rows.map(serializeTask),
    page: input.page,
    pageSize: input.pageSize,
    total,
    totalPages,
  };
};

export const createTask = async (input: TaskCreateInput): Promise<ServerTask> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const status = input.status ?? "TODO";
  const done = input.done ?? status === "DONE";
  console.log("Creating task with input:", input, "Computed status:", status, "done:", done);
  const created = await prisma.task.create({
    data: {
      title: input.title,
      subtitle: input.subtitle ?? "",
      category: input.category,
      status,
      priority: input.priority ?? "Medium",
      estimate: input.estimate ?? "",
      done,
      scheduleAt: input.scheduleAt ? new Date(input.scheduleAt) : new Date(),
      dueTime: input.dueTime ? new Date(input.dueTime) : null,
      completedAt: done ? new Date() : null,
      userId,
    },
  });

  return serializeTask(created);
};

export const updateTask = async (
  id: number,
  patch: TaskUpdateInput,
): Promise<ServerTask | null> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const existing = await prisma.task.findFirst({ where: { id, userId } });

  if (!existing) {
    return null;
  }

  const data: Prisma.TaskUpdateInput = {};

  if (patch.title !== undefined) {
    data.title = patch.title;
  }

  if (patch.subtitle !== undefined) {
    data.subtitle = patch.subtitle;
  }

  if (patch.category !== undefined) {
    data.category = patch.category;
  }

  if (patch.status !== undefined) {
    data.status = patch.status;
    if (patch.done === undefined) {
      data.done = patch.status === "DONE";
    }
  }

  if (patch.priority !== undefined) {
    data.priority = patch.priority;
  }

  if (patch.estimate !== undefined) {
    data.estimate = patch.estimate;
  }

  if (patch.scheduleAt !== undefined) {
    data.scheduleAt = patch.scheduleAt ? new Date(patch.scheduleAt) : new Date();
  }

  if (patch.dueTime !== undefined) {
    data.dueTime = patch.dueTime ? new Date(patch.dueTime) : null;
  }

  let finalDone = existing.done;
  if (patch.done !== undefined) {
    data.done = patch.done;
    finalDone = patch.done;
  } else if (data.done !== undefined) {
    finalDone = data.done as boolean;
  }

  if (finalDone !== existing.done) {
    data.completedAt = finalDone ? new Date() : null;
  }

  const updated = await prisma.task.update({ where: { id }, data });
  return serializeTask(updated);
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const existing = await prisma.task.findFirst({ where: { id, userId } });

  if (!existing) {
    return false;
  }

  await prisma.task.delete({ where: { id } });
  return true;
};

export const getTaskSummary = async (
  range?: TaskDateRange,
): Promise<TaskSummary> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();
  const baseWhere = { ...buildRangeWhere(range), userId };
  const [total, completed] = await Promise.all([
    prisma.task.count({ where: baseWhere }),
    prisma.task.count({ where: { ...baseWhere, done: true } }),
  ]);

  return {
    total,
    completed,
    remaining: Math.max(0, total - completed),
  };
};
