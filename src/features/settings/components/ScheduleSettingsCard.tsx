import { Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettingsActions } from "../settings.hooks";
import { useSettingsStore } from "../settings.store";

const TIME_OPTIONS = Array.from({ length: 24 * 2 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? 0 : 30;
  const hourLabel = ((hour + 11) % 12) + 1;
  const suffix = hour < 12 ? "AM" : "PM";
  const value = `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
  return {
    value,
    label: `${hourLabel}:${minute.toString().padStart(2, "0")} ${suffix}`,
  };
});

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
          <Select
            value={wakeTime}
            onValueChange={(value) => updateDraftField("wakeTime", value)}
          >
            <SelectTrigger className="mt-2 w-full bg-[#201f22] text-[#e4e4e6] focus:ring-[#c0c1ff]/40">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Sleep Time
          <Select
            value={sleepTime}
            onValueChange={(value) => updateDraftField("sleepTime", value)}
          >
            <SelectTrigger className="mt-2 w-full bg-[#201f22] text-[#e4e4e6] focus:ring-[#c0c1ff]/40">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {TIME_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>
      </div>
    </div>
  );
}
