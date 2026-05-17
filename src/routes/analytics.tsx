import { createFileRoute } from "@tanstack/react-router";
import { BarChart2, TrendingUp, Clock, Zap } from "lucide-react";

function AnalyticsPage() {
  const weekData = [65, 80, 45, 90, 72, 30, 55];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const maxVal = Math.max(...weekData);

  return (
    <div className="flex h-full w-full flex-col p-6 pb-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-[#f4f4f5] mb-2">
            Analytics
          </h1>
          <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
            Weekly performance —{" "}
            <span className="text-[#c0c1ff]">↑ 12% vs last week</span>
          </div>
        </div>
        <button className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-4 py-2 rounded-md bg-[#2a2a2c] text-[#e4e4e6] hover:bg-[#353437] transition-colors">
          Export Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {[
          { label: "Total Focus Time", value: "32h 14m", icon: Clock, color: "#c0c1ff" },
          { label: "Productivity Index", value: "94.8%", icon: TrendingUp, color: "#8083ff" },
          { label: "Sessions Completed", value: "47", icon: Zap, color: "#ffb783" },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-[#1c1b1d] rounded-xl p-6 flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
            >
              <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                {kpi.label}
              </div>
              <span
                className="text-[2rem] font-bold tracking-[-0.04em]"
                style={{ color: "#f4f4f5" }}
              >
                {kpi.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Focus Time Bar Chart */}
      <div className="bg-[#1c1b1d] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex-1">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-6 block">
          Daily Focus Minutes
        </span>
        <div className="flex items-end gap-3 h-40">
          {weekData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[0.6875rem] font-semibold tracking-[0.05em] text-[#8e8d92]">
                {val}m
              </span>
              <div className="w-full rounded-md overflow-hidden" style={{ height: "120px", background: "#201f22" }}>
                <div
                  className="w-full rounded-md transition-all duration-700"
                  style={{
                    height: `${(val / maxVal) * 100}%`,
                    marginTop: `${100 - (val / maxVal) * 100}%`,
                    background:
                      val === maxVal
                        ? "linear-gradient(135deg, #c0c1ff, #8083ff)"
                        : "#353437",
                    boxShadow:
                      val === maxVal
                        ? "0 0 16px rgba(192,193,255,0.2)"
                        : "none",
                  }}
                />
              </div>
              <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61]">
                {days[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
});
