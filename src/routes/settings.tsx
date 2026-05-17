import { createFileRoute } from "@tanstack/react-router";
import { Settings, Wifi, Monitor, Bell, Shield, ChevronRight } from "lucide-react";

interface SettingRow {
  id: string;
  label: string;
  description: string;
  value: string;
}

const SETTING_GROUPS: { title: string; icon: React.ComponentType<{ className?: string }>; items: SettingRow[] }[] = [
  {
    title: "Connectivity",
    icon: Wifi,
    items: [
      { id: "wifi-ssid", label: "WiFi Network", description: "Sync server connection", value: "TimeBit-LAN" },
      { id: "sync-port", label: "Sync Port", description: "Local REST + WebSocket", value: "5719" },
      { id: "mdns", label: "mDNS / Bonjour", description: "Advertise service on LAN", value: "Enabled" },
    ],
  },
  {
    title: "Display",
    icon: Monitor,
    items: [
      { id: "theme", label: "Theme", description: "Color scheme", value: "Obsidian Dark" },
      { id: "font", label: "Font", description: "UI typeface", value: "Geist" },
      { id: "density", label: "Density", description: "Layout density", value: "Comfortable" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { id: "focus-alerts", label: "Focus Alerts", description: "Session reminders", value: "On" },
      { id: "habit-reminders", label: "Habit Reminders", description: "Daily nudges", value: "On" },
    ],
  },
  {
    title: "System",
    icon: Shield,
    items: [
      { id: "version", label: "App Version", description: "Current build", value: "v2.0.0-beta" },
      { id: "logs", label: "Diagnostic Logs", description: "Export crash logs", value: "Export →" },
    ],
  },
];

function SettingsPage() {
  return (
    <div className="flex h-full w-full flex-col p-6 pb-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-[#f4f4f5] mb-2">
            Settings
          </h1>
          <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
            System configuration
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {SETTING_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.title}
              className="bg-[#1c1b1d] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
            >
              {/* Group Header */}
              <div className="flex items-center gap-2 px-6 py-4">
                <Icon className="w-4 h-4 text-[#c0c1ff]" />
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92]">
                  {group.title}
                </span>
              </div>

              {/* Items */}
              <div className="bg-[#201f22] mx-4 mb-4 rounded-lg overflow-hidden">
                {group.items.map((item, idx) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#2a2a2c] transition-colors"
                    style={{
                      borderTop: idx > 0 ? "1px solid rgba(70,69,84,0.1)" : "none",
                    }}
                  >
                    <div>
                      <div className="text-[0.875rem] font-medium text-[#e4e4e6]">
                        {item.label}
                      </div>
                      <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61] mt-0.5">
                        {item.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#8083ff]">
                        {item.value}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#353437]" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});
