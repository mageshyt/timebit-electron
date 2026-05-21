import React, { useState } from "react";
import { Droplet, Moon, CheckCircle2 } from "lucide-react";
import { useWellnessActions } from "../habit.hooks";
import { toast } from "sonner";
import { playDropletSound } from "@/utils/sound";

const GLASS_COUNT = 8;

export function WaterIntakeCard() {
  const { waterIntake, isLoading, logWater } = useWellnessActions();
  const [isThrottled, setIsThrottled] = useState(false);
  const LOGGED_COUNT = Math.min(waterIntake, GLASS_COUNT);

  if (isLoading) {
    return (
      <section
        className="rounded-3xl p-6 animate-pulse h-64"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      />
    );
  }

  const handleAddGlass = () => {
    if (isThrottled) return;
    setIsThrottled(true);
    
    logWater();
    playDropletSound();
    toast.success("Glass of water logged! 💧", {
      description: `Today's total: ${waterIntake + 1} glasses`,
      duration: 4500,
    });

    setTimeout(() => {
      setIsThrottled(false);
    }, 300);
  };

  const progressPercent = Math.round((waterIntake / GLASS_COUNT) * 100);

  return (
    <section
      className="rounded-3xl p-6"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-[#c0c1ff]">
            <Droplet className="h-4 w-4 text-[#9fa2ff]" />
            Vitality
          </div>
          <h3 className="mt-2 text-[1.5rem] font-semibold text-[#f4f4f5]">Water Intake</h3>
          <div className="mt-1 text-[0.75rem] font-light text-[#8e8d92]">
            Target: 8 glasses (2.5L) per day.
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
            style={{
              background: "rgba(192, 193, 255, 0.12)",
              border: "1px solid rgba(192, 193, 255, 0.2)",
              color: "#c0c1ff",
            }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {progressPercent}%
          </div>
          <span className="mt-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-[#8e8d92]">
            Daily Goal
          </span>
        </div>
      </div>

      <div className="grid grid-cols-8 gap-3 py-2 mb-4">
        {Array.from({ length: GLASS_COUNT }).map((_, index) => (
          <div
            key={`glass-${index}`}
            className="aspect-[3/4] rounded-lg p-1 flex flex-col justify-end"
            style={{
              background:
                index < LOGGED_COUNT
                  ? "#c0c1ff"
                  : index === LOGGED_COUNT
                    ? "rgba(192, 193, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
              border:
                index >= LOGGED_COUNT
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid rgba(192, 193, 255, 0.3)",
              boxShadow:
                index < LOGGED_COUNT
                  ? "0 6px 16px rgba(192, 193, 255, 0.2)"
                  : "none",
            }}
          >
            {index < LOGGED_COUNT ? (
              <div
                className="w-full rounded-sm"
                style={{ background: "rgba(255, 255, 255, 0.25)", height: "50%" }}
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[0.75rem] text-[#8e8d92]">
        <span>
          {waterIntake} of {GLASS_COUNT} glasses logged
        </span>
        <button 
          onClick={handleAddGlass}
          disabled={isThrottled}
          className="text-[#c0c1ff] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add Glass
        </button>
      </div>
    </section>
  );
}
export function RecoverySessionCard() {
  return (
    <section
      className="rounded-3xl p-6"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-[#ffb783]">
            <Moon className="h-4 w-4 text-[#ffb783]" />
            Recovery
          </div>
          <h3 className="mt-2 text-[1.5rem] font-semibold text-[#f4f4f5]">Evening Reset</h3>
          <div className="mt-1 text-[0.75rem] font-light text-[#8e8d92]">
            Wind down with a 20-minute recovery ritual.
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
            style={{
              background: "rgba(255, 183, 131, 0.12)",
              border: "1px solid rgba(255, 183, 131, 0.25)",
              color: "#ffb783",
            }}
          >
            9d
          </div>
          <span className="mt-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-[#8e8d92]">
            Day Streak
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-[#8e8d92]">
          <span>Tonight's Session</span>
          <span className="text-[#ffb783]">Scheduled</span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-[#2a2a2c]">
          <div
            className="h-1 rounded-full"
            style={{ width: "40%", background: "#ffb783", boxShadow: "0 0 8px rgba(255,183,131,0.35)" }}
          />
        </div>
      </div>

      <button
        className="w-full rounded-xl py-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em]"
        style={{ background: "#ffb783", color: "#131315" }}
      >
        Start Reset
      </button>
    </section>
  );
}