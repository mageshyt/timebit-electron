import { Gauge } from "lucide-react";
import { useSettingsActions } from "../settings.hooks";
import { useSettingsStore } from "../settings.store";
import type { UserSettings } from "../types";

const DEFAULTS = {
  focusDurationMins: 25,
  focusShortBreakMins: 5,
  focusLongBreakMins: 15,
} as const;

export function FocusEngineSettingsCard() {
  const { settings, isLoading } = useSettingsActions();
  const { draftSettings, updateDraftField } = useSettingsStore();

  if (isLoading || !settings) {
    return (
      <div className="bg-[#1c1b1d] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)] animate-pulse h-56" />
    );
  }

  const focusDurationMins = draftSettings.focusDurationMins ?? settings.focusDurationMins;
  const focusShortBreakMins = draftSettings.focusShortBreakMins ?? settings.focusShortBreakMins;
  const focusLongBreakMins = draftSettings.focusLongBreakMins ?? settings.focusLongBreakMins;

  const handleNumberChange = (key: keyof UserSettings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10);
      updateDraftField(key, Number.isNaN(value) ? 0 : value as UserSettings[typeof key]);
    };

  const handleReset = () => {
    updateDraftField("focusDurationMins", DEFAULTS.focusDurationMins);
    updateDraftField("focusShortBreakMins", DEFAULTS.focusShortBreakMins);
    updateDraftField("focusLongBreakMins", DEFAULTS.focusLongBreakMins);
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#1c1b1d] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          <Gauge className="h-4 w-4 text-[#c0c1ff]" />
          Focus Engine
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#8083ff] hover:text-[#c0c1ff]"
        >
          Reset Defaults
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <div className="flex items-center justify-between text-[0.75rem] text-[#8e8d92]">
            <span>Focus Duration</span>
            <span className="text-[#f4f4f5]">{focusDurationMins} min</span>
          </div>
          <input
            type="range"
            min={10}
            max={90}
            step={5}
            value={focusDurationMins}
            onChange={handleNumberChange("focusDurationMins")}
            className="mt-3 w-full accent-[#c0c1ff]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-[0.75rem] text-[#8e8d92]">
            <span>Short Break</span>
            <span className="text-[#f4f4f5]">{focusShortBreakMins} min</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={focusShortBreakMins}
            onChange={handleNumberChange("focusShortBreakMins")}
            className="mt-3 w-full accent-[#c0c1ff]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-[0.75rem] text-[#8e8d92]">
            <span>Long Break</span>
            <span className="text-[#f4f4f5]">{focusLongBreakMins} min</span>
          </div>
          <input
            type="range"
            min={5}
            max={45}
            step={5}
            value={focusLongBreakMins}
            onChange={handleNumberChange("focusLongBreakMins")}
            className="mt-3 w-full accent-[#c0c1ff]"
          />
        </div>
      </div>
    </div>
  );
}
