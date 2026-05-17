/** Fully static — renders once, never re-renders. */
export function TimerStats() {
  const stats = [
    { label: "Avg. Focus BPM", value: "72" },
    { label: "Productivity Index", value: "94.8%" },
    { label: "Est. Completion", value: "15:30" },
  ];

  return (
    <div
      className="grid grid-cols-3 rounded-xl p-4 mt-auto"
      style={{ background: "rgba(19,19,21,0.5)" }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center justify-center">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] mb-1" style={{ color: "#8e8d92" }}>
            {stat.label}
          </span>
          <span className="text-[1.125rem] font-medium" style={{ color: "#e4e4e6" }}>
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  );
}
