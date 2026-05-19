import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CheckSquare,
  Repeat2,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Timer,
  Terminal,
} from "lucide-react";
import { useState } from "react";
import { inDevelopment } from "@/constants";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", path: "/", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", path: "/tasks", icon: CheckSquare },
  { id: "habits", label: "Habits", path: "/habits", icon: Repeat2 },
  { id: "analytics", label: "Analytics", path: "/analytics", icon: BarChart2 },
  { id: "settings", label: "Settings", path: "/settings", icon: Settings },
  ...(inDevelopment
    ? [{ id: "ws-lab", label: "WS Lab", path: "/ws-lab", icon: Terminal }]
    : []),
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <aside
      className="relative flex flex-col flex-shrink-0 h-full transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? "60px" : "200px",
        background: "#0e0e10", // surface-container-lowest — design system sidebar anchor
      }}
    >
      {/* Logo / Brand */}
      <div
        className="flex items-center gap-3 px-4 py-5 overflow-hidden"
        style={{ minHeight: "64px" }}
      >
        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] flex items-center justify-center shadow-[0_0_16px_rgba(192,193,255,0.25)]">
          <Timer className="w-4 h-4 text-[#131315]" />
        </div>
        {!collapsed && (
          <span
            className="text-[#e4e4e6] font-semibold text-[0.9375rem] tracking-[-0.02em] whitespace-nowrap transition-opacity duration-200"
            style={{ opacity: collapsed ? 0 : 1 }}
          >
            TimeBit
          </span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-1 px-2 pt-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.path === "/"
              ? currentPath === "/"
              : currentPath.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group no-drag"
              style={{
                background: isActive ? "#201f22" : "transparent",
                color: isActive ? "#e4e4e6" : "#5c5b61",
              }}
            >
              {/* Hover ghost — rendered FIRST so it paints behind all siblings */}
              {!isActive && (
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ background: "#1c1b1d" }}
                />
              )}

              {/* Active pill — 4px vertical indicator, no border */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
                  style={{
                    height: "60%",
                    background:
                      "linear-gradient(to bottom, #c0c1ff, #8083ff)",
                    boxShadow: "0 0 8px rgba(192,193,255,0.4)",
                  }}
                />
              )}

              <Icon
                className="relative z-10 flex-shrink-0 transition-colors duration-150"
                // @ts-ignore
                style={{
                  width: "16px",
                  height: "16px",
                  color: isActive ? "#c0c1ff" : undefined,
                }}
              />

              {!collapsed && (
                <span
                  className="relative z-10 text-[0.8125rem] font-medium whitespace-nowrap transition-opacity duration-200"
                  style={{ opacity: collapsed ? 0 : 1 }}
                >
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Label — Label-SM uppercase, only when expanded */}
      {!collapsed && (
        <div
          className="px-5 pb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
          style={{ color: "#353437" }}
        >
          Navigation
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="no-drag absolute -right-3 top-[72px] w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-150 z-50"
        style={{
          background: "#1c1b1d",
          color: "#5c5b61",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        }}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </aside>
  );
}
