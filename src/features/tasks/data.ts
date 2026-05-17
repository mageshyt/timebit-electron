import type { Task, TaskForm, TaskStatus, TaskPriority } from "./types";

export const EMPTY_FORM: TaskForm = {
  title: "",
  subtitle: "",
  status: "TODO",
  priority: "Medium",
  estimate: "",
};

export const STATUS_STYLES: Record<TaskStatus, { bg: string; color: string }> =
  {
    "IN PROGRESS": { bg: "#23224a", color: "#a5a6ff" },
    TODO: { bg: "#2a2a2c", color: "#a0a0a8" },
    DONE: { bg: "#142b1e", color: "#4ade80" },
  };

export const PRIORITY_DOT: Record<TaskPriority, string> = {
  High: "#ff6b6b",
  Medium: "#ffb783",
  Low: "#5c5b61",
};

export const SEED_TASKS: Task[] = [
  {
    id: 1,
    status: "IN PROGRESS",
    title: "Refactor SQLite queries",
    subtitle: "Core engine optimisation for v2 release",
    priority: "High",
    estimate: "1h 45m",
    done: false,
  },
  {
    id: 2,
    status: "TODO",
    title: "Design habits grid",
    subtitle: "Mobile-first interface for focus module",
    priority: "Medium",
    estimate: "3h 20m",
    done: false,
  },
  {
    id: 3,
    status: "TODO",
    title: "Draft PRD v2",
    subtitle: "Sync with hardware team on low-power mode",
    priority: "Low",
    estimate: "45m",
    done: false,
  },
  {
    id: 4,
    status: "DONE",
    title: "Security audit logs",
    subtitle: "Review Q3 access patterns",
    priority: "Low",
    estimate: "35m",
    done: true,
  },
  {
    id: 5,
    status: "TODO",
    title: "WebSocket sync handler",
    subtitle: "Implement bi-directional real-time state sync",
    priority: "High",
    estimate: "2h 10m",
    done: false,
  },
  {
    id: 6,
    status: "IN PROGRESS",
    title: "NTP fallback tests",
    subtitle: "Guard UI rendering when NTP blocks startup",
    priority: "Medium",
    estimate: "1h",
    done: false,
  },
  {
    id: 7,
    status: "TODO",
    title: "Update design-system tokens",
    subtitle: "Sync obsidian palette vars with global.css",
    priority: "Low",
    estimate: "30m",
    done: false,
  },
  {
    id: 8,
    status: "DONE",
    title: "PCB schematic rev-B review",
    subtitle: "Verify ESP32-S3 pin layout changes",
    priority: "High",
    estimate: "2h 30m",
    done: true,
  },
];
