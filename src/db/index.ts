import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { app } from "electron";

const isDev = !app.isPackaged;
const enginePath = isDev
  ? path.join(import.meta.dirname, "../../node_modules/@prisma/engines")
  : path.join(process.resourcesPath);

// Store DB in the user data directory instead of program files (which are readonly in production)
const dbFolder = app.getPath("userData");
const dbPath = path.join(dbFolder, "local.db");

const prisma = new PrismaClient({
  log: ["info", "query", "error", "warn"],
  adapter: {
    url: `file:${dbPath}`,
  },
  engine: {
    binaryTargets: ["native", "darwin", "darwin-arm64", "windows"],
  },
  __internal: {
    engine: {
      endpoint: enginePath,
    },
  },
} as any);

export default prisma;
