import { ChevronLeft, ChevronRight } from "lucide-react";
import { TaskRow } from "./task-row";
import type { Task } from "../types";

const COLUMNS = ["", "STATUS", "TITLE", "PRIORITY", "ESTIMATE", "ACTIONS"];
const GRID = "40px 180px 1fr 130px 130px 80px";

interface Props {
  tasks: Task[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskTable({
  tasks,
  page,
  pageSize,
  onPageChange,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const totalPages = Math.ceil(tasks.length / pageSize);
  const visible = tasks.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#131315" }}>
      {/* Column headers */}
      <div
        className="grid items-center px-6 py-3"
        style={{ gridTemplateColumns: GRID, background: "#0e0e10" }}
      >
        {COLUMNS.map((col) => (
          <span
            key={col}
            className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em]"
            style={{ color: "#5c5b61" }}
          >
            {col}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div>
        {visible.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ background: "#0e0e10" }}
      >
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#5c5b61]">
          Showing {visible.length} of {tasks.length} tasks
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
            style={{ background: "#1c1b1d", color: "#8e8d92" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
            style={{ background: "#1c1b1d", color: "#8e8d92" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
