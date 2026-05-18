import http from "node:http";
import { healthRoute } from "./routes/health.route";
import { summaryRoute } from "./routes/summary.route";
import {
  listTasksRoute,
  createTaskRoute,
  updateTaskRoute,
  deleteTaskRoute,
} from "./routes/tasks.route";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function sendJson(
  res: http.ServerResponse,
  status: number,
  body: unknown,
): void {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(json),
    "Access-Control-Allow-Origin": "*",
  });
  res.end(json);
}

export function readBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString()) as T);
      } catch {
        resolve({} as T);
      }
    });
    req.on("error", reject);
  });
}

/** Extract a numeric :id param from a path segment, e.g. /tasks/42 → 42 */
function extractId(url: string, prefix: string): number | null {
  const segment = url.slice(prefix.length);
  const id = Number.parseInt(segment, 10);
  return Number.isNaN(id) ? null : id;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export function createRouter(): http.RequestListener {
  return (req, res) => {
    const { method = "GET", url = "/" } = req;
    const requestUrl = new URL(url, "http://localhost");
    const pathname = requestUrl.pathname;

    // OPTIONS pre-flight (for dev tools / cross-origin access)
    if (method === "OPTIONS") {
      res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE", "Access-Control-Allow-Headers": "Content-Type" });
      res.end();
      return;
    }

    // GET /health
    if (method === "GET" && pathname === "/health") {
      healthRoute(req, res);
      return;
    }

    // GET /summary
    if (method === "GET" && pathname === "/summary") {
      void summaryRoute(req, res);
      return;
    }

    // GET /tasks
    if (method === "GET" && pathname === "/tasks") {
      void listTasksRoute(req, res);
      return;
    }

    // POST /tasks
    if (method === "POST" && pathname === "/tasks") {
      void createTaskRoute(req, res);
      return;
    }

    // PATCH /tasks/:id
    if (method === "PATCH" && pathname.startsWith("/tasks/")) {
      const id = extractId(pathname, "/tasks/");
      if (id === null) { sendJson(res, 400, { error: "Invalid id" }); return; }
      void updateTaskRoute(req, res, id);
      return;
    }

    // DELETE /tasks/:id
    if (method === "DELETE" && pathname.startsWith("/tasks/")) {
      const id = extractId(pathname, "/tasks/");
      if (id === null) { sendJson(res, 400, { error: "Invalid id" }); return; }
      void deleteTaskRoute(req, res, id);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  };
}
