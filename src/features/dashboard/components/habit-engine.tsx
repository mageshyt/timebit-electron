import { CheckCircle2, Circle } from "lucide-react";

const HABITS = [
  { id: 1, label: "Hydration Protocol (500ml)", time: "08:00", done: true },
  { id: 2, label: "Morning Synchronization", time: "09:15", done: true },
  { id: 3, label: "Physiological Reset (Stretch)", time: "14:45", done: false, prominent: true },
  { id: 4, label: "Workspace Defragmentation", time: "17:30", done: false },
];

export function HabitEngine() {
  return (
    <div
      className="rounded-xl p-6"
      style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]" style={{ color: "#8e8d92" }}>
          Habit Engine
        </span>
        <span
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-2 py-1 rounded-md"
          style={{ background: "#201f22", color: "#8083ff" }}
        >
          75% Complete
        </span>
      </div>

      <div className="space-y-[0.9rem]">
        {HABITS.map((h) => (
          <div
            key={h.id}
            className="flex items-center justify-between p-3 rounded-lg text-[0.875rem]"
            style={{
              background: h.prominent ? "#2a2a2c" : "#201f22",
              boxShadow: h.prominent ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
            }}
          >
            <div className="flex items-center space-x-3" style={{ color: h.done ? "#5c5b61" : "#e4e4e6" }}>
              {h.done
                ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#8083ff" }} />
                : <Circle className="h-5 w-5 flex-shrink-0" style={{ color: "#8e8d92" }} />
              }
              <span style={{ textDecoration: h.done ? "line-through" : "none", fontWeight: h.prominent ? 500 : 400 }}>
                {h.label}
              </span>
            </div>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]" style={{ color: h.done ? "#5c5b61" : "#8e8d92" }}>
              {h.time}
            </span>
          </div>
        ))}
      </div>

      <button
        className="w-full mt-6 py-3 rounded-lg text-[0.6875rem] font-semibold uppercase tracking-[0.05em] transition-colors"
        style={{ background: "#201f22", color: "#c0c1ff" }}
      >
        Manage Habits
      </button>
    </div>
  );
}
