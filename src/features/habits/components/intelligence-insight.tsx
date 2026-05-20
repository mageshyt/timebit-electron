import { Sparkles } from "lucide-react";

export function IntelligenceInsight() {
  return (
    <section
      className="rounded-2xl p-6 flex h-full flex-col justify-between"
      style={{
        background: "linear-gradient(135deg, #c2c4ff 0%, #9fa2ff 100%)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.22)",
      }}
    >
      <div>
        <div className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#2a2a2c]">
          <Sparkles className="h-4 w-4" />
          Intelligence Insight
        </div>
        <p className="mt-4 text-[0.9rem] leading-relaxed text-[#1c1b1d]">
          Your cognitive peak is currently 10:30 AM. Schedule your Deep Work protocol
          accordingly.
        </p>
      </div>

      <button
        className="mt-6 w-full rounded-lg px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.06em]"
        style={{ background: "#1c1b1d", color: "#f4f4f5" }}
      >
        View Optimization Plan
      </button>
    </section>
  );
}
