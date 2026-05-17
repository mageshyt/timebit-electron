import http from "node:http";
import Bonjour from "bonjour";
import { WebSocketServer } from "ws";
import { createRouter } from "./router";
import { broadcaster } from "./ws/broadcaster";
import { handleWsMessage } from "./ws/handler";

type SyncServerOptions = {
  port: number;
};

export const startSyncServer = ({ port }: SyncServerOptions) => {
  const bonjour = Bonjour();

  const router = createRouter();
  const server = http.createServer(router);

  const wss = new WebSocketServer({ server });
  broadcaster.attach(wss);

  wss.on("connection", (socket) => {
    socket.on("message", (raw) => handleWsMessage(raw as Buffer, socket));

    socket.on("error", (err) => {
      console.error("[ws] socket error", err.message);
    });
  });

  const service = bonjour.publish({
    name: "magesh",
    type: "http",
    port,
  });

  server.listen(port, () => {
    console.log(`[sync-server] Listening on http://localhost:${port}`);
  });

  return {
    close: () => {
      service.stop();
      bonjour.destroy();
      wss.close();
      server.close();
    },
  };
};
