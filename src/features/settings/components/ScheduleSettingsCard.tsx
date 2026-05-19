import { Clock } from "lucide-react";
import { useSettingsActions } from "../settings.hooks";
import { useSettingsStore } from "../settings.store";

export function ScheduleSettingsCard() {
  const { settings, isLoading } = useSettingsActions();
  const { draftSettings, updateDraftField } = useSettingsStore();

  if (isLoading || !settings) {
    return <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] animate-pulse h-32" />;
  }

  const wakeTime = draftSettings.wakeTime ?? settings.wakeTime;
  const sleepTime = draftSettings.sleepTime ?? settings.sleepTime;

  return (
    <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
        <Clock className="w-4 h-4 text-[#c0c1ff]" />
        Schedule
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Wake Time
          <input
            type="time"
            value={wakeTime}
            onChange={(event) => updateDraftField("wakeTime", event.target.value)}
            className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
          />
        </label>
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Sleep Time
          <input
            type="time"
            value={sleepTime}
            onChange={(event) => updateDraftField("sleepTime", event.target.value)}
            className="mt-2 w-full rounded-md border-0 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
          />
        </label>
      </div>
    </div>
  );
}
