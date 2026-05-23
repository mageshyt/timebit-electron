import React from "react";
import type { AnalyticsData } from "../types";

interface WeeklyFocusChartProps {
  focusDistribution: AnalyticsData["focusDistribution"];
}

export function WeeklyFocusChart({ focusDistribution }: WeeklyFocusChartProps) {
  // Max value in focus distribution to normalize heights
  const maxDayFocus = Math.max(
    ...focusDistribution.map((d) => d.deepWork + d.routine),
    0.1
  );

  return (
    <div className="col-span-12 lg:col-span-8 bg-[#1c1b1d] p-6 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-white">Weekly Focus Distribution</h3>
          <p className="text-xs text-slate-500">Activity density across primary productivity blocks.</p>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#c0c1ff]">
            <span className="w-2 h-2 rounded-full bg-[#c0c1ff]" /> Deep Work
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ffb783]">
            <span className="w-2 h-2 rounded-full bg-[#ffb783]" /> Routine
          </span>
        </div>
      </div>
      <div className="h-64 flex items-end justify-between px-4 gap-4">
        {focusDistribution.map((d) => {
          const total = d.deepWork + d.routine;
          const totalHeight = total > 0 ? Math.max(5, (total / maxDayFocus) * 100) : 4;
          const deepPercent = total > 0 ? (d.deepWork / total) * 100 : 0;

          return (
            <div key={d.day} className="flex flex-col items-center flex-1 group relative">
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10 pointer-events-none transition-all">
                <div className="bg-[#2a2a2c] text-[#e4e4e6] text-[10px] rounded px-2.5 py-1.5 shadow-xl border border-white/5 whitespace-nowrap">
                  <p className="font-bold text-center border-b border-white/5 pb-0.5 mb-1">{d.day}</p>
                  <p className="text-[#c0c1ff] font-semibold">Deep: {d.deepWork.toFixed(1)}h</p>
                  <p className="text-[#ffb783] font-semibold">Routine: {d.routine.toFixed(1)}h</p>
                  <p className="text-slate-400 border-t border-white/5 mt-1 pt-0.5">Total: {total.toFixed(1)}h</p>
                </div>
                <div className="w-1.5 h-1.5 bg-[#2a2a2c] rotate-45 -mt-1 border-r border-b border-white/5" />
              </div>

              <div
                className="w-full bg-[#ffdcc5]/5 hover:bg-[#ffdcc5]/10 rounded-t-lg relative transition-all duration-300 overflow-hidden"
                style={{ height: `${totalHeight}%` }}
              >
                {/* Deep Work Bar (Primary color gradient) */}
                <div
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#8083ff] to-[#c0c1ff] rounded-t-lg transition-all duration-500"
                  style={{ height: `${deepPercent}%` }}
                />
                {/* The remaining height is background, which represents Routine work! */}
              </div>
              <span className="mt-4 text-[10px] font-bold text-slate-500 uppercase">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
