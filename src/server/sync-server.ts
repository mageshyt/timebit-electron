import http from "node:http";
import Bonjour from "bonjour";
import { WebSocketServer } from "ws";

type SyncServerOptions = {
  port: number;
};

type SyncEvent = {
  type: string;
  payload?: unknown;
};

type BootstrapState = {
  tasks: unknown[];
  habits: unknown[];
  pomodoro: Record<string, unknown>;
  settings: Record<string, unknown>;
};

type SummaryResponse = {
  tasks: { completed: number; total: number };
  habits: { completed: number; total: number };
};

const defaultBootstrapState: BootstrapState = {
  tasks: [],
  habits: [],
  pomodoro: {},
  settings: {},
};

const summaryFromBootstrap = (state: BootstrapState): SummaryResponse => {
  const tasksTotal = state.tasks.length;
  const habitsTotal = state.habits.length;
  return {
    tasks: { completed: 0, total: tasksTotal },
    habits: { completed: 0, total: habitsTotal },
  };
};

const sendJson = (res: http.ServerResponse, status: number, body: unknown) => {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
  });
  res.end(json);
};

export const startSyncServer = ({ port }: SyncServerOptions) => {
  const bonjour = Bonjour();
  const server = http.createServer((req, res) => {
    if (!req.url || !req.method) {
      sendJson(res, 400, { error: "Bad request" });
      return;
    }

    if (req.method === "GET" && req.url === "/health") {
      sendJson(res, 200, { status: "ok" });
      return;
    }

    if (req.method === "GET" && req.url === "/bootstrap") {
      sendJson(res, 200, defaultBootstrapState);
      return;
    }

    if (req.method === "GET" && req.url === "/summary") {
      sendJson(res, 200, summaryFromBootstrap(defaultBootstrapState));
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  });

  const wss = new WebSocketServer({ server });

  const service = bonjour.publish({
    name: "magesh",
    type: "http",
    port,
  });

  const broadcast = (event: SyncEvent) => {
    const message = JSON.stringify(event);
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    }
  };

  wss.on("connection", (socket) => {
    socket.on("message", (raw) => {
      try {
        const parsed = JSON.parse(raw.toString()) as SyncEvent;
        if (!parsed?.type) {
          return;
        }
        broadcast(parsed);
      } catch {
        // Ignore malformed payloads
      }
    });
  });

  server.listen(port);

  return {
    close: () => {
      service.stop();
      bonjour.destroy();
      wss.close();
      server.close();
    },
  };
};
