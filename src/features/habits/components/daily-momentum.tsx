import { Zap } from "lucide-react";

const METRICS = [
  { label: "Current Streak", value: "14", suffix: "Days" },
  { label: "Consistency", value: "98.2", suffix: "%" },
  { label: "Active Protocols", value: "08", suffix: "" },
];

export function DailyMomentum() {
  return (
    <section
      className="rounded-2xl p-6"
      style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
            System Performance
          </div>
          <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em] text-[#f4f4f5]">
            Daily Momentum
          </h2>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: "#201f22", color: "#8083ff" }}
        >
          <Zap className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {METRICS.map((metric) => (
          <div key={metric.label}>
            <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
              {metric.label}
            </div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-[1.75rem] font-semibold tracking-[-0.03em] text-[#f4f4f5]">
                {metric.value}
              </span>
              {metric.suffix ? (
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                  {metric.suffix}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
