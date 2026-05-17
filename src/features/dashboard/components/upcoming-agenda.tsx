import { Calendar } from "lucide-react";

const EVENTS = [
  { id: 1, label: "Global Team Sync", sub: "In 18 Minutes", prominent: true },
  { id: 2, label: "Specs Review: TimeBit v1.2", sub: "Tomorrow @ 10:30", prominent: false },
  { id: 3, label: "Weekly Retrospective", sub: "Friday @ 16:00", prominent: false },
];

export function UpcomingAgenda() {
  return (
    <div
      className="rounded-xl p-6 flex-1"
      style={{ background: "#1c1b1d", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}
    >
      <div className="flex items-center justify-between mb-8">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]" style={{ color: "#8e8d92" }}>
          Upcoming Agenda
        </span>
        <Calendar className="h-4 w-4" style={{ color: "#8e8d92" }} />
      </div>

      <div className="space-y-[1.1rem]">
        {EVENTS.map((ev) => (
          <div
            key={ev.id}
            className="flex space-x-4"
            style={ev.prominent ? { background: "#2a2a2c", padding: "1rem", borderRadius: "0.75rem", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", outline: "1px solid rgba(70,69,84,0.2)" } : { padding: "0.5rem 1rem" }}
          >
            <div className="flex-shrink-0 mt-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: ev.prominent ? "#c0c1ff" : "#353437",
                  boxShadow: ev.prominent ? "0 0 8px rgba(192,193,255,0.6)" : "none",
                }}
              />
            </div>
            <div>
              <div
                className="mb-1"
                style={{ color: ev.prominent ? "#f4f4f5" : "#e4e4e6", fontSize: ev.prominent ? "1.125rem" : "0.875rem", fontWeight: ev.prominent ? 500 : 400 }}
              >
                {ev.label}
              </div>
              <div
                className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
                style={{ color: ev.prominent ? "#8083ff" : "#5c5b61" }}
              >
                {ev.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
