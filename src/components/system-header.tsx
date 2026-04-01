import { SystemStatus } from "./system-header/system-status";
import { Latency } from "./system-header/latency";
import { Esp32Status } from "./system-header/esp32-status";
import { TimeDisplay } from "./system-header/time-display";
import { BatteryStatus } from "./system-header/battery-status";

export default function SystemHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
      <div className="flex items-center space-x-6">
        <SystemStatus />
        <Latency />
        <Esp32Status />
      </div>
      <div className="flex items-center space-x-6">
        <TimeDisplay />
        <BatteryStatus />
      </div>
    </header>
  );
}