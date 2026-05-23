import type { PomodoroSession as PrismaSession } from "@prisma/client";
import { getPrismaClient } from "../db";
import { getDefaultUserId, updateProductivityStreak } from "./user.service";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionStatus = "active" | "completed" | "abandoned";
export type SessionType = "focus" | "short_break" | "long_break";

export const SESSION_CATEGORIES = [
  "General",
  "Project Work",
  "Studies",
  "Admin",
  "Personal",
] as const;

export type SessionCategory = (typeof SESSION_CATEGORIES)[number];

export interface ServerSession {
  id: number;
  taskId: number | null;
  userId: number | null;
  type: SessionType;
  category: string;
  durationMins: number;
  status: SessionStatus;
  startedAt: string;
  endedAt: string | null;
}

export interface StartSessionInput {
  type?: SessionType;
  category?: string;
  taskId?: number | null;
  durationMins?: number;
}

// ─── Serializer ───────────────────────────────────────────────────────────────

const serialize = (s: PrismaSession): ServerSession => ({
  id: s.id,
  taskId: s.taskId,
  userId: s.userId,
  type: s.type as SessionType,
  category: s.category ?? "General",
  durationMins: s.durationMins,
  status: s.status as SessionStatus,
  startedAt: s.startedAt.toISOString(),
  endedAt: s.endedAt?.toISOString() ?? null,
});

// ─── Service functions ────────────────────────────────────────────────────────

/** Create a new active session record at the moment Start is pressed. */
export const startSession = async (
  input: StartSessionInput,
): Promise<ServerSession> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const created = await prisma.pomodoroSession.create({
    data: {
      userId,
      taskId: input.taskId ?? null,
      type: input.type ?? "focus",
      category: input.category ?? "General",
      durationMins: input.durationMins ?? 25,
      status: "active",
      startedAt: new Date(),
    },
  });

  return serialize(created);
};

/** Mark a session as completed and record endedAt + actual durationMins. */
export const completeSession = async (
  id: number,
  actualMins?: number,
): Promise<ServerSession | null> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const existing = await prisma.pomodoroSession.findFirst({
    where: { id, userId },
  });
  if (!existing) return null;

  const endedAt = new Date();
  const durationMins =
    actualMins ??
    Math.round((endedAt.getTime() - existing.startedAt.getTime()) / 60000);

  const updated = await prisma.pomodoroSession.update({
    where: { id },
    data: { status: "completed", endedAt, durationMins: Math.max(1, durationMins) },
  });

  if (existing.status !== "completed") {
    await updateProductivityStreak();
  }

  return serialize(updated);
};

/** Mark a session as abandoned (user hit Stop before finishing). */
export const abandonSession = async (
  id: number,
): Promise<ServerSession | null> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const existing = await prisma.pomodoroSession.findFirst({
    where: { id, userId },
  });
  if (!existing) return null;

  const endedAt = new Date();
  const durationMins = Math.round(
    (endedAt.getTime() - existing.startedAt.getTime()) / 60000,
  );

  const updated = await prisma.pomodoroSession.update({
    where: { id },
    data: { status: "abandoned", endedAt, durationMins: Math.max(0, durationMins) },
  });

  return serialize(updated);
};

/** Return all sessions started today for the current user. */
export const getTodaySessions = async (): Promise<ServerSession[]> => {
  const prisma = getPrismaClient();
  const userId = await getDefaultUserId();

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const rows = await prisma.pomodoroSession.findMany({
    where: { userId, startedAt: { gte: start, lt: end } },
    orderBy: { startedAt: "desc" },
  });

  return rows.map(serialize);
};
