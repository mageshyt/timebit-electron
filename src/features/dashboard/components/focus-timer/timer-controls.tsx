import { Square, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useTimerStore } from "../../store/timer.store";
import { useStartSession, useCompleteSession, useAbandonSession } from "../../hooks/use-pomodoro";
import { playSuccessChime, playStartSessionSound } from "@/utils/sound";

export function TimerControls() {
  const isActive = useTimerStore((s) => s.isActive);
  const activeSessionId = useTimerStore((s) => s.activeSessionId);
  const category = useTimerStore((s) => s.category);
  const taskId = useTimerStore((s) => s.taskId);
  const taskLabel = useTimerStore((s) => s.taskLabel);
  const elapsed = useTimerStore((s) => s.elapsed);
  const sessionDuration = useTimerStore((s) => s.sessionDuration);

  const pause = useTimerStore((s) => s.pause);
  const _onSessionStarted = useTimerStore((s) => s._onSessionStarted);
  const _onSessionCompleted = useTimerStore((s) => s._onSessionCompleted);
  const _onSessionAbandoned = useTimerStore((s) => s._onSessionAbandoned);

  const startMutation = useStartSession();
  const completeMutation = useCompleteSession();
  const abandonMutation = useAbandonSession();

  const isBusy =
    startMutation.isPending ||
    completeMutation.isPending ||
    abandonMutation.isPending;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleStart = async () => {
    if (isActive || activeSessionId !== null) return;
    try {
      const session = await startMutation.mutateAsync({
        category,
        taskId,
        durationMins: Math.round(sessionDuration / 60000),
      });
      _onSessionStarted(session.id);
      playStartSessionSound();
      toast.success("Session started", {
        description: taskLabel
          ? `Focusing on: ${taskLabel}`
          : `Category: ${category}`,
      });
    } catch {
      toast.error("Failed to start session");
    }
  };

  const handlePause = () => {
    pause();
    toast.info("Session paused");
  };

  const handleComplete = async () => {
    if (activeSessionId === null) return;
    try {
      const actualMins = Math.max(1, Math.round(elapsed / 60000));
      await completeMutation.mutateAsync({ id: activeSessionId, actualMins });
      _onSessionCompleted();
      playSuccessChime();
      toast.success("Session completed! 🎉", {
        description: `Great work — ${actualMins} min of focused time logged.`,
      });
    } catch {
      toast.error("Failed to complete session");
    }
  };

  const handleAbandon = async () => {
    if (activeSessionId === null) {
      // No DB session yet — just reset
      useTimerStore.getState().reset();
      return;
    }
    try {
      await abandonMutation.mutateAsync({ id: activeSessionId });
      _onSessionAbandoned();
      toast.warning("Session abandoned");
    } catch {
      toast.error("Failed to record abandonment");
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-4 mb-6">
      {/* Abandon / Reset */}
      <button
        type="button"
        onClick={handleAbandon}
        disabled={isBusy}
        className="w-12 h-12 flex items-center justify-center rounded-full transition-colors disabled:opacity-40"
        style={{ background: "#201f22", color: "#8e8d92" }}
        aria-label="Abandon session"
        title="Abandon session"
      >
        <Square className="h-4 w-4" fill="currentColor" />
      </button>

      {/* Primary: Start / Pause */}
      <button
        type="button"
        onClick={isActive ? handlePause : handleStart}
        disabled={isBusy}
        className="px-10 py-4 text-[0.875rem] font-bold uppercase tracking-[0.05em] rounded-xl hover:opacity-90 transition-opacity w-48 disabled:opacity-50"
        style={{
          background: "linear-gradient(135deg, #c0c1ff, #8083ff)",
          color: "#131315",
          boxShadow: "0 8px 32px rgba(192,193,255,0.2)",
        }}
      >
        {startMutation.isPending
          ? "Starting..."
          : isActive
          ? "Pause"
          : activeSessionId !== null
          ? "Resume"
          : "Start Session"}
      </button>

      {/* Complete (active only) */}
      <button
        type="button"
        onClick={handleComplete}
        disabled={isBusy || activeSessionId === null}
        className="w-12 h-12 flex items-center justify-center rounded-full transition-colors disabled:opacity-30"
        style={{ background: "#142b1e", color: "#4ade80" }}
        aria-label="Complete session"
        title="Mark session complete"
      >
        <CheckCircle className="h-5 w-5" />
      </button>
    </div>
  );
}
