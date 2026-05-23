import { createFileRoute } from "@tanstack/react-router";
import { Activity, Send, Trash2, BellRing } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { inDevelopment } from "@/constants";
import { getSyncServerUrl } from "@/state/sync-status";
import { toast } from "sonner";

type LogDirection = "in" | "out" | "system";

type LogEntry = {
  id: string;
  time: string;
  direction: LogDirection;
  message: string;
};

type ConnectionState = "connecting" | "connected" | "disconnected";

type EventPreset = {
  label: string;
  type: string;
  payload: string;
};

const MAX_LOG_ENTRIES = 200;

const EVENT_PRESETS: EventPreset[] = [
  {
    label: "Test Event",
    type: "test:event",
    payload: '{"message":"Hello from the Test lab"}',
  },
  {
    label: "ESP32 Status",
    type: "esp32:status",
    payload: '{"connected":true,"version":"1.0.4"}',
  },
  {
    label: "Task Updated",
    type: "task:updated",
    payload: '{"id":1,"title":"Example task"}',
  },
  {
    label: "Sync Request",
    type: "sync:request",
    payload: "{}",
  },
];

const toWebSocketUrl = (baseUrl: string) => {
  if (baseUrl.startsWith("https://")) {
    return baseUrl.replace("https://", "wss://");
  }
  return baseUrl.replace("http://", "ws://");
};

