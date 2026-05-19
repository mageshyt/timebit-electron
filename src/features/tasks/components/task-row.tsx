import { CheckSquare, ChevronDown, Square } from "lucide-react";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityCell } from "./task-priority-cell";
import { TaskActionsMenu } from "./task-actions-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task, TaskStatus } from "../types";

interface Props {
  task: Task;
  onToggle: (id: number) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const GRID = "40px 180px 1fr 130px 130px 80px";
const STATUS_OPTIONS: TaskStatus[] = ["TODO", "IN PROGRESS", "DONE"];

export function TaskRow({ task, onToggle, onStatusChange, onEdit, onDelete }: Props) {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-[#201f22]"
            aria-label="Change status"
          >
            <TaskStatusBadge status={task.status} />
            <ChevronDown className="w-3 h-3 text-[#5c5b61]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="border-0 rounded-xl p-1 min-w-[160px]"
          style={{
            background: "#2a2a2c",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(70,69,84,0.15)",
          }}
        >
          <DropdownMenuRadioGroup
            value={task.status}
            onValueChange={(value) => onStatusChange(task, value as TaskStatus)}
          >
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuRadioItem
                key={status}
                value={status}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[0.8125rem] text-[#e4e4e6] cursor-pointer hover:bg-[#353437] focus:bg-[#353437]"
              >
                <TaskStatusBadge status={status} />
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

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
