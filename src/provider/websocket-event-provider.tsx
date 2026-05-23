import React, { createContext, useContext, useEffect } from "react";
import { toast } from "sonner";
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
  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | null = null;

    const syncServerUrl = getSyncServerUrl();
    const wsUrl = toWebSocketUrl(syncServerUrl);

    const logWellnessBreak = async (type: "standup" | "eye_strain") => {
      try {
        const res = await fetch(`${syncServerUrl}/wellness/log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type }),
        });
        if (res.ok) {
          toast.success(
            `Logged your ${type === "standup" ? "stretch break" : "eye break"}!`,
            {
              id: `wellness-success-${type}`,
            }
          );
        }
      } catch (err) {
        console.error("Failed to log wellness break:", err);
        toast.error("Failed to log action.");
      }
    };

    const logHydration = async () => {
      try {
        const res = await fetch(`${syncServerUrl}/wellness/water`, {
          method: "POST",
        });
        if (res.ok) {
          toast.success("Glass of water logged! 💧", {
            id: "wellness-success-hydration",
          });
        }
      } catch (err) {
        console.error("Failed to log hydration:", err);
        toast.error("Failed to log water intake.");
      }
    };

    const connect = () => {
      if (!active) return;
      socket = new WebSocket(wsUrl);

      socket.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data) as { type: string };

          if (data.type === "wellness:standup") {
            toast.info("Time to stand up and stretch! 🚶‍♂️", {
              id: "wellness-standup",
              duration: Number.POSITIVE_INFINITY,
              action: {
                label: "Done",
                onClick: () => {
                  void logWellnessBreak("standup");
                },
              },
            });
          } else if (data.type === "wellness:hydration") {
            toast.info("Time for a glass of water! 💧", {
              id: "wellness-hydration",
              duration: Number.POSITIVE_INFINITY,
              action: {
                label: "Done",
                onClick: () => {
                  void logHydration();
                },
              },
            });
          } else if (data.type === "wellness:eye_strain") {
            toast.info("Look 20 feet away for 20 seconds! 👀", {
              id: "wellness-eye_strain",
              duration: Number.POSITIVE_INFINITY,
              action: {
                label: "Done",
                onClick: () => {
                  void logWellnessBreak("eye_strain");
                },
              },
            });
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
  }, []);

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
