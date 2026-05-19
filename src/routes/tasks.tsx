import { createFileRoute } from "@tanstack/react-router";
import { Plus, Filter } from "lucide-react";
import { TaskTable } from "@/features/tasks/components/task-table";
import { TaskFilterTabs } from "@/features/tasks/components/task-filter-tabs";
import { TaskDialogManager } from "@/features/tasks/components/task-dialog-manager";
import { useTaskActions, PAGE_SIZE } from "@/features/tasks/task.hooks";
import { useTaskStore } from "@/features/tasks/task.store";
import type { Task, TaskStatus } from "@/features/tasks/types";

const TABLE_GRID = "40px 180px 1fr 130px 130px 80px";

function TaskTableSkeleton() {
  const rows = Array.from({ length: PAGE_SIZE }, (_, index) => index);

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#131315" }}>
      <div
        className="grid items-center px-6 py-3"
        style={{ gridTemplateColumns: TABLE_GRID, background: "#0e0e10" }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`header-skeleton-${index}`}
            className="h-2.5 rounded-full bg-[#2a2a2c]"
            style={{ width: index === 2 ? "60%" : "50%" }}
          />
        ))}
      </div>

      <div className="animate-pulse">
        {rows.map((row) => (
          <div
            key={`row-skeleton-${row}`}
            className="grid items-center px-6 py-4"
            style={{
              gridTemplateColumns: TABLE_GRID,
              background: row % 2 === 0 ? "#131315" : "#0f0f11",
            }}
          >
            <div className="h-4 w-4 rounded bg-[#2a2a2c]" />
            <div className="h-4 w-20 rounded bg-[#2a2a2c]" />
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-[#2a2a2c]" />
              <div className="h-3 w-32 rounded bg-[#242326]" />
            </div>
            <div className="h-4 w-16 rounded bg-[#2a2a2c]" />
            <div className="h-4 w-14 rounded bg-[#2a2a2c]" />
            <div className="h-4 w-10 rounded bg-[#2a2a2c]" />
          </div>
        ))}
      </div>

      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ background: "#0e0e10" }}
      >
        <div className="h-3 w-40 rounded bg-[#2a2a2c]" />
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-[#1c1b1d]" />
          <div className="h-7 w-7 rounded bg-[#1c1b1d]" />
        </div>
      </div>
    </div>
  );
}

function TasksPage() {
  const {
    tasks,
    total,
    totalPages,
    remaining,
    isLoading,
    isFetching,
    errorMessage,
    refresh,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  } = useTaskActions();

  const { page, setPage, openAdd, openEdit, activeFilter, setActiveFilter } = useTaskStore();

  const handleStatusChange = (task: Task, status: TaskStatus) => {
    if (task.status === status) return;

    updateTask(task.id, {
      title: task.title,
      subtitle: task.subtitle,
      status,
      priority: task.priority,
      estimate: task.estimate,
    });
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto p-6 pb-8">
      <div className="w-full flex w-full flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1
              className="text-[2rem] font-bold tracking-[-0.03em]"
              style={{ color: "#f4f4f5" }}
            >
              Tasks
            </h1>
            <p className="flex items-center gap-2 mt-1 text-[0.8125rem] text-[#8e8d92]">
              <span
                className="w-2 h-2 rounded-full bg-[#c0c1ff] inline-block"
                style={{ boxShadow: "0 0 6px rgba(192,193,255,0.6)" }}
              />
              You have{" "}
              <span className="text-[#e4e4e6] font-medium">{remaining}</span>{" "}
              tasks remaining for today.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <TaskFilterTabs active={activeFilter} onChange={setActiveFilter} />

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] hover:text-[#e4e4e6] transition-colors"
              style={{ background: "#1c1b1d" }}
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>

            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#131315] bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] hover:opacity-90 transition-opacity drop-shadow-[0_4px_24px_rgba(192,193,255,0.2)]"
            >
              <Plus className="w-3.5 h-3.5" />
              New Task
            </button>
          </div>
        </div>

        {/* Status banners */}
        {errorMessage ? (
          <div className="mb-4 rounded-lg border border-[#3a2a2a] bg-[#1c1b1d] px-4 py-3 text-[0.75rem] text-[#ffb4b4]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-[#ffd1d1]">Unable to load tasks</div>
                <div className="text-[#ffb4b4]">
                  {errorMessage} — check that the sync server is running and try again.
                </div>
              </div>
              <button
                onClick={refresh}
                className="rounded-md bg-[#2a2a2c] px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.05em] text-[#f4f4f5] hover:bg-[#353437]"
              >
                Retry
              </button>
            </div>
          </div>
        ) : null}
        {isFetching && !isLoading ? (
          <div className="mb-3 rounded-lg bg-[#1c1b1d] px-4 py-3 text-[0.75rem] text-[#8e8d92]">
            Updating tasks…
          </div>
        ) : null}

        {/* Table */}
        {isLoading ? (
          <TaskTableSkeleton />
        ) : (
          <TaskTable
            tasks={tasks}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => setPage(p, totalPages)}
            onToggle={toggleTask}
            onStatusChange={handleStatusChange}
            onEdit={openEdit}
            onDelete={deleteTask}
          />
        )}

        {/* Dialogs — self-managed via Zustand store */}
        <TaskDialogManager onAdd={createTask} onEdit={updateTask} />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});
