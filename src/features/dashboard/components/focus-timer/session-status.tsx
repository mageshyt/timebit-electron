import { useTimerStore } from "../../store/timer.store";

export function SessionStatus() {
  const isActive = useTimerStore((s) => s.isActive);
  const activeSessionId = useTimerStore((s) => s.activeSessionId);
  const mode = useTimerStore((s) => s.mode);

  const getStatusText = () => {
    if (isActive) {
      if (mode === "focus") return "Deep Focus Active";
      if (mode === "short_break") return "Short Break Active";
      if (mode === "long_break") return "Long Break Active";
    } else {
      if (activeSessionId !== null) return "Session Paused";
      if (mode === "focus") return "Ready to Focus";
      if (mode === "short_break") return "Take a Short Break";
      if (mode === "long_break") return "Take a Long Break";
    }
    return "Ready to Focus";
  };

  return (
    <div
      className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-4 py-1.5 rounded-full"
      style={{ background: "#201f22", color: "#c0c1ff" }}
    >
      {getStatusText()}
    </div>
  );
}
