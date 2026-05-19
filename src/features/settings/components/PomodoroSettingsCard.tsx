import { Clock } from "lucide-react";
import { useSettingsActions } from "../settings.hooks";
import { useSettingsStore } from "../settings.store";
import type { UserSettings } from "../types";

export function PomodoroSettingsCard() {
  const { settings, isLoading } = useSettingsActions();
  const { draftSettings, updateDraftField } = useSettingsStore();

  if (isLoading || !settings) {
    return <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] animate-pulse h-32" />;
  }

  const pomodoroWorkMins = draftSettings.pomodoroWorkMins ?? settings.pomodoroWorkMins;
  const pomodoroBreakMins = draftSettings.pomodoroBreakMins ?? settings.pomodoroBreakMins;
  const pomodoroLongBreakMins = draftSettings.pomodoroLongBreakMins ?? settings.pomodoroLongBreakMins;

  const handleNumberChange = (key: keyof UserSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10);
      updateDraftField(key, Number.isNaN(value) ? 0 : value as UserSettings[typeof key]);
    };

  return (
    <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
        <Clock className="w-4 h-4 text-[#c0c1ff]" />
        Pomodoro Defaults
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Work
          <input
            type="number"
            min={5}
            value={pomodoroWorkMins}
            onChange={handleNumberChange("pomodoroWorkMins")}
            className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
          />
        </label>
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Break
          <input
            type="number"
            min={1}
            value={pomodoroBreakMins}
            onChange={handleNumberChange("pomodoroBreakMins")}
            className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
          />
        </label>
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Long Break
          <input
            type="number"
            min={5}
            value={pomodoroLongBreakMins}
            onChange={handleNumberChange("pomodoroLongBreakMins")}
            className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
          />
        </label>
      </div>
    </div>
  );
}
