import { useEffect } from "react";
import { useTodaySessions } from "../../hooks/use-pomodoro";
import { useTimerStore } from "../../store/timer.store";

export function TimerStats() {
  const { data: sessions } = useTodaySessions();
  const sessionCount = useTimerStore((s) => s.sessionCount);
  const setSessionCount = useTimerStore((s) => s.setSessionCount);

  // Sync the store count from DB on first load
  useEffect(() => {
    if (!sessions) return;
    const completed = sessions.filter((s) => s.status === "completed").length;
    setSessionCount(completed);
  }, [sessions, setSessionCount]);

  const completedSessions = sessions?.filter((s) => s.status === "completed") ?? [];
  const totalMins = completedSessions.reduce((acc, s) => acc + s.durationMins, 0);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  const focusLabel =
    totalMins === 0
      ? "0m"
      : hours > 0
      ? `${hours}h ${mins}m`
      : `${mins}m`;

  const streak = sessions
    ? (() => {
        let s = 0;
        for (const sess of sessions) {
          if (sess.status === "completed") s++;
          else if (sess.status === "abandoned") break;
        }
        return s;
      })()
    : 0;

  const stats = [
    { label: "Sessions Today", value: String(sessionCount) },
    { label: "Focus Time", value: focusLabel },
    { label: "Clean Streak", value: `${streak}` },
  ];

  return (
    <div
      className="grid grid-cols-3 rounded-xl p-4 mt-auto"
      style={{ background: "rgba(19,19,21,0.5)" }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center justify-center">
          <span
            className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] mb-1"
            style={{ color: "#8e8d92" }}
          >
            {stat.label}
          </span>
          <span className="text-[1.125rem] font-medium" style={{ color: "#e4e4e6" }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
