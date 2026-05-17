import { Activity } from "lucide-react";

export function TelemetryCard() {
  return (
    <div
      className="rounded-xl p-6 flex flex-col justify-between"
      style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em]" style={{ color: "#8e8d92" }}>
          <Activity className="h-4 w-4" style={{ color: "#c0c1ff" }} />
          <span>Device Telemetry</span>
        </div>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-emerald-400">
          Live
        </span>
      </div>

      {/* Recessed effect — surface-container-lowest inside surface-container-low */}
      <div className="flex items-end justify-between p-4 rounded-lg" style={{ background: "#0e0e10" }}>
        <div>
          <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] mb-1" style={{ color: "#8e8d92" }}>Controller</div>
          <div className="text-[0.875rem] font-medium" style={{ color: "#e4e4e6" }}>ESP32-S3 Bit</div>
        </div>
        <div className="text-right">
          <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] mb-1" style={{ color: "#8e8d92" }}>Temp</div>
          <div className="text-[0.875rem] font-medium" style={{ color: "#ffb783" }}>42°C</div>
        </div>
      </div>
    </div>
  );
}
