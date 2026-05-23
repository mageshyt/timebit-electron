import React from "react";
import type { AnalyticsData } from "../types";

interface CompletionRateRadialProps {
  completionRate: AnalyticsData["completionRate"];
}

export function CompletionRateRadial({ completionRate }: CompletionRateRadialProps) {
  // Calculate SVG stroke offset for completion circle (circumference is 502)
  const strokeDashoffset = 502 - (502 * completionRate.rate) / 100;

  return (
    <div className="col-span-12 lg:col-span-4 bg-[#1c1b1d] p-6 rounded-xl flex flex-col items-center justify-center relative shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="w-full mb-6">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">Completion Rate</h3>
        <p className="text-xs text-slate-500">Tasks completed vs. scheduled</p>
      </div>
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* The Focus Ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
          <circle
            className="text-zinc-800"
            cx="96"
            cy="96"
            fill="transparent"
            r="80"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            className="text-[#c0c1ff] transition-all duration-1000 ease-out"
            cx="96"
            cy="96"
            fill="transparent"
            r="80"
            stroke="currentColor"
            strokeDasharray="502"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{completionRate.rate}%</span>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">Efficiency</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 w-full">
        <div className="text-center">
          <span className="block text-xs text-slate-500 uppercase font-bold tracking-widest">Scheduled</span>
          <span className="text-lg font-bold text-white">{completionRate.scheduled}</span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-slate-500 uppercase font-bold tracking-widest">Success</span>
          <span className="text-lg font-bold text-[#c0c1ff]">{completionRate.success}</span>
        </div>
      </div>
    </div>
  );
}
