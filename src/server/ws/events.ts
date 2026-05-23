// All WebSocket event types flowing between server ↔ clients ↔ ESP32.
// Extend this union as new domains are added.

export type WsEventType =
  | "ping"
  | "pong"
  | "esp32:status"
  | "task:created"
  | "task:updated"
  | "task:deleted"
  | "habit:updated"
  | "wellness:updated"
  | "settings:device-sync"
  | "sync:request"
  | "sync:state"
  | "pomodoro:started"
  | "pomodoro:completed"
  | "pomodoro:abandoned"
  | "wellness:standup"
  | "wellness:hydration"
  | "wellness:eye_strain"
  | "test:event";

export interface WsEvent<T = unknown> {
  type: WsEventType;
  payload?: T;
}

export interface PingPayload {
  clientId: string;
  sentAt: number;
}

export interface Esp32StatusPayload {
  connected: boolean;
  version?: string;
}

export interface TaskEventPayload {
  id: number | string;
}

export interface TestPayload {
  message: string;
}
