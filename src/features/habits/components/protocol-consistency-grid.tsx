import { useState } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useHabitActions } from "../habit.hooks";
import { LogProtocolDialog } from "./log-protocol-dialog";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_STYLE: Record<string, { background: string; opacity?: number }> = {
  missed: { background: "#2a2a2c", opacity: 0.6 },
  partial: { background: "#5c5b61" },
  optimized: { background: "linear-gradient(135deg, #c0c1ff, #9fa2ff)" },
};

const GRID_TEMPLATE = "minmax(170px, 1.6fr) repeat(7, minmax(0, 1fr)) 60px";


export function ProtocolConsistencyGrid() {
  const { habits, isLoading, toggleHabit } = useHabitActions();

  if (isLoading) {
    return (
      <section
        className="rounded-2xl p-6 animate-pulse h-64"
        style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
      />
    );
  }

  return (
    <section
      className="rounded-2xl p-6"
      style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-[0.875rem] font-semibold text-[#f4f4f5]">
          Protocol Consistency Grid
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#2a2a2c" }} />
              Missed
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#5c5b61" }} />
              Partial
            </div>
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: "linear-gradient(135deg, #c0c1ff, #9fa2ff)" }}
              />
              Optimized
            </div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <LogProtocolDialog habits={habits} toggleHabit={toggleHabit} />
        </div>
      </div>

      <div className="mt-6">
        <div
          className="grid items-center gap-2 pb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]"
          style={{ gridTemplateColumns: GRID_TEMPLATE }}
        >
          <span>Protocol Name</span>
          {DAYS.map((day) => (
            <span key={day} className="text-center">
              {day}
            </span>
          ))}
          <span className="text-center">Trend</span>
        </div>

        <div className="space-y-3">
          {habits.map((protocol) => {
            const countOptimized = protocol.history?.filter((h: string) => h === "optimized").length ?? 0;
            const trend = countOptimized > 4 ? "up" : countOptimized > 2 ? "flat" : "down";

            return (
              <div
                key={protocol.id}
                className="grid items-center gap-2 rounded-xl px-4 py-3"
                style={{ gridTemplateColumns: GRID_TEMPLATE, background: "#201f22" }}
              >
                <span className="text-[0.8125rem] text-[#e4e4e6] truncate">{protocol.title}</span>
                {protocol.history?.map((value: string, index: number) => (
                  <div
                    key={`${protocol.id}-${DAYS[index]}`}
                    className="mx-auto h-4 w-4 rounded-md"
                    style={STATUS_STYLE[value]}
                  />
                ))}
                <div className="flex items-center justify-center gap-2">
                  {trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-[#9fa2ff]" />
                  ) : null}
                  {trend === "down" ? (
                    <TrendingDown className="h-4 w-4 text-[#ffb783]" />
                  ) : null}
                  {trend === "flat" ? (
                    <Minus className="h-4 w-4 text-[#5c5b61]" />
                  ) : null}
                </div>
              </div>
            );
          })}
          {habits.length === 0 && (
            <div className="text-center text-[0.8125rem] text-[#8e8d92] py-4">
              No habits configured yet. Go to Settings to add some.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
