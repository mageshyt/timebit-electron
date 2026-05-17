import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Circle,
  Lightbulb,
  SkipBack,
  Square,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

function HomePage() {
  const [startTime, setStartTime] = useState<number | null>(Date.now());
  const [elapsed, setElapsed] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Re-render tick when active
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (isActive && startTime !== null) {
      intervalId = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100); // 100ms for smooth updates if needed, but we display seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isActive, startTime]);

  const handleToggleTimer = () => {
    if (isActive) {
      // Pause
      setIsActive(false);
    } else {
      // Start or Resume
      if (!startTime) {
        setStartTime(Date.now());
        setElapsed(0);
      } else {
        // Adjust start time so elapsed resumes smoothly
        setStartTime(Date.now() - elapsed);
      }
      setIsActive(true);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setStartTime(null);
    setElapsed(0);
  };

  const formatElapsed = () => {
    const totalSeconds = Math.floor(elapsed / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex h-full w-full flex-col ">
      {/* Main Content Area */}
      <main className="flex flex-1 flex-col p-6 pb-20 overflow-y-auto">
        {/* Header Section */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-[#f4f4f5] mb-2">Focus Protocol</h1>
            <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
              Current Module:{" "}
              <span className="text-[#c0c1ff]">
                Design Engineering
              </span>
            </div>
          </div>
          <div className="flex space-x-4">
            {/* Secondary Action */}
            <button className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-4 py-2 rounded-md bg-[#2a2a2c] text-[#e4e4e6] hover:bg-[#353437] transition-colors">
              Edit Layout
            </button>
            {/* Primary Action */}
            <button className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-5 py-2 rounded-md bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#131315] hover:opacity-90 transition-opacity drop-shadow-[0_4px_32px_rgba(192,193,255,0.15)]">
              New Workflow
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Left Column (Main Focus Timer & Telemetry) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Timer Panel - Primary Workspace */}
            <div className="flex-1 bg-[#1c1b1d] rounded-[1.5rem] relative flex flex-col p-6 overflow-hidden shadow-[0_8px_32px_rgba(192,193,255,0.03)]">
              <div className="absolute top-6 right-6 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-2 py-1 rounded bg-[#201f22] text-[#8083ff]">
                Session_ID: TB-992-X
              </div>

              {/* Timer Center */}
              <div className="flex-1 flex flex-col items-center justify-center relative py-12">
                {/* Minimalist Focus Ring - Primary progress, track surface-container-highest */}
                <div className="absolute w-[320px] h-[320px] rounded-full ring-[2px] ring-[#353437]" />
                <div className="absolute w-[320px] h-[320px] rounded-full border-[4px] border-transparent border-t-[#c0c1ff] border-r-[#c0c1ff] border-b-[#c0c1ff] transform rotate-45 opacity-90 drop-shadow-[0_0_12px_rgba(192,193,255,0.2)]" />
                
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-6">Cycle Time</span>
                {/* Display-LG */}
                <div className="text-[3.5rem] font-bold tracking-[-0.04em] text-[#f4f4f5] leading-none tabular-nums mb-6">
                  {startTime !== null ? formatElapsed() : "00:00"}
                </div>
                <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] px-4 py-1.5 rounded-full bg-[#201f22] text-[#c0c1ff]">
                  {isActive ? "Deep Focus Active" : "Session Paused"}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-6 mt-4 mb-8">
                <button 
                  onClick={handleReset}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[#201f22] text-[#8e8d92] hover:bg-[#2a2a2c] transition-colors"
                >
                  <SkipBack className="h-5 w-5" />
                </button>
                {/* Massive CTA for pausing/playing */}
                <button 
                  onClick={handleToggleTimer}
                  className="px-10 py-4 bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] text-[#131315] text-[0.875rem] font-bold uppercase tracking-[0.05em] rounded-xl hover:opacity-90 transition-opacity drop-shadow-[0_8px_32px_rgba(192,193,255,0.2)] w-48"
                >
                  {isActive ? "Pause Session" : "Start Session"}
                </button>
                <button 
                  onClick={handleReset}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-[#201f22] text-[#8e8d92] hover:bg-[#2a2a2c] transition-colors"
                >
                  <Square className="h-4 w-4" fill="currentColor" />
                </button>
              </div>

              {/* Stats Footer - Tonal shift instead of border */}
              <div className="grid grid-cols-3 bg-[#131315]/50 rounded-xl p-4 mt-auto">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1">Avg. Focus BPM</span>
                  <span className="text-[1.125rem] font-medium text-[#e4e4e6]">72</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1">Productivity Index</span>
                  <span className="text-[1.125rem] font-medium text-[#e4e4e6]">94.8%</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1">Est. Completion</span>
                  <span className="text-[1.125rem] font-medium text-[#e4e4e6]">15:30</span>
                </div>
              </div>
            </div>

            {/* Bottom Panels - Tonal Layering */}
            <div className="grid grid-cols-2 gap-6">
              {/* Telemetry */}
              <div className="bg-[#1c1b1d] rounded-xl p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                    <Activity className="h-4 w-4 text-[#c0c1ff]" />
                    <span>Device Telemetry</span>
                  </div>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-emerald-400">Live</span>
                </div>
                {/* Recessed Effect */}
                <div className="flex items-end justify-between bg-[#0e0e10] p-4 rounded-lg">
                  <div>
                    <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1">Controller</div>
                    <div className="text-[0.875rem] font-medium text-[#e4e4e6]">ESP32-S3 Bit</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-1">Temp</div>
                    <div className="text-[0.875rem] font-medium text-[#ffb783]">42°C</div>
                  </div>
                </div>
              </div>

              {/* Intelligence Feed */}
              <div className="bg-[#1c1b1d] rounded-xl p-6 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                <div className="flex items-center space-x-2 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] mb-4">
                  <Zap className="h-4 w-4 text-[#c0c1ff]" />
                  <span>Intelligence Feed</span>
                </div>
                {/* Ghost Border Fallback used subtly */}
                <div className="bg-[#201f22] ring-1 ring-[#464554]/20 p-4 rounded-lg">
                  <p className="text-[0.875rem] text-[#e4e4e6] leading-relaxed">
                    <span className="text-[#8083ff] text-[0.6875rem] font-semibold uppercase tracking-[0.05em] mr-2">Insight:</span>
                    Cognitive load peaking. Suggesting 2m hydration break in 15 mins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Widgets) */}
          <div className="flex flex-col gap-6">
            
            {/* Habit Engine */}
            <div className="bg-[#1c1b1d] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">Habit Engine</span>
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] bg-[#201f22] text-[#8083ff] px-2 py-1 rounded-md">75% Complete</span>
              </div>
              <div className="space-y-[0.9rem]">
                <div className="flex items-center justify-between bg-[#201f22] p-3 rounded-lg text-[0.875rem]">
                  <div className="flex items-center space-x-3 text-[#5c5b61]">
                    <CheckCircle2 className="h-5 w-5 text-[#8083ff]" />
                    <span className="line-through">Hydration Protocol (500ml)</span>
                  </div>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61]">08:00</span>
                </div>
                <div className="flex items-center justify-between bg-[#201f22] p-3 rounded-lg text-[0.875rem]">
                  <div className="flex items-center space-x-3 text-[#5c5b61]">
                    <CheckCircle2 className="h-5 w-5 text-[#8083ff]" />
                    <span className="line-through">Morning Synchronization</span>
                  </div>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61]">09:15</span>
                </div>
                <div className="flex items-center justify-between bg-[#2a2a2c] p-3 rounded-lg text-[0.875rem] shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
                  <div className="flex items-center space-x-3 text-[#e4e4e6]">
                    <Circle className="h-5 w-5 text-[#8e8d92]" />
                    <span className="font-medium">Physiological Reset (Stretch)</span>
                  </div>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">14:45</span>
                </div>
                <div className="flex items-center justify-between bg-[#201f22] p-3 rounded-lg text-[0.875rem]">
                  <div className="flex items-center space-x-3 text-[#e4e4e6]">
                    <Circle className="h-5 w-5 text-[#8e8d92]" />
                    <span>Workspace Defragmentation</span>
                  </div>
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">17:30</span>
                </div>
              </div>
              <button className="w-full mt-6 py-3 bg-[#201f22] hover:bg-[#2a2a2c] rounded-lg text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#c0c1ff] transition-colors">
                Manage Habits
              </button>
            </div>

            {/* Upcoming Agenda */}
            <div className="bg-[#1c1b1d] rounded-xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.2)] flex-1">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">Upcoming Agenda</span>
                <Calendar className="h-4 w-4 text-[#8e8d92]" />
              </div>
              
              <div className="space-y-[1.1rem]">
                {/* Prominent Card for Next item */}
                <div className="flex space-x-4 bg-[#2a2a2c] p-4 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-[#464554]/20">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#c0c1ff] drop-shadow-[0_0_8px_rgba(192,193,255,0.6)]" />
                  </div>
                  <div>
                    <div className="text-[1.125rem] font-medium text-[#f4f4f5] mb-1">Global Team Sync</div>
                    <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8083ff]">In 18 Minutes</div>
                  </div>
                </div>

                <div className="flex space-x-4 px-4 py-2">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#353437]" />
                  </div>
                  <div>
                    <div className="text-[0.875rem] text-[#e4e4e6] mb-1">Specs Review: TimeBit v1.2</div>
                    <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61]">Tomorrow @ 10:30</div>
                  </div>
                </div>

                <div className="flex space-x-4 px-4 py-2">
                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#353437]" />
                  </div>
                  <div>
                    <div className="text-[0.875rem] text-[#e4e4e6] mb-1">Weekly Retrospective</div>
                    <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61]">Friday @ 16:00</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Note */}
            <div className="bg-[#201f22] rounded-xl p-5 flex items-start space-x-4 shadow-[0_4px_24px_rgba(0,0,0,0.15)] relative overflow-hidden">
              {/* Subtle accent strip using Ghost Border rule adapted for accenting */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8083ff]/50" />
              <div className="p-2 bg-[#1c1b1d] rounded-lg">
                <Lightbulb className="h-4 w-4 text-[#ffb783]" />
              </div>
              <div>
                <h4 className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#e4e4e6] mb-1">Environmental Note</h4>
                <p className="text-[0.875rem] text-[#8e8d92]">
                  Current ambient noise levels are low (24dB). Perfect window for deep architectural reasoning.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
