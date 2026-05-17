import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LOCAL_STORAGE_KEYS } from "@/constants";

const DEFAULT_SYNC_SERVER_URL = "http://magesh.local:5719";

const resolveSyncServerUrl = () => {
// NOTE: lets do this later

  return DEFAULT_SYNC_SERVER_URL;
};

type Esp32StatusPayload = {
  connected?: boolean;
  version?: string;
};

type SyncEvent = {
  type: string;
  payload?: unknown;
};

type SyncStatusState = {
  systemOnline: boolean;
  esp32Connected: boolean;
  esp32Version: string | null;
  lastSeenAt: number | null;
  latencyMs: number | null;
};

type SyncStatusContextValue = {
  state: SyncStatusState;
};

const defaultState: SyncStatusState = {
  systemOnline: false,
  esp32Connected: false,
  esp32Version: null,
  lastSeenAt: null,
  latencyMs: null,
};

const ESP32_OFFLINE_TIMEOUT_MS = 25000;
const LATENCY_PING_INTERVAL_MS = 10000;

const SyncStatusContext = createContext<SyncStatusContextValue | null>(null);

const toWebSocketUrl = (baseUrl: string) => {
  if (baseUrl.startsWith("https://")) {
    return baseUrl.replace("https://", "wss://");
  }
  return baseUrl.replace("http://", "ws://");
};

const parseEsp32Status = (payload: unknown): Esp32StatusPayload | null => {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const raw = payload as Record<string, unknown>;
  const connected = typeof raw.connected === "boolean" ? raw.connected : undefined;
  const version = typeof raw.version === "string" ? raw.version : undefined;
  return { connected, version };
};

export function SyncStatusProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SyncStatusState>(defaultState);

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let offlineTimer: number | null = null;
    let latencyTimer: number | null = null;
    const clientId = crypto.randomUUID();
    let pendingPingSentAt: number | null = null;

    const syncServerUrl = resolveSyncServerUrl();

    const checkHealth = async () => {
      try {
        const response = await fetch(`${syncServerUrl}/health`);
        if (!active) {
          return;
        }
        setState((prev) => ({
          ...prev,
          systemOnline: response.ok,
        }));
      } catch {
        if (!active) {
          return;
        }
        setState((prev) => ({
          ...prev,
          systemOnline: false,
        }));
      }
    };

    const scheduleOfflineCheck = () => {
      if (offlineTimer) {
        window.clearInterval(offlineTimer);
      }
      offlineTimer = window.setInterval(() => {
        setState((prev) => {
          if (!prev.lastSeenAt) {
            return prev;
          }
          const stale = Date.now() - prev.lastSeenAt > ESP32_OFFLINE_TIMEOUT_MS;
          if (!stale || !prev.esp32Connected) {
            return prev;
          }
          return {
            ...prev,
            esp32Connected: false,
          };
        });
      }, 5000);
    };

    const connectWebSocket = () => {
      const wsUrl = toWebSocketUrl(syncServerUrl);
      socket = new WebSocket(wsUrl);

      socket.addEventListener("open", () => {
        setState((prev) => ({
          ...prev,
          systemOnline: true,
        }));
      });

      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data) as SyncEvent;
          if (data.type === "esp32:status") {
            const esp = parseEsp32Status(data.payload);
            if (!esp) {
              return;
            }

            setState((prev) => ({
              ...prev,
              esp32Connected: esp.connected ?? prev.esp32Connected,
              esp32Version: esp.version ?? prev.esp32Version,
              lastSeenAt: Date.now(),
            }));
            return;
          }

          if (data.type === "ping") {
            const payload = data.payload as { clientId?: string; sentAt?: number } | undefined;
            if (payload?.clientId === clientId && typeof payload.sentAt === "number") {
              const rtt = Date.now() - payload.sentAt;
              setState((prev) => ({
                ...prev,
                latencyMs: rtt,
              }));
              pendingPingSentAt = null;
            }
          }
        } catch {
          // Ignore malformed payloads
        }
      });

      socket.addEventListener("close", () => {
        setState((prev) => ({
          ...prev,
          systemOnline: false,
        }));
      });
    };

    const scheduleLatencyPing = () => {
      if (latencyTimer) {
        window.clearInterval(latencyTimer);
      }
      latencyTimer = window.setInterval(() => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
          return;
        }
        const now = Date.now();
        if (pendingPingSentAt && now - pendingPingSentAt < LATENCY_PING_INTERVAL_MS) {
          return;
        }
        pendingPingSentAt = now;
        socket.send(
          JSON.stringify({
            type: "ping",
            payload: { clientId, sentAt: now },
          })
        );
      }, LATENCY_PING_INTERVAL_MS);
    };

    void checkHealth();
    scheduleOfflineCheck();
    connectWebSocket();
    scheduleLatencyPing();

    return () => {
      active = false;
      if (offlineTimer) {
        window.clearInterval(offlineTimer);
      }
      if (latencyTimer) {
        window.clearInterval(latencyTimer);
      }
      socket?.close();
    };
  }, []);

  const value = useMemo<SyncStatusContextValue>(() => ({ state }), [state]);

  return <SyncStatusContext.Provider value={value}>{children}</SyncStatusContext.Provider>;
}

export function useSyncStatus() {
  const context = useContext(SyncStatusContext);
  if (!context) {
    throw new Error("useSyncStatus must be used within SyncStatusProvider");
  }
  return context;
}
