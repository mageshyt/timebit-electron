import React from "react";
import type { AnalyticsData } from "../types";

interface HabitConsistencyHeatmapProps {
  habitConsistency: AnalyticsData["habitConsistency"];
}

export function HabitConsistencyHeatmap({ habitConsistency }: HabitConsistencyHeatmapProps) {
  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="col-span-12 lg:col-span-7 bg-[#1c1b1d] p-6 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">Habit Consistency</h3>
          <p className="text-xs text-slate-500">Daily habit log completions over the last 5 weeks.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-800/40 border border-zinc-700/10" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#c0c1ff]/15 border border-[#c0c1ff]/5" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#c0c1ff]/45 border border-[#c0c1ff]/10" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#c0c1ff]/75 border border-[#c0c1ff]/20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#c0c1ff]" />
          <span className="text-[10px] text-slate-500 font-bold ml-1.5 uppercase">Intensity</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2.5">
        {weekdays.map((day, dIdx) => (
          <div key={day} className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 block text-center mb-1">{day}</span>
            {habitConsistency[dIdx]?.map((intensity: number, wIdx: number) => {
              let bgClass = "bg-zinc-800/40 border border-zinc-700/10";
              if (intensity > 0) {
                if (intensity <= 0.3) bgClass = "bg-[#c0c1ff]/15 border border-[#c0c1ff]/5";
                else if (intensity <= 0.6) bgClass = "bg-[#c0c1ff]/45 border border-[#c0c1ff]/10";
                else if (intensity <= 0.8) bgClass = "bg-[#c0c1ff]/75 border border-[#c0c1ff]/20";
                else bgClass = "bg-[#c0c1ff]";
              }
              return (
                <div
                  key={wIdx}
                  className={`aspect-square rounded-md transition-all duration-200 cursor-pointer ${bgClass} hover:ring-1 hover:ring-indigo-400/40`}
                  title={`Week ${wIdx + 1} ${day}: ${Math.round(intensity * 100)}% consistency`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
