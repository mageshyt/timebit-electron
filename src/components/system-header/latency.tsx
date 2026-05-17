import { Zap } from "lucide-react";
import { useSyncStatus } from "@/state/sync-status";

export function Latency() {
  const {
    state: { latencyMs },
  } = useSyncStatus();

  const label = latencyMs === null ? "Latency: --" : `Latency: ${latencyMs}ms`;

  return (
    <div className="flex items-center space-x-2">
      <Zap className="h-3 w-3 text-[#c0c1ff]" />
      <span>{label}</span>
    </div>
  );
}