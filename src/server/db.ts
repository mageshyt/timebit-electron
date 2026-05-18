import path from "node:path";
import { app } from "electron";
import { PrismaClient } from "@prisma/client";
import { inDevelopment } from "../constants";

let prisma: PrismaClient | null = null;

const getDatabaseUrl = () => {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL;
  }

  if (inDevelopment) {
    const devDbPath = path.join(process.cwd(), "dev.db");
    return `file:${devDbPath}`;
  }

  const dbPath = path.join(app.getPath("userData"), "timebit.sqlite");
  return `file:${dbPath}`;
};

const ensureClient = () => {
  if (!prisma) {
    process.env.DATABASE_URL = getDatabaseUrl();
    prisma = new PrismaClient();
  }

  return prisma;
};

export const connectDatabase = async (): Promise<PrismaClient> => {
  const client = ensureClient();
  await client.$connect();

  // SQLite connection pragmas for durability and integrity.
  // PRAGMA statements can return rows in SQLite, so use query raw.
  await client.$queryRawUnsafe("PRAGMA journal_mode = WAL;");
  await client.$queryRawUnsafe("PRAGMA foreign_keys = ON;");

  return client;
};

export const getPrismaClient = (): PrismaClient => ensureClient();

export const disconnectDatabase = async (): Promise<void> => {
  if (!prisma) {
    return;
  }

  await prisma.$disconnect();
  prisma = null;
};
