import { useTimerStore } from "../../store/timer.store";

export function TimerDisplay() {
  const elapsed = useTimerStore((s) => s.elapsed);
  const startTime = useTimerStore((s) => s.startTime);

  const totalSeconds = Math.floor(elapsed / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const formatted = startTime !== null ? `${minutes}:${seconds}` : "00:00";

  return (
    <div
      className="text-[3.5rem] font-bold tracking-[-0.04em] leading-none tabular-nums mb-6"
      style={{ color: "#f4f4f5" }}
    >
      {formatted}
    </div>
  );
}
