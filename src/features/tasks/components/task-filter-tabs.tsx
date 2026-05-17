import type { FilterTab } from "../types";

interface Props {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

const TABS: FilterTab[] = ["Today", "Week", "All"];

export function TaskFilterTabs({ active, onChange }: Props) {
  return (
    <div
      className="flex rounded-lg overflow-hidden"
      style={{ background: "#1c1b1d" }}
    >
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className="px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.05em] transition-colors"
          style={{
            background: active === tab ? "#2a2a2c" : "transparent",
            color: active === tab ? "#e4e4e6" : "#5c5b61",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
