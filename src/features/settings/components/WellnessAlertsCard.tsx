import { Droplet, Eye, PersonStanding } from "lucide-react";
import { useSettingsActions } from "../settings.hooks";
import { useSettingsStore } from "../settings.store";
import type { UserSettings } from "../types";
import { Switch } from "@/components/ui/switch";

export function WellnessAlertsCard() {
  const { settings, isLoading } = useSettingsActions();
  const { draftSettings, updateDraftField } = useSettingsStore();

  if (isLoading || !settings) {
    return (
      <div className="bg-[#1c1b1d] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)] animate-pulse h-56" />
    );
  }

  const standupEnabled =
    draftSettings.wellnessStandupEnabled ?? settings.wellnessStandupEnabled;
  const hydrationEnabled =
    draftSettings.wellnessHydrationEnabled ?? settings.wellnessHydrationEnabled;
  const eyeStrainEnabled =
    draftSettings.wellnessEyeStrainEnabled ?? settings.wellnessEyeStrainEnabled;

  const updateToggle = (key: keyof UserSettings, value: boolean) => {
    updateDraftField(key, value as UserSettings[typeof key]);
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#1c1b1d] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
        <PersonStanding className="h-4 w-4 text-[#c0c1ff]" />
        Wellness Alerts
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#201f22] px-4 py-3">
          <div className="flex items-center gap-3">
            <PersonStanding className="h-4 w-4 text-[#c0c1ff]" />
            <div>
              <div className="text-[0.75rem] font-semibold text-[#f4f4f5]">
                Stand-up Reminder
              </div>
              <div className="text-[0.6875rem] text-[#8e8d92]">Every 60 minutes</div>
            </div>
          </div>
          <Switch
            checked={standupEnabled}
      
            onCheckedChange={(value) => updateToggle("wellnessStandupEnabled", value)}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#201f22] px-4 py-3">
          <div className="flex items-center gap-3">
            <Droplet className="h-4 w-4 text-[#9fa2ff]" />
            <div>
              <div className="text-[0.75rem] font-semibold text-[#f4f4f5]">Hydration Check</div>
              <div className="text-[0.6875rem] text-[#8e8d92]">2.5L daily goal</div>
            </div>
          </div>
          <Switch
            checked={hydrationEnabled}
            onCheckedChange={(value) => updateToggle("wellnessHydrationEnabled", value)}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-[#201f22] px-4 py-3">
          <div className="flex items-center gap-3">
            <Eye className="h-4 w-4 text-[#ffb783]" />
            <div>
              <div className="text-[0.75rem] font-semibold text-[#f4f4f5]">Eye Strain (20-20-20)</div>
              <div className="text-[0.6875rem] text-[#8e8d92]">Look away every 20m</div>
            </div>
          </div>
          <Switch
            checked={eyeStrainEnabled}
            onCheckedChange={(value) => updateToggle("wellnessEyeStrainEnabled", value)}
          />
        </div>
      </div>
    </div>
  );
}
