import { useState } from "react";
import { Cpu, Wifi, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { ipc } from "@/ipc/manager";
import { useSyncStatus } from "@/state/sync-status";
import { useSettingsActions } from "../settings.hooks";
import { useSettingsStore } from "../settings.store";

export function SyncSettingsCard() {
  const { settings, isLoading } = useSettingsActions();
  const { draftSettings, updateDraftField } = useSettingsStore();
  const { state } = useSyncStatus();
  const [isSyncing, setIsSyncing] = useState(false);

  if (isLoading || !settings) {
    return <div className="bg-[#1c1b1d] rounded-xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.2)] animate-pulse h-32" />;
  }

  const deviceWifiSsid = draftSettings.deviceWifiSsid ?? settings.deviceWifiSsid;
  const deviceWifiPassword = draftSettings.deviceWifiPassword ?? settings.deviceWifiPassword;
  const connectionLabel = state.esp32Connected ? "Connected" : "Offline";

  const handleSync = async () => {
    if (!deviceWifiSsid.trim() || !deviceWifiPassword.trim()) {
      toast.error("Missing Wi-Fi details", {
        description: "Add both the SSID and password before syncing.",
      });
      return;
    }

    if (isSyncing) {
      return;
    }

    setIsSyncing(true);
    try {
      await ipc.client.app.emitWsEvent({
        type: "settings:device-sync",
        payload: {
          ssid: deviceWifiSsid,
          password: deviceWifiPassword,
        },
      });
      toast.success("Sync queued for hardware", {
        description: `Sending ${deviceWifiSsid} to the device.`,
      });
    } catch {
      toast.error("Unable to sync hardware", {
        description: "Check the device connection and try again.",
      });
    } finally {
      window.setTimeout(() => setIsSyncing(false), 300);
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-[#1c1b1d] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
            <Cpu className="h-4 w-4 text-[#c0c1ff]" />
            Device Sync
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/10 bg-[#201f22] px-3 py-2">
            <span className="h-2 w-2 rounded-full" style={{ background: state.esp32Connected ? "#34d399" : "#5c5b61" }} />
            <div className="text-[0.75rem] text-[#e4e4e6]">ESP32-Focus-A1</div>
            <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[#8e8d92]">
              {connectionLabel}
            </span>
          </div>
        </div>
        {state.esp32Version ? (
          <div className="rounded-full border border-white/10 px-3 py-1 text-[0.625rem] uppercase tracking-[0.1em] text-[#8e8d92]">
            FW: {state.esp32Version}
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4">
        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Network SSID
          <input
            value={deviceWifiSsid}
            onChange={(event) => updateDraftField("deviceWifiSsid", event.target.value)}
            placeholder="Chronos_Main_5G"
            className="mt-2 w-full rounded-md border border-white/5 bg-[#201f22] px-3 py-2 text-[0.8125rem] text-[#e4e4e6] outline-none focus:ring-1 focus:ring-[#c0c1ff]/40"
          />
        </label>

        <label className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
          Access Password
          <div className="mt-2 flex items-center gap-2 rounded-md border border-white/5 bg-[#201f22] px-3 py-2">
            <KeyRound className="h-4 w-4 text-[#5c5b61]" />
            <input
              type="password"
              value={deviceWifiPassword}
              onChange={(event) => updateDraftField("deviceWifiPassword", event.target.value)}
              placeholder="Enter network key"
              className="w-full bg-transparent text-[0.8125rem] text-[#e4e4e6] outline-none placeholder:text-[#5c5b61]"
            />
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={handleSync}
        disabled={isSyncing}
        className="mt-5 w-full rounded-lg border border-white/10 bg-[#f4f4f5] px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#131315] hover:opacity-90 disabled:opacity-60"
      >
        {isSyncing ? "Syncing..." : "Sync Hardware"}
      </button>

      <div className="mt-3 flex items-center gap-2 text-[0.6875rem] text-[#8e8d92]">
        <Wifi className="h-3.5 w-3.5" />
        Credentials are sent over the local socket only.
      </div>
    </div>
  );
}
