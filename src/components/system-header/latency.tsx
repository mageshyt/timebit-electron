import { Zap } from "lucide-react";

export function Latency() {
  return (
    <div className="flex items-center space-x-2">
      <Zap className="h-3 w-3 text-[#c0c1ff]" />
      <span>Latency: 24ms</span>
    </div>
  );
}