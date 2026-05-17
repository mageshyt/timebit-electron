import { Zap } from "lucide-react";

export function IntelligenceFeed() {
  return (
    <div
      className="rounded-xl p-6 flex flex-col justify-between"
      style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center space-x-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] mb-4" style={{ color: "#8e8d92" }}>
        <Zap className="h-4 w-4" style={{ color: "#c0c1ff" }} />
        <span>Intelligence Feed</span>
      </div>

      <div
        className="p-4 rounded-lg"
        style={{
          background: "#201f22",
          boxShadow: "0 0 0 1px rgba(70,69,84,0.2)",
        }}
      >
        <p className="text-[0.875rem] leading-relaxed" style={{ color: "#e4e4e6" }}>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] mr-2" style={{ color: "#8083ff" }}>
            Insight:
          </span>
          Cognitive load peaking. Suggesting 2m hydration break in 15 mins.
        </p>
      </div>
    </div>
  );
}
