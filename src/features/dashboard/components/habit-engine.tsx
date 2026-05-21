import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useHabitActions } from "@/features/habits/habit.hooks";
import { playCheckSound } from "@/utils/sound";

export function HabitEngine() {
  const { habits, summary, isLoading, toggleHabitAsync } = useHabitActions();

  const completedCount = summary.completed;
  const totalCount = summary.total;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (isLoading) {
    return (
      <div
        className="rounded-xl p-6 animate-pulse"
        style={{ background: "#1c1b1d", height: 200 }}
      />
    );
  }

  // Show at most 5 habits, prioritise incomplete ones first
  const sorted = [...habits].sort((a, b) => {
    const aDone = a.done ? 1 : 0;
    const bDone = b.done ? 1 : 0;
    return aDone - bDone;
  });
  const visible = sorted.slice(0, 5);

  return (
    <div
      className="rounded-xl p-6"
      style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <span
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
          style={{ color: "#8e8d92" }}
        >
          Habit Engine
        </span>
        <span
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-2 py-1 rounded-md"
          style={{ background: "#201f22", color: "#8083ff" }}
        >
          {pct}% Complete
        </span>
      </div>

      {visible.length === 0 ? (
        <div
          className="text-center py-6 text-[0.75rem]"
          style={{ color: "#5c5b61" }}
        >
          No habits yet — add some in Habits.
        </div>
      ) : (
        <div className="space-y-[0.9rem]">
          {visible.map((h) => {
            const done = h.done;
            return (
              <button
                key={h.id}
                type="button"
                onClick={async () => {
                  try {
                    const result = await toggleHabitAsync(h.id);
                    playCheckSound(result.data.done);
                  } catch {
                    // ignore
                  }
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg text-[0.875rem] text-left transition-colors cursor-pointer hover:brightness-110"
                style={{
                  background: "#201f22",
                }}
              >
                <div
                  className="flex items-center space-x-3"
                  style={{ color: done ? "#5c5b61" : "#e4e4e6" }}
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#8083ff" }} />
                  ) : (
                    <Circle className="h-5 w-5 flex-shrink-0" style={{ color: "#8e8d92" }} />
                  )}
                  <span
                    style={{
                      textDecoration: done ? "line-through" : "none",
                      fontWeight: 400,
                    }}
                  >
                    {h.title}
                  </span>
                </div>
                {h.category ? (
                  <span
                    className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] ml-2 flex-shrink-0"
                    style={{ color: done ? "#5c5b61" : "#8e8d92" }}
                  >
                    {h.category}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      <Link
        to="/habits"
        className="w-full mt-6 py-3 rounded-lg text-[0.6875rem] font-semibold uppercase tracking-[0.05em] transition-colors flex items-center justify-center gap-2"
        style={{ background: "#201f22", color: "#c0c1ff" }}
      >
        Manage Habits
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
