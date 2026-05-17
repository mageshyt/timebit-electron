import { useTimerStore } from "../../store/timer.store";

/** Only re-renders when `isActive` flips. */
export function SessionStatus() {
  const isActive = useTimerStore((s) => s.isActive);

  return (
    <div
      className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-4 py-1.5 rounded-full"
      style={{ background: "#201f22", color: "#c0c1ff" }}
    >
      {isActive ? "Deep Focus Active" : "Session Paused"}
    </div>
  );
}
