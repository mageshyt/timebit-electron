import type { Prisma, Task as PrismaTask } from "@prisma/client";
import { getPrismaClient } from "../db";

export type TaskStatus = "TODO" | "IN PROGRESS" | "DONE";
export type TaskPriority = "High" | "Medium" | "Low";

export interface ServerTask {
  id: number;
  title: string;
  subtitle: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskListInput {
  page: number;
  pageSize: number;
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
  status?: TaskStatus;
  priority?: TaskPriority;
  estimate?: string;
  done?: boolean;
}

export interface TaskUpdateInput {
  title?: string;
  subtitle?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimate?: string;
  done?: boolean;
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
  status: task.status as TaskStatus,
  priority: task.priority as TaskPriority,
  estimate: task.estimate ?? "",
  done: task.done,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});

const buildWhere = (input: TaskListInput): Prisma.TaskWhereInput => {
  const where: Prisma.TaskWhereInput = {};

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
  const where = buildWhere(input);
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
  const status = input.status ?? "TODO";
  const done = input.done ?? status === "DONE";

  const created = await prisma.task.create({
    data: {
      title: input.title,
      subtitle: input.subtitle ?? "",
      status,
      priority: input.priority ?? "Medium",
      estimate: input.estimate ?? "",
      done,
    },
  });

  return serializeTask(created);
};

export const updateTask = async (
  id: number,
  patch: TaskUpdateInput,
): Promise<ServerTask | null> => {
  const prisma = getPrismaClient();
  const existing = await prisma.task.findUnique({ where: { id } });

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

  if (patch.done !== undefined) {
    data.done = patch.done;
  }

  const updated = await prisma.task.update({ where: { id }, data });
  return serializeTask(updated);
};

export const deleteTask = async (id: number): Promise<boolean> => {
  const prisma = getPrismaClient();
  const existing = await prisma.task.findUnique({ where: { id } });

  if (!existing) {
    return false;
  }

  await prisma.task.delete({ where: { id } });
  return true;
};

export const getTaskSummary = async (): Promise<TaskSummary> => {
  const prisma = getPrismaClient();
  const [total, completed] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { done: true } }),
  ]);

  return {
    total,
    completed,
    remaining: Math.max(0, total - completed),
  };
};
