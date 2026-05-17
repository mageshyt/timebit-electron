import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { TaskTable } from "@/features/tasks/components/task-table";
import { TaskDialog } from "@/features/tasks/components/task-dialog";
import { TaskFilterTabs } from "@/features/tasks/components/task-filter-tabs";
import { SEED_TASKS, EMPTY_FORM } from "@/features/tasks/data";
import type { Task, TaskForm, FilterTab } from "@/features/tasks/types";

const PAGE_SIZE = 4;

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(SEED_TASKS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Today");
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);

  const remaining = tasks.filter((t) => !t.done).length;

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleAdd = (form: TaskForm) => {
    setTasks((prev) => [
      { id: Date.now(), ...form, done: form.status === "DONE" },
      ...prev,
    ]);
    setPage(0);
  };

  const handleEdit = (form: TaskForm) => {
    if (!editTarget) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editTarget.id
          ? { ...t, ...form, done: form.status === "DONE" }
          : t,
      ),
    );
  };

  const handleDelete = (id: number) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleToggle = (id: number) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, status: !t.done ? "DONE" : "TODO" }
          : t,
      ),
    );

  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab);
    setPage(0);
  };

  // ────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full w-full flex-col p-6 pb-8 overflow-y-auto">
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
          <TaskFilterTabs active={activeFilter} onChange={handleFilterChange} />

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#8e8d92] hover:text-[#e4e4e6] transition-colors"
            style={{ background: "#1c1b1d" }}
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>

          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-[0.75rem] font-semibold uppercase tracking-[0.05em] text-[#131315] bg-gradient-to-br from-[#c0c1ff] to-[#8083ff] hover:opacity-90 transition-opacity drop-shadow-[0_4px_24px_rgba(192,193,255,0.2)]"
          >
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* Table */}
      <TaskTable
        tasks={tasks}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onToggle={handleToggle}
        onEdit={setEditTarget}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      <TaskDialog
        open={addOpen}
        title="New Task"
        initial={EMPTY_FORM}
        onClose={() => setAddOpen(false)}
        onSave={handleAdd}
      />
      <TaskDialog
        open={!!editTarget}
        title="Edit Task"
        initial={
          editTarget
            ? {
                title: editTarget.title,
                subtitle: editTarget.subtitle,
                status: editTarget.status,
                priority: editTarget.priority,
                estimate: editTarget.estimate,
              }
            : EMPTY_FORM
        }
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
      />
    </div>
  );
}

export const Route = createFileRoute("/tasks")({
  component: TasksPage,
});
