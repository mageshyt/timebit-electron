import { Target } from "lucide-react";
import { useSettingsActions } from "../settings.hooks";
import { useSettingsStore } from "../settings.store";
import type { UserSettings } from "../types";

export function GoalsSettingsCard() {
  const { settings, isLoading } = useSettingsActions();
  const { draftSettings, updateDraftField } = useSettingsStore();

  if (isLoading || !settings) {
    return <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] animate-pulse h-32" />;
  }

  const dailyGoalTasks = draftSettings.dailyGoalTasks ?? settings.dailyGoalTasks;
  const dailyGoalHabits = draftSettings.dailyGoalHabits ?? settings.dailyGoalHabits;

  const handleNumberChange = (key: keyof UserSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10);
      updateDraftField(key, Number.isNaN(value) ? 0 : value as UserSettings[typeof key]);
    };

  return (
    <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
        <Target className="w-4 h-4 text-[#c0c1ff]" />
        Daily Goals
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Tasks per Day
          <input
            type="number"
            min={0}
            value={dailyGoalTasks}
            onChange={handleNumberChange("dailyGoalTasks")}
            className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
          />
        </label>
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Habits per Day
          <input
            type="number"
            min={0}
            value={dailyGoalHabits}
            onChange={handleNumberChange("dailyGoalHabits")}
            className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
          />
        </label>
      </div>
    </div>
  );
}
