import React from "react";
import { Clock, CheckCircle, Flame, TrendingUp, TrendingDown } from "lucide-react";
import type { AnalyticsData } from "../types";
import { getPeriodLabel } from "../utils";

interface MetricsKPIsProps {
  kpis: AnalyticsData["kpis"];
  days: number;
}

export function MetricsKPIs({ kpis, days }: MetricsKPIsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Focus Time */}
      <div className="bg-[#1c1b1d] p-6 rounded-xl flex flex-col justify-between group hover:bg-[#201f22] transition-colors cursor-default relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
          <Clock className="w-28 h-28 text-[#c0c1ff]" />
        </div>
        <div className="flex justify-between items-start">
          <span className="text-[0.6875rem] font-semibold tracking-[0.05em] uppercase text-slate-500">Total Hours Focused</span>
          <Clock className="w-5 h-5 text-[#c0c1ff]" />
        </div>
        <div className="mt-4">
          <span className="text-[3.5rem] font-bold tracking-[-0.04em] leading-none text-white">{kpis.focusTime.value.toFixed(1)}</span>
          <span className="text-xl font-medium text-slate-400 ml-2">HRS</span>
          <div className="flex items-center gap-2 mt-2">
            {kpis.focusTime.change > 0 ? (
              <>
                <span className="text-emerald-500 text-xs font-bold flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +{kpis.focusTime.change}%
                </span>
                <span className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{getPeriodLabel(days)}</span>
              </>
            ) : kpis.focusTime.change < 0 ? (
              <>
                <span className="text-rose-500 text-xs font-bold flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {kpis.focusTime.change}%
                </span>
                <span className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{getPeriodLabel(days)}</span>
              </>
            ) : (
              <span className="text-slate-500 text-xs font-bold">No change vs last period</span>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Completed */}
      <div className="bg-[#1c1b1d] p-6 rounded-xl flex flex-col justify-between group hover:bg-[#201f22] transition-colors cursor-default relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
          <CheckCircle className="w-28 h-28 text-[#ffb783]" />
        </div>
        <div className="flex justify-between items-start">
          <span className="text-[0.6875rem] font-semibold tracking-[0.05em] uppercase text-slate-500">Tasks Completed</span>
          <CheckCircle className="w-5 h-5 text-[#ffb783]" />
        </div>
        <div className="mt-4">
          <span className="text-[3.5rem] font-bold tracking-[-0.04em] leading-none text-white">{kpis.tasksDone.value}</span>
          <span className="text-xl font-medium text-slate-400 ml-2">UNIT</span>
          <div className="flex items-center gap-2 mt-2">
            {kpis.tasksDone.change > 0 ? (
              <>
                <span className="text-emerald-500 text-xs font-bold flex items-center">
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                  +{kpis.tasksDone.change}%
                </span>
                <span className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{getPeriodLabel(days)}</span>
              </>
            ) : kpis.tasksDone.change < 0 ? (
              <>
                <span className="text-rose-500 text-xs font-bold flex items-center">
                  <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                  {kpis.tasksDone.change}%
                </span>
                <span className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">{getPeriodLabel(days)}</span>
              </>
            ) : (
              <span className="text-slate-500 text-xs font-bold">No change vs last period</span>
            )}
          </div>
        </div>
      </div>

      {/* Current Streak */}
      <div className="bg-[#1c1b1d] p-6 rounded-xl flex flex-col justify-between group hover:bg-[#201f22] transition-colors cursor-default relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
        <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
          <Flame className="w-28 h-28 text-[#c0c1ff]" />
        </div>
        <div className="flex justify-between items-start">
          <span className="text-[0.6875rem] font-semibold tracking-[0.05em] uppercase text-slate-500">Current Streak</span>
          <Flame className="w-5 h-5 text-[#c0c1ff] fill-[#c0c1ff]" />
        </div>
        <div className="mt-4">
          <span className="text-[3.5rem] font-bold tracking-[-0.04em] leading-none text-white">{kpis.streak.value}</span>
          <span className="text-xl font-medium text-slate-400 ml-2">DAYS</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#c0c1ff] text-xs font-bold">Personal Best: {kpis.streak.best} Days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
