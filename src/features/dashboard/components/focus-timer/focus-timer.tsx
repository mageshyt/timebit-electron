import { FocusRing } from "./focus-ring";
import { TimerDisplay } from "./timer-display";
import { SessionStatus } from "./session-status";
import { TimerControls } from "./timer-controls";
import { TimerStats } from "./timer-stats";

export function FocusTimer() {
  return (
    <div
      className="flex-1 rounded-[1.5rem] relative flex flex-col p-6 overflow-hidden"
      style={{
        background: "#1c1b1d",
        boxShadow: "0 8px 32px rgba(192,193,255,0.03)",
      }}
    >
      {/* Session ID badge — static */}
      <div
        className="absolute top-6 right-6 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-2 py-1 rounded"
        style={{ background: "#201f22", color: "#8083ff" }}
      >
        Session_ID: TB-992-X
      </div>

      {/* Ring + time display */}
      <div className="flex-1 flex flex-col items-center justify-center relative py-12">
        {/* SVG ring sized to 288px diameter (radius 140 + stroke 4) */}
        <div className="relative flex items-center justify-center" style={{ width: 288, height: 288 }}>
          <FocusRing />
          <div className="relative flex flex-col items-center gap-4">
            <span
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
              style={{ color: "#8e8d92" }}
            >
              Cycle Time
            </span>
            <TimerDisplay />
            <SessionStatus />
          </div>
        </div>
      </div>

      <TimerControls />
      <TimerStats />
    </div>
  );
}
