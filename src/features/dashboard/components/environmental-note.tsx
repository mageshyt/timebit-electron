import { Lightbulb } from "lucide-react";

export function EnvironmentalNote() {
  return (
    <div
      className="rounded-xl p-5 flex items-start space-x-4 relative overflow-hidden"
      style={{ background: "#201f22", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "rgba(128,131,255,0.5)" }} />

      <div className="p-2 rounded-lg" style={{ background: "#1c1b1d" }}>
        <Lightbulb className="h-4 w-4" style={{ color: "#ffb783" }} />
      </div>

      <div>
        <h4 className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] mb-1" style={{ color: "#e4e4e6" }}>
          Environmental Note
        </h4>
        <p className="text-[0.875rem]" style={{ color: "#8e8d92" }}>
          Current ambient noise levels are low (24dB). Perfect window for deep architectural reasoning.
        </p>
      </div>
    </div>
  );
}
