import { useSyncStatus } from "@/state/sync-status";

export function SystemStatus() {
  const {
    state: { systemOnline },
  } = useSyncStatus();

  const label = systemOnline ? "System: Online" : "System: Offline";
  const dotClass = systemOnline ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div className="flex items-center space-x-2">
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`}></span>
      <span>{label}</span>
    </div>
  );
}