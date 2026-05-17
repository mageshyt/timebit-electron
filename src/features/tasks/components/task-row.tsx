import { CheckSquare, Square } from "lucide-react";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityCell } from "./task-priority-cell";
import { TaskActionsMenu } from "./task-actions-menu";
import type { Task } from "../types";

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const GRID = "40px 180px 1fr 130px 130px 80px";

export function TaskRow({ task, onToggle, onEdit, onDelete }: Props) {
  const { done } = task;

  return (
    <div
      className="grid items-center px-6 py-4 transition-colors group/row"
      style={{
        gridTemplateColumns: GRID,
        background: done ? "#0e0e10" : "#131315",
        opacity: done ? 0.55 : 1,
      }}
      onMouseEnter={(e) => {
        if (!done) (e.currentTarget as HTMLElement).style.background = "#1c1b1d";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = done
          ? "#0e0e10"
          : "#131315";
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className="flex items-center justify-center w-5 h-5"
        aria-label="Toggle done"
      >
        {done ? (
          <CheckSquare className="w-5 h-5" style={{ color: "#8083ff" }} />
        ) : (
          <Square className="w-5 h-5 text-[#353437]" />
        )}
      </button>

      {/* Status */}
      <TaskStatusBadge status={task.status} />

      {/* Title + subtitle */}
      <div>
        <div
          className="text-[0.875rem] font-medium"
          style={{
            color: done ? "#5c5b61" : "#e4e4e6",
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {task.title}
        </div>
        <div className="text-[0.75rem] text-[#5c5b61] mt-0.5">
          {task.subtitle}
        </div>
      </div>

      {/* Priority */}
      <TaskPriorityCell priority={task.priority} />

      {/* Estimate */}
      <span
        className="text-[0.8125rem] font-medium tabular-nums"
        style={{ color: done ? "#5c5b61" : "#8e8d92" }}
      >
        {task.estimate}
      </span>

      {/* Actions */}
      <TaskActionsMenu task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}
