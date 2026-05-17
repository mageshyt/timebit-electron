import { createFileRoute } from "@tanstack/react-router";
import { FocusTimer } from "@/features/dashboard/components/focus-timer/focus-timer";
import { TelemetryCard } from "@/features/dashboard/components/telemetry-card";
import { IntelligenceFeed } from "@/features/dashboard/components/intelligence-feed";
import { HabitEngine } from "@/features/dashboard/components/habit-engine";
import { UpcomingAgenda } from "@/features/dashboard/components/upcoming-agenda";
import { EnvironmentalNote } from "@/features/dashboard/components/environmental-note";

function HomePage() {
  return (
    <div className="flex h-full w-full flex-col">
      <main className="flex flex-1 flex-col p-6 pb-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] mb-2" style={{ color: "#f4f4f5" }}>
              Focus Protocol
            </h1>
            <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]" style={{ color: "#8e8d92" }}>
              Current Module:{" "}
              <span style={{ color: "#c0c1ff" }}>Design Engineering</span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <FocusTimer />
            <div className="grid grid-cols-2 gap-6">
              <TelemetryCard />
              <IntelligenceFeed />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <HabitEngine />
            <UpcomingAgenda />
            <EnvironmentalNote />
          </div>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
