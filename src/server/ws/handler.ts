import type { WebSocket } from "ws";
import type { WsEvent, PingPayload } from "./events";
import { broadcaster } from "./broadcaster";

/**
 * Handles all incoming WebSocket messages from any client.
 * Each registered handler receives the raw event and the originating socket.
 */

type MessageHandler = (event: WsEvent, socket: WebSocket) => void;

const handlers: Partial<Record<string, MessageHandler>> = {
  ping: (event, socket) => {
    const payload = event.payload as PingPayload | undefined;
    // Echo pong back to sender only
    broadcaster.send(socket, { type: "pong", payload });
  },

  "sync:request": (_event, _socket) => {
    // TODO: respond with full bootstrap state when DB is wired up
    broadcaster.broadcast({ type: "sync:state", payload: {} });
  },
};

export function handleWsMessage(raw: Buffer | string, socket: WebSocket): void {
  let event: WsEvent;

  try {
    event = JSON.parse(raw.toString()) as WsEvent;
  } catch {
    return; // Ignore malformed payloads
  }

  if (!event?.type) return;

  const handler = handlers[event.type];
  if (handler) {
    handler(event, socket);
  } else {
    // Unknown/passthrough events — relay to all other clients
    broadcaster.broadcast(event);
  }
}
