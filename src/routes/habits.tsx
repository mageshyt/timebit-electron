import { createFileRoute } from "@tanstack/react-router";
import { HabitsHero } from "@/features/habits/components/habits-hero";
import { ProtocolConsistencyGrid } from "@/features/habits/components/protocol-consistency-grid";
import {
  WaterIntakeCard,
  RecoverySessionCard,
} from "@/features/habits/components/protocol-details";

function HabitsPage() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-6 pb-8">
      <div className="flex flex-col gap-6">
        <HabitsHero />
        <ProtocolConsistencyGrid />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <WaterIntakeCard />
          <RecoverySessionCard />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/habits")({
  component: HabitsPage,
});
