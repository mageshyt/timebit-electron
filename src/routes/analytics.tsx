import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, Check } from "lucide-react";
import { useAnalytics } from "@/features/analytics/analytics.hooks";
import { MetricsKPIs } from "@/features/analytics/components/metrics-kpis";
import { WeeklyFocusChart } from "@/features/analytics/components/weekly-distribution-chart";
import { CompletionRateRadial } from "@/features/analytics/components/completion-rate-radial";
import { HabitConsistencyHeatmap } from "@/features/analytics/components/habit-consistency-heatmap";
import { RecentSessionsList } from "@/features/analytics/components/recent-sessions-list";
import { PeakPerformanceWindow } from "@/features/analytics/components/peak-performance-window";

function AnalyticsPage() {
  const [days, setDays] = useState<number>(7);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close range selector dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data, isLoading, error } = useAnalytics(days);

  const ranges = [
    { label: "Last 7 Days", value: 7 },
    { label: "Last 14 Days", value: 14 },
    { label: "Last 30 Days", value: 30 },
  ];

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-zinc-800/60 rounded-md" />
            <div className="h-4 w-96 bg-zinc-800/60 rounded-md" />
          </div>
          <div className="h-10 w-36 bg-zinc-800/60 rounded-md" />
        </div>
        {/* KPI Skeleton */}
        <div className="grid grid-cols-3 gap-6">
          <div className="h-32 bg-zinc-900/60 rounded-xl" />
          <div className="h-32 bg-zinc-900/60 rounded-xl" />
          <div className="h-32 bg-zinc-900/60 rounded-xl" />
        </div>
        {/* Charts Skeleton */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 h-80 bg-zinc-900/60 rounded-xl" />
          <div className="col-span-4 h-80 bg-zinc-900/60 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <p className="text-rose-500 font-semibold">Error loading metrics dashboard</p>
        <p className="text-slate-400 text-sm">Make sure the sync server is running on port 5719</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 select-none animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Analytics Overview</h1>
          <p className="text-slate-400 text-xs mt-1">Real-time analytical breakdown of focus efficiency and output.</p>
        </div>
        <div className="flex gap-3 relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-4 py-2.5 bg-[#2a2a2c] hover:bg-[#353437] text-[#e4e4e6] text-xs font-semibold rounded-lg transition-all flex items-center gap-2 border border-white/5 active:scale-95 duration-100"
          >
            <Calendar className="w-3.5 h-3.5 text-[#c0c1ff]" />
            <span>{ranges.find((r) => r.value === days)?.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-[#1c1b1d] border border-white/10 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {ranges.map((r) => (
                <button
                  key={r.value}
                  onClick={() => {
                    setDays(r.value);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-[#e4e4e6] hover:bg-[#c0c1ff]/10 hover:text-[#c0c1ff] transition-colors flex items-center justify-between"
                >
                  <span>{r.label}</span>
                  {days === r.value && <Check className="w-3.5 h-3.5 text-[#c0c1ff]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KEY METRICS Row */}
      <MetricsKPIs kpis={data.kpis} days={days} />

      {/* MAIN DATA GRID (Bento Style) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Weekly Focus Distribution Chart */}
        <WeeklyFocusChart focusDistribution={data.focusDistribution} />

        {/* Completion Rate Radial */}
        <CompletionRateRadial completionRate={data.completionRate} />

        {/* Habit Consistency Heatmap */}
        <HabitConsistencyHeatmap habitConsistency={data.habitConsistency} />

        {/* Deep Work Sessions List */}
        <RecentSessionsList recentSessions={data.recentSessions} />
      </div>

      {/* ASYMMETRIC SECONDARY ROW: Activity Insights (Glass Card) */}
      <PeakPerformanceWindow peakWindow={data.peakWindow} days={days} />
    </div>
  );
}

export const Route = createFileRoute("/analytics")({
  component: AnalyticsPage,
});
