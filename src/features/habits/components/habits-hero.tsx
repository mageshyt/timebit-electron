export function HabitsHero() {
  return (
    <section 
      className="group relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl p-8 md:flex-row"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#c0c1ff]/10 blur-[80px] transition-colors duration-700 group-hover:bg-[#c0c1ff]/20"
      />
      
      <div className="relative z-10 max-w-xl">
        <span className="mb-3 block text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[#c0c1ff]">
          Daily Momentum
        </span>
        <h2 className="text-3xl font-light leading-tight text-[#f4f4f5]">
          "The way to get started is to quit talking and{" "}
          <span className="italic font-medium text-[#c0c1ff]">begin doing</span>."
        </h2>
        <p className="mt-4 text-sm italic text-[#8e8d92]">— Walt Disney</p>
      </div>

      <div
        className="relative z-10 w-full min-w-[200px] rounded-2xl p-6 text-center md:w-auto"
        style={{
          background: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <div className="mb-1 text-4xl font-bold text-[#f4f4f5]">
          08:42
        </div>
        <div className="text-[0.625rem] font-bold uppercase tracking-widest text-[#8e8d92]">
          Peak Morning Flow
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <span className="flex items-center justify-center gap-1 text-[0.6875rem] text-[#c0c1ff]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
            Consistency is up 12%
          </span>
        </div>
      </div>
    </section>
  );
}
