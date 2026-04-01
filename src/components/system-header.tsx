import { BatteryFull, Radio, Zap } from "lucide-react";

export default function SystemHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>System: Online</span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="h-3 w-3 text-[#c0c1ff]" />
          <span>Latency: 24ms</span>
        </div>
        <div className="flex items-center space-x-2">
          <Radio className="h-3 w-3" />
          <span>ESP32: Connected (v1.0.4)</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <span>2023.10.24 // 14:42:08</span>
        <div className="flex items-center space-x-2">
          <BatteryFull className="h-3 w-3 text-[#c0c1ff]" />
          <span>88%</span>
        </div>
      </div>
    </header>
  );
}