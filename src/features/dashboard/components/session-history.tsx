import { CheckCircle2, XCircle, Activity } from "lucide-react";
import { useTodaySessions } from "../hooks/use-pomodoro";
import type { PomodoroSession } from "../hooks/use-pomodoro";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function StatusBadge({ status }: { status: PomodoroSession["status"] }) {
  if (status === "completed")
    return <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color: "#4ade80" }} />;
  if (status === "abandoned")
    return <XCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#ef4444" }} />;
  return <Activity className="h-4 w-4 flex-shrink-0" style={{ color: "#c0c1ff" }} />;
}

export function SessionHistory() {
  const { data: sessions, isLoading } = useTodaySessions();

  return (
    <div
      className="rounded-xl p-5 flex-1 "
      style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <span
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
          style={{ color: "#8e8d92" }}
        >
          Session Log — Today
        </span>
        <span
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-2 py-1 rounded-md"
          style={{ background: "#201f22", color: "#8083ff" }}
        >
          {sessions?.filter((s) => s.status === "completed").length ?? 0} Done
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: "#201f22" }} />
          ))}
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-8 text-center"
          style={{ color: "#5c5b61" }}
        >
          <Activity className="h-8 w-8 mb-3 opacity-30" />
          <p className="text-[0.75rem] font-medium">No sessions yet today.</p>
          <p className="text-[0.6875rem] mt-1 opacity-70">Start your first Pomodoro to get going.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-90 overflow-y-auto pr-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[0.8125rem]"
              style={{
                background: session.status === "active" ? "rgba(192,193,255,0.06)" : "#201f22",
                border: session.status === "active" ? "1px solid rgba(192,193,255,0.15)" : "none",
              }}
            >
              <StatusBadge status={session.status} />
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium truncate"
                  style={{ color: session.status === "abandoned" ? "#5c5b61" : "#e4e4e6" }}
                >
                  {session.category}
                </div>
                <div
                  className="text-[0.6875rem] uppercase tracking-[0.04em]"
                  style={{ color: "#5c5b61" }}
                >
                  {formatTime(session.startedAt)}
                  {session.endedAt ? ` — ${formatTime(session.endedAt)}` : " — ongoing"}
                </div>
              </div>
              <div
                className="text-[0.75rem] font-semibold tabular-nums flex-shrink-0"
                style={{
                  color:
                    session.status === "completed"
                      ? "#4ade80"
                      : session.status === "abandoned"
                      ? "#ef4444"
                      : "#c0c1ff",
                }}
              >
                {session.durationMins}m
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
