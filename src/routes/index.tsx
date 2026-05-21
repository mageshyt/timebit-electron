import { createFileRoute } from "@tanstack/react-router";
import { FocusTimer } from "@/features/dashboard/components/focus-timer/focus-timer";
import { HabitEngine } from "@/features/dashboard/components/habit-engine";
import { SessionHistory } from "@/features/dashboard/components/session-history";

function HomePage() {
  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex flex-1 flex-col p-6 pb-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1
              className="text-[1.5rem] font-semibold tracking-[-0.02em] mb-2"
              style={{ color: "#f4f4f5" }}
            >
              Focus Protocol
            </h1>
            <div
              className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
              style={{ color: "#8e8d92" }}
            >
              Track every session. Build the streak.
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 max-h-160">
          {/* Left Column — Timer */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FocusTimer />
          </div>

          {/* Right Column — Habits + Session Log */}
          <div className="flex flex-col gap-6">
            <HabitEngine />
            <SessionHistory />
          </div>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
