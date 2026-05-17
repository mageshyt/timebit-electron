import { SkipBack, Square } from "lucide-react";
import { useTimerStore } from "../../store/timer.store";

export function TimerControls() {
  const isActive = useTimerStore((s) => s.isActive);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);

  return (
    <div className="flex items-center justify-center space-x-6 mt-4 mb-8">
      <button
        onClick={reset}
        className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
        style={{ background: "#201f22", color: "#8e8d92" }}
        aria-label="Reset"
      >
        <SkipBack className="h-5 w-5" />
      </button>

      <button
        onClick={isActive ? pause : start}
        className="px-10 py-4 text-[0.875rem] font-bold uppercase tracking-[0.05em] rounded-xl hover:opacity-90 transition-opacity w-48"
        style={{
          background: "linear-gradient(135deg, #c0c1ff, #8083ff)",
          color: "#131315",
          boxShadow: "0 8px 32px rgba(192,193,255,0.2)",
        }}
      >
        {isActive ? "Pause Session" : "Start Session"}
      </button>

      <button
        onClick={reset}
        className="w-12 h-12 flex items-center justify-center rounded-full transition-colors"
        style={{ background: "#201f22", color: "#8e8d92" }}
        aria-label="Stop"
      >
        <Square className="h-4 w-4" fill="currentColor" />
      </button>
    </div>
  );
}
