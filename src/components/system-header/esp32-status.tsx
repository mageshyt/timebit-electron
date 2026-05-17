import { Radio } from "lucide-react";
import { useSyncStatus } from "@/state/sync-status";

export function Esp32Status() {
  const {
    state: { esp32Connected, esp32Version },
  } = useSyncStatus();

  const label = esp32Connected ? "ESP32: Connected" : "ESP32: Offline";
  const versionSuffix = esp32Version ? ` (v${esp32Version})` : "";

  return (
    <div className="flex items-center space-x-2">
      <Radio className={esp32Connected ? "h-3 w-3 text-emerald-400" : "h-3 w-3 text-rose-400"} />
      <span>{`${label}${versionSuffix}`}</span>
    </div>
  );
}