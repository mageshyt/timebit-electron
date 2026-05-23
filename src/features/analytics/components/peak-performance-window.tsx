import React from "react";
import { Sparkles, Zap } from "lucide-react";
import type { AnalyticsData } from "../types";

interface PeakPerformanceWindowProps {
  peakWindow: AnalyticsData["peakWindow"];
  days: number;
}

export function PeakPerformanceWindow({ peakWindow, days }: PeakPerformanceWindowProps) {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div
        style={{ background: "rgba(53, 52, 55, 0.5)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
        className="col-span-12 p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      >
        <div className="flex-1 space-y-4">
          <span className="text-[0.6875rem] font-bold tracking-[0.1em] uppercase text-[#c0c1ff] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-[#c0c1ff]/20 text-[#c0c1ff]" />
            Peak Performance Window
          </span>
          <h2 className="text-3xl font-black tracking-tighter text-white leading-tight">
            Your focus spikes daily between {peakWindow.start} and {peakWindow.end}.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
            Based on your activity from the last {days} days, you are 45% more likely to complete complex tasks during your morning window. We recommend scheduling your "{peakWindow.recommendedCategory}" sessions in this block.
          </p>
        </div>
        <div className="relative w-full md:w-1/3 flex justify-center">
          <div className="w-44 h-44 rounded-full border border-[#c0c1ff]/10 flex items-center justify-center relative">
            <div className="w-36 h-36 rounded-full border border-[#c0c1ff]/20 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#c0c1ff]/5 to-[#c0c1ff]/25 flex items-center justify-center blur-sm absolute" />
              <Zap className="w-12 h-12 text-[#c0c1ff] fill-[#c0c1ff]/10 z-10 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
