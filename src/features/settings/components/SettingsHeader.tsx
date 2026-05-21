import { useState } from "react";
import { useSettingsActions } from "../settings.hooks";
import { useSettingsStore } from "../settings.store";

export function SettingsHeader() {
  const { updateSettings, isSaving } = useSettingsActions();
  const { draftSettings } = useSettingsStore();
  const [saveLabel, setSaveLabel] = useState<string | null>(null);

  const handleSave = async () => {
    if (Object.keys(draftSettings).length === 0) {
      setSaveLabel("No changes to save");
      window.setTimeout(() => setSaveLabel(null), 2500);
      return;
    }

    try {
      await updateSettings(draftSettings);
      setSaveLabel(`Saved at ${new Date().toLocaleTimeString()}`);
    } catch {
      setSaveLabel("Failed to save settings");
    }
    window.setTimeout(() => setSaveLabel(null), 2500);
  };

  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-[#f4f4f5] mb-2">
          Settings
        </h1>
        <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Configure your workspace and focus preferences.
        </div>
      </div>
      <div className="flex items-center gap-3">
        {saveLabel ? (
          <span className="text-[0.75rem] text-[#8e8d92]">{saveLabel}</span>
        ) : null}
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-md bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#131315] hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
