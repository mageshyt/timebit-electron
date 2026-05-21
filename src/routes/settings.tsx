import { createFileRoute } from "@tanstack/react-router";
import {
  SettingsHeader,
  ProfileSettingsCard,
  GoalsSettingsCard,
  ScheduleSettingsCard,
  SyncSettingsCard,
  FocusEngineSettingsCard,
  WellnessAlertsCard,
  HabitsSettingsCard,
} from "@/features/settings/components";

function SettingsPage() {
  return (
    <div className="flex h-full w-full flex-col p-6 pb-8 overflow-y-auto">
      <SettingsHeader />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ProfileSettingsCard />
        <SyncSettingsCard />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <FocusEngineSettingsCard />
        <WellnessAlertsCard />
      </div>

      <hr className="my-8 border-white/10" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <GoalsSettingsCard />
        <ScheduleSettingsCard />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <HabitsSettingsCard />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});
