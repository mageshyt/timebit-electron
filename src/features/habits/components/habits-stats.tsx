const STATS = [
  { label: "Sleep Efficiency", value: "94%", detail: "+2% vs LW" },
  { label: "Meditation Minutes", value: "120", detail: "Weekly Total" },
  { label: "Read Pages", value: "42", detail: "Daily Avg" },
  { label: "HRV Base", value: "78ms", detail: "-5ms stress" },
];

export function HabitsStats() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl p-4"
          style={{ background: "#1c1b1d", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}
        >
          <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
            {stat.label}
          </div>
          <div className="mt-2 text-[1.4rem] font-semibold tracking-[-0.03em] text-[#f4f4f5]">
            {stat.value}
          </div>
          <div className="text-[0.6875rem] text-[#8e8d92]">{stat.detail}</div>
        </div>
      ))}
    </section>
  );
}
