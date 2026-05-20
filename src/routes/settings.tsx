import { createFileRoute } from "@tanstack/react-router";
import {
  SettingsHeader,
  ProfileSettingsCard,
  GoalsSettingsCard,
  ScheduleSettingsCard,
  PomodoroSettingsCard,
  SyncSettingsCard,
  HabitsSettingsCard,
} from "@/features/settings/components";

function SettingsPage() {
  return (
    <div className="flex h-full w-full flex-col p-6 pb-8 overflow-y-auto">
      <SettingsHeader />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <ProfileSettingsCard />
          <GoalsSettingsCard />
          <ScheduleSettingsCard />
        </div>

        <div className="flex flex-col gap-6">
          <PomodoroSettingsCard />
          <SyncSettingsCard />
        </div>
      </div>

      <hr className="my-8 border-white/10" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <HabitsSettingsCard />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});
