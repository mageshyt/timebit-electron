import type { WebSocketServer, WebSocket } from "ws";
import type { WsEvent } from "./events";

/**
 * Wraps a WebSocketServer and exposes a typed broadcast API.
 * Passed into route handlers so REST mutations can push live updates.
 */
export class Broadcaster {
  private wss: WebSocketServer | null = null;

  attach(wss: WebSocketServer): void {
    this.wss = wss;
  }

  broadcast<T>(event: WsEvent<T>): void {
    if (!this.wss) return;
    const message = JSON.stringify(event);
    for (const client of this.wss.clients) {
      if (client.readyState === (client as WebSocket).OPEN) {
        client.send(message);
      }
    }
  }

  /** Send to a single socket only (e.g. ping reply). */
  send<T>(socket: WebSocket, event: WsEvent<T>): void {
    if (socket.readyState === socket.OPEN) {
      socket.send(JSON.stringify(event));
    }
  }
}

// Singleton shared across routes and WS handler.
export const broadcaster = new Broadcaster();
