import React from "react";
import type { AnalyticsData } from "../types";
import { getCategoryIcon, getCategoryColors, formatRelativeTime } from "../utils";

interface RecentSessionsListProps {
  recentSessions: AnalyticsData["recentSessions"];
}

export function RecentSessionsList({ recentSessions }: RecentSessionsListProps) {
  return (
    <div className="col-span-12 lg:col-span-5 bg-[#1c1b1d] p-6 rounded-xl h-fit flex flex-col shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
      <h3 className="text-lg font-semibold tracking-[-0.02em] text-white mb-6">Recent Sessions</h3>
      <div className="space-y-3.5 flex-1 pr-1 overflow-y-auto max-h-[350px]">
        {recentSessions.length > 0 ? (
          recentSessions.map((session) => {
            const Icon = getCategoryIcon(session.category);
            const colors = getCategoryColors(session.category);

            return (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">{session.title}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                      {formatRelativeTime(session.startedAt)} • {session.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${session.outcome === "Focused" ? "text-[#c0c1ff]" : "text-[#ffb783]"}`}>
                    {session.outcome}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
            <p className="text-sm">No recent focus sessions</p>
          </div>
        )}
      </div>
    </div>
  );
}
