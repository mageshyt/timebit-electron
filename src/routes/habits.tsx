import { createFileRoute } from "@tanstack/react-router";
import { Repeat2, Flame, CheckCircle2, Circle } from "lucide-react";

function HabitsPage() {
  const habits = [
    { id: 1, label: "Hydration Protocol (500ml)", streak: 14, done: true },
    { id: 2, label: "Morning Synchronization", streak: 7, done: true },
    { id: 3, label: "Physiological Reset (Stretch)", streak: 3, done: false },
    { id: 4, label: "Workspace Defragmentation", streak: 5, done: false },
    { id: 5, label: "Evening Review", streak: 21, done: false },
  ];

  return (
    <div className="flex h-full w-full flex-col p-6 pb-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-[#f4f4f5] mb-2">
            Habit Engine
          </h1>
          <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
            Today's completion —{" "}
            <span className="text-[#c0c1ff]">40%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-4 py-2 rounded-md bg-[#2a2a2c] text-[#ffb783]">
          <Flame className="w-3.5 h-3.5" />
          Best Streak: 21 Days
        </div>
      </div>

      {/* Habit List */}
      <div className="bg-[#1c1b1d] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex-1">
        <div className="space-y-[0.9rem]">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center justify-between px-4 py-3 rounded-lg"
              style={{ background: habit.done ? "#201f22" : "#2a2a2c" }}
            >
              <div className="flex items-center gap-3">
                {habit.done ? (
                  <CheckCircle2 className="w-5 h-5 text-[#8083ff] flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[#5c5b61] flex-shrink-0" />
                )}
                <span
                  className="text-[0.875rem]"
                  style={{
                    color: habit.done ? "#5c5b61" : "#e4e4e6",
                    textDecoration: habit.done ? "line-through" : "none",
                  }}
                >
                  {habit.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Flame
                  className="w-3.5 h-3.5"
                  style={{ color: habit.streak >= 7 ? "#ffb783" : "#353437" }}
                />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61]">
                  {habit.streak}d
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly overview strip */}
      <div className="mt-6 bg-[#1c1b1d] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-4 block">
          This Week
        </span>
        <div className="flex gap-2">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full h-8 rounded-md"
                style={{
                  background:
                    i < 5
                      ? i < 3
                        ? "linear-gradient(135deg, #c0c1ff, #8083ff)"
                        : "#2a2a2c"
                      : "#201f22",
                  opacity: i < 3 ? 1 : 0.5,
                }}
              />
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61]">
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/habits")({
  component: HabitsPage,
});