function TestLabPage() {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [eventType, setEventType] = useState("test:event");
  const [payloadText, setPayloadText] = useState(
    '{"message":"Hello from the Test lab"}'
  );
  const [selectedPreset, setSelectedPreset] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const socketRef = useRef<WebSocket | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  const syncServerUrl = useMemo(() => getSyncServerUrl(), []);
  const wsUrl = useMemo(() => toWebSocketUrl(syncServerUrl), [syncServerUrl]);

  const appendLog = (entry: LogEntry) => {
    setLogs((prev) => {
      const next = [...prev, entry];
      return next.length > MAX_LOG_ENTRIES ? next.slice(-MAX_LOG_ENTRIES) : next;
    });
  };

  useEffect(() => {
    if (!inDevelopment) {
      return undefined;
    }

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    appendLog({
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString(),
      direction: "system",
      message: `Connecting to ${wsUrl}...`,
    });

    socket.addEventListener("open", () => {
      setConnectionState("connected");
      appendLog({
        id: crypto.randomUUID(),
        time: new Date().toLocaleTimeString(),
        direction: "system",
        message: "WebSocket connected.",
      });
    });

    socket.addEventListener("close", () => {
      setConnectionState("disconnected");
      appendLog({
        id: crypto.randomUUID(),
        time: new Date().toLocaleTimeString(),
        direction: "system",
        message: "WebSocket disconnected.",
      });
    });

    socket.addEventListener("message", (event) => {
      const raw = typeof event.data === "string" ? event.data : "[binary message]";
      let message = raw;
      try {
        const parsed = JSON.parse(raw);
        message = JSON.stringify(parsed, null, 2);
      } catch {
        // Keep raw payload for non-JSON messages.
      }

      appendLog({
        id: crypto.randomUUID(),
        time: new Date().toLocaleTimeString(),
        direction: "in",
        message,
      });
    });

    socket.addEventListener("error", () => {
      setConnectionState("disconnected");
      appendLog({
        id: crypto.randomUUID(),
        time: new Date().toLocaleTimeString(),
        direction: "system",
        message: "WebSocket error (check sync server).",
      });
    });

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, [wsUrl]);

  useEffect(() => {
    if (!logRef.current) {
      return;
    }
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const handleSend = () => {
    setErrorMessage(null);

    const trimmedType = eventType.trim();
    if (!trimmedType) {
      setErrorMessage("Event type is required.");
      return;
    }

    let payload: unknown = undefined;
    const trimmedPayload = payloadText.trim();
    if (trimmedPayload.length > 0) {
      try {
        payload = JSON.parse(trimmedPayload);
      } catch {
        setErrorMessage("Payload must be valid JSON.");
        return;
      }
    }

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setErrorMessage("WebSocket is not connected.");
      return;
    }

    const event = { type: trimmedType, payload };
    socketRef.current.send(JSON.stringify(event));

    appendLog({
      id: crypto.randomUUID(),
      time: new Date().toLocaleTimeString(),
      direction: "out",
      message: JSON.stringify(event, null, 2),
    });
  };

  const handleClear = () => {
    setLogs([]);
  };

  const handlePreset = (preset: EventPreset) => {
    setEventType(preset.type);
    setPayloadText(preset.payload);
    setErrorMessage(null);
    setSelectedPreset(preset.label);
  };

  const triggerNotificationTest = async (type: "standup" | "water_intake" | "eye_strain") => {
    try {
      const res = await fetch(`${syncServerUrl}/wellness/test-notification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        toast.success(`Triggered native ${type} notification! 🚀`, {
          id: `test-trigger-${type}`,
        });
      } else {
        toast.error("Failed to trigger system notification.");
      }
    } catch (err) {
      console.error("Failed to trigger test notification:", err);
      toast.error("Error communicating with sync server.");
    }
  };

  if (!inDevelopment) {
    return (
      <div className="flex h-full w-full flex-col p-6 pb-8">
        <div className="mx-auto w-full max-w-[960px] rounded-xl bg-[#1c1b1d] p-6 text-[#8e8d92]">
          This page is only available in development builds.
        </div>
      </div>
    );
  }

  const statusColor =
    connectionState === "connected"
      ? "#4ade80"
      : connectionState === "connecting"
      ? "#facc15"
      : "#ff6b6b";

  return (
    <div className="flex h-full w-full flex-col p-6 pb-8 overflow-y-auto">
      <div className="mx-auto flex w-full flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-[#f4f4f5]">
              Test Lab
            </h1>
            <p className="mt-1 text-[0.8125rem] text-[#8e8d92]">
              Trigger wellness alerts and inspect real-time sync WebSocket logs.
            </p>
          </div>
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
            style={{ background: "#1c1b1d", color: statusColor }}
          >
            <Activity className="h-3 w-3" />
            {connectionState}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            {/* System Notification Tester Panel */}
            <div className="rounded-xl bg-[#1c1b1d] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                <BellRing className="h-3.5 w-3.5 text-[#c0c1ff]" />
                System Alerts Tester
              </div>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-[#8e8d92] mb-4">
                Trigger native system notifications from the Electron main process to verify styling, action handlers, and database logging.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => triggerNotificationTest("standup")}
                  className="flex items-center justify-between rounded-md bg-[#201f22] hover:bg-[#2a2a2c] border border-transparent hover:border-[#c0c1ff]/15 px-4 py-2.5 text-[0.8125rem] text-[#e4e4e6] transition-all cursor-pointer group"
                >
                  <span className="group-hover:text-[#c0c1ff] transition-colors">Stand-up Alert</span>
                  <span className="text-[0.6875rem] text-[#5c5b61] font-mono">60m standup</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotificationTest("water_intake")}
                  className="flex items-center justify-between rounded-md bg-[#201f22] hover:bg-[#2a2a2c] border border-transparent hover:border-[#c0c1ff]/15 px-4 py-2.5 text-[0.8125rem] text-[#e4e4e6] transition-all cursor-pointer group"
                >
                  <span className="group-hover:text-[#c0c1ff] transition-colors">Hydration Alert</span>
                  <span className="text-[0.6875rem] text-[#5c5b61] font-mono">30m water_intake</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerNotificationTest("eye_strain")}
                  className="flex items-center justify-between rounded-md bg-[#201f22] hover:bg-[#2a2a2c] border border-transparent hover:border-[#c0c1ff]/15 px-4 py-2.5 text-[0.8125rem] text-[#e4e4e6] transition-all cursor-pointer group"
                >
                  <span className="group-hover:text-[#c0c1ff] transition-colors">Eye Strain Alert</span>
                  <span className="text-[0.6875rem] text-[#5c5b61] font-mono">20m eye_strain</span>
                </button>
              </div>
            </div>

            {/* Event Composer */}
            <div className="rounded-xl bg-[#1c1b1d] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                WS Event Composer
              </div>

              <div className="mt-4 flex flex-col gap-4">
                <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                  Presets
                  <select
                    value={selectedPreset}
                    onChange={(event) => {
                      const preset = EVENT_PRESETS.find(
                        (item) => item.label === event.target.value
                      );
                      if (preset) {
                        handlePreset(preset);
                      } else {
                        setSelectedPreset("");
                      }
                    }}
                    className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40 cursor-pointer"
                  >
                    <option value="">Custom</option>
                    {EVENT_PRESETS.map((preset) => (
                      <option key={preset.label} value={preset.label}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                  Event Type
                  <input
                    value={eventType}
                    onChange={(event) => setEventType(event.target.value)}
                    className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
                    placeholder="test:event"
                  />
                </label>

                <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                  Payload (JSON)
                  <textarea
                    value={payloadText}
                    onChange={(event) => setPayloadText(event.target.value)}
                    rows={4}
                    className="mt-2 w-full resize-none rounded-md border-0 bg-[#201f22] px-3 py-2 font-mono text-[0.75rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
                  />
                </label>

                {errorMessage ? (
                  <div className="rounded-md border border-[#3a2a2a] bg-[#201f22] px-3 py-2 text-[0.75rem] text-[#ffb4b4]">
                    {errorMessage}
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSend}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#131315] hover:opacity-90 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Send Event
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center justify-center gap-2 rounded-md bg-[#2a2a2c] px-3 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] hover:text-[#e4e4e6] cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#0e0e10] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                Event Console
              </span>
              <span className="text-[0.6875rem] text-[#5c5b61]">
                {logs.length} entries
              </span>
            </div>
            <div
              ref={logRef}
              className="h-[520px] overflow-y-auto rounded-lg bg-[#0b0b0d] p-3 font-mono text-[0.75rem] text-[#c9c9cc]"
            >
              {logs.length === 0 ? (
                <div className="text-[#5c5b61]">No events yet.</div>
              ) : (
                logs.map((entry) => (
                  <div key={entry.id} className="mb-3 whitespace-pre-wrap">
                    <span className="text-[#5c5b61]">[{entry.time}]</span>{" "}
                    <span
                      className={
                        entry.direction === "in"
                          ? "text-[#4ade80]"
                          : entry.direction === "out"
                          ? "text-[#c0c1ff]"
                          : "text-[#facc15]"
                      }
                    >
                      {entry.direction.toUpperCase()}
                    </span>
                    {" "}
                    {entry.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/test-lab")({
  component: TestLabPage,
});
