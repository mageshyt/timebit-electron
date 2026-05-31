import { useEffect, useRef } from "react";
import { FocusRing } from "./focus-ring";
import { TimerDisplay } from "./timer-display";
import { SessionStatus } from "./session-status";
import { TimerControls } from "./timer-controls";
import { TimerStats } from "./timer-stats";
import { SessionCategoryPicker } from "../session-category-picker";
import { useTimerStore } from "../../store/timer.store";
import { useSettingsActions } from "@/features/settings/settings.hooks";
import { useCompleteSession } from "../../hooks/use-pomodoro";
import { playFocusCompleteSound, playBreakCompleteSound } from "@/utils/sound";
import { toast } from "sonner";

export function FocusTimer() {
  const activeSessionId = useTimerStore((s) => s.activeSessionId);
  const taskLabel = useTimerStore((s) => s.taskLabel);
  const elapsed = useTimerStore((s) => s.elapsed);
  const sessionDuration = useTimerStore((s) => s.sessionDuration);
  const mode = useTimerStore((s) => s.mode);
  const _onSessionCompleted = useTimerStore((s) => s._onSessionCompleted);
  const syncSettings = useTimerStore((s) => s.syncSettings);
  const setMode = useTimerStore((s) => s.setMode);
  const isActive = useTimerStore((s) => s.isActive);

  const { settings } = useSettingsActions();
  const completeMutation = useCompleteSession();

  const lastCompletedSessionRef = useRef<number | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  // Sync settings when loaded/changed
  useEffect(() => {
    if (settings) {
      syncSettings({
        focusDurationMins: settings.focusDurationMins,
        focusShortBreakMins: settings.focusShortBreakMins,
        focusLongBreakMins: settings.focusLongBreakMins,
      });
    }
  }, [settings, syncSettings]);

  // Auto-complete active sessions when timer ends
  useEffect(() => {
    if (elapsed >= sessionDuration && elapsed > 0) {
      if (activeSessionId !== null && lastCompletedSessionRef.current !== activeSessionId) {
        lastCompletedSessionRef.current = activeSessionId;
        const triggerAutoComplete = async () => {
          try {
            const actualMins = Math.max(1, Math.round(elapsed / 60000));
            await completeMutation.mutateAsync({ id: activeSessionId, actualMins });
            _onSessionCompleted();
            if (mode === "focus") {
              playFocusCompleteSound();
              toast.success("Focus session completed! 🎉", {
                description: `Great work — ${actualMins} min of focused time logged.`,
              });
            } else {
              playBreakCompleteSound();
              toast.success("Break completed! ☕️", {
                description: "Time to get back to focus.",
              });
            }
          } catch (err) {
            console.error("Auto-complete failed:", err);
            lastCompletedSessionRef.current = null;
          }
        };
        triggerAutoComplete();
      } else if (activeSessionId === null && mode !== "focus" && !isTransitioningRef.current) {
        isTransitioningRef.current = true;
        _onSessionCompleted();
        playBreakCompleteSound();
        toast.success("Break completed! ☕️", {
          description: "Time to get back to focus.",
        });
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 1000);
      }
    }
  }, [activeSessionId, elapsed, sessionDuration, mode, _onSessionCompleted]);

  return (
    <div
      className="flex-1 rounded-[1.5rem] relative flex flex-col p-6 overflow-hidden"
      style={{
        background: "#1c1b1d",
        boxShadow: "0 8px 32px rgba(192,193,255,0.03)",
      }}
    >
      {/* Session ID badge */}
      <div
        className="absolute top-6 right-6 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-2 py-1 rounded"
        style={{ background: "#201f22", color: "#8083ff" }}
      >
        {activeSessionId !== null ? `Session #${activeSessionId}` : "— No Active Session"}
      </div>

      {/* Task label if linked */}
      {taskLabel ? (
        <div
          className="absolute top-6 left-6 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-2 py-1 rounded max-w-[40%] truncate"
          style={{ background: "#142b1e", color: "#4ade80" }}
          title={taskLabel}
        >
          ▶ {taskLabel}
        </div>
      ) : null}

      {/* Mode Selector Tabs */}
      {!isActive ? (
        <div className="flex justify-center gap-1.5 mt-8 mb-2 z-10">
          {(["focus", "short_break", "long_break"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize tracking-wide transition-all cursor-pointer ${
                mode === m
                  ? "bg-[#c0c1ff]/15 text-[#c0c1ff] border border-[#c0c1ff]/30"
                  : "text-[#8e8d92] hover:text-[#e4e4e6] border border-transparent"
              }`}
            >
              {m.replace("_", " ")}
            </button>
          ))}
        </div>
      ) : (
        /* Spacer when active to prevent layout shift */
        <div className="h-[26px] mt-8 mb-2" />
      )}

      {/* Ring + time display */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-6">
        <div className="relative flex items-center justify-center" style={{ width: 288, height: 288 }}>
          <FocusRing />
          <div className="relative flex flex-col items-center gap-4">
            <span
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
              style={{ color: "#8e8d92" }}
            >
              {mode === "focus" ? "Focus Time" : "Break Time"}
            </span>
            <TimerDisplay />
            <SessionStatus />
          </div>
        </div>
      </div>

      {/* Category picker */}
      <SessionCategoryPicker />

      <TimerControls />
      <TimerStats />
    </div>
  );
}
