import React, { createContext, useContext, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSyncServerUrl } from "@/state/sync-status";

type WebSocketEventContextValue = Record<string, never>;

const WebSocketEventContext = createContext<WebSocketEventContextValue | null>(null);

const toWebSocketUrl = (baseUrl: string) => {
  if (baseUrl.startsWith("https://")) {
    return baseUrl.replace("https://", "wss://");
  }
  return baseUrl.replace("http://", "ws://");
};

export function WebSocketEventProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;

    const syncServerUrl = getSyncServerUrl();
    const wsUrl = toWebSocketUrl(syncServerUrl);

    const connect = () => {
      if (!active) return;
      socket = new WebSocket(wsUrl);

      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data) as { type: string };

          if (data.type === "wellness:updated") {
            void queryClient.invalidateQueries({ queryKey: ["wellness", "water"] });
          } else if (data.type === "habit:updated") {
            void queryClient.invalidateQueries({ queryKey: ["habits"] });
          } else if (
            data.type === "task:created" ||
            data.type === "task:updated" ||
            data.type === "task:deleted"
          ) {
            void queryClient.invalidateQueries({ queryKey: ["tasks"] });
            void queryClient.invalidateQueries({ queryKey: ["tasks-summary"] });
          } else if (
            data.type === "pomodoro:started" ||
            data.type === "pomodoro:completed" ||
            data.type === "pomodoro:abandoned"
          ) {
            void queryClient.invalidateQueries({ queryKey: ["pomodoro"] });
          }
        } catch {
          // ignore malformed payloads
        }
      });

      socket.addEventListener("close", () => {
        if (active) {
          reconnectTimer = window.setTimeout(connect, 5000);
        }
      });

      socket.addEventListener("error", (err) => {
        console.error("[ws-event-provider] socket error:", err);
      });
    };

    connect();

    return () => {
      active = false;
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      if (socket) {
        socket.close();
      }
    };
  }, [queryClient]);

  return (
    <WebSocketEventContext.Provider value={{}}>
      {children}
    </WebSocketEventContext.Provider>
  );
}

export function useWebSocketEvents() {
  const context = useContext(WebSocketEventContext);
  if (!context) {
    throw new Error("useWebSocketEvents must be used within WebSocketEventProvider");
  }
  return context;
}
