import { ChevronLeft, ChevronRight } from "lucide-react";
import { TaskRow } from "./task-row";
import type { Task } from "../types";

const COLUMNS = ["", "STATUS", "TITLE", "PRIORITY", "ESTIMATE", "ACTIONS"];
const GRID = "40px 180px 1fr 130px 130px 80px";

interface Props {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskTable({
  tasks,
  total,
  page,
  pageSize,
  onPageChange,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  const visible = tasks;
  const canGoBack = page > 0;
  const canGoForward = totalPages > 0 && page < totalPages - 1;
  const lastPage = totalPages > 0 ? totalPages - 1 : 0;

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
          Showing {visible.length} of {total} tasks
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={!canGoBack}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-30"
            style={{ background: "#1c1b1d", color: "#8e8d92" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(Math.min(lastPage, page + 1))}
            disabled={!canGoForward}
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
