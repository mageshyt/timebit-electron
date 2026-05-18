import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Filter } from "lucide-react";
import { TaskTable } from "@/features/tasks/components/task-table";
import { TaskDialog } from "@/features/tasks/components/task-dialog";
import { TaskFilterTabs } from "@/features/tasks/components/task-filter-tabs";
import { EMPTY_FORM } from "@/features/tasks/data";
import type { Task, TaskForm, FilterTab } from "@/features/tasks/types";
import { getSyncServerUrl } from "@/state/sync-status";

const PAGE_SIZE = 4;

type TaskResponse = Task & {
  createdAt: string;
  updatedAt: string;
};

type TaskListResponse = {
  data: TaskResponse[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

type TaskSummaryResponse = {
  tasks: {
    total: number;
    completed: number;
    remaining: number;
  };
};

type TaskSummary = TaskSummaryResponse["tasks"];

const normalizeTask = (task: TaskResponse): Task => ({
  id: task.id,
  title: task.title,
  subtitle: task.subtitle,
  status: task.status,
  priority: task.priority,
  estimate: task.estimate,
  done: task.done,
});

const fetchJson = async <T,>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return (await response.json()) as T;
};

const buildTasksUrl = (baseUrl: string, page: number, pageSize: number) => {
  const url = new URL("/tasks", baseUrl);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  return url.toString();
};

const buildSummaryUrl = (baseUrl: string) => new URL("/summary", baseUrl).toString();

function TasksPage() {
  const syncServerUrl = useMemo(() => getSyncServerUrl(), []);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Today");
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<TaskSummary>({
    total: 0,
    completed: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Task | null>(null);

  const remaining = summary.total > 0
    ? summary.remaining
    : tasks.filter((t) => !t.done).length;

  const loadTasks = async (targetPage: number) => {
    setLoading(true);
    setError(null);

    try {
      const listUrl = buildTasksUrl(syncServerUrl, targetPage + 1, PAGE_SIZE);
      const response = await fetchJson<TaskListResponse>(listUrl);
      const normalized = response.data.map(normalizeTask);

      setTasks(normalized);
      setTotal(response.meta.total);

      const summaryUrl = buildSummaryUrl(syncServerUrl);
      const summaryResponse = await fetchJson<TaskSummaryResponse>(summaryUrl);
      setSummary(summaryResponse.tasks);

      if (response.meta.totalPages > 0 && targetPage > response.meta.totalPages - 1) {
        setPage(response.meta.totalPages - 1);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load tasks";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks(page);
  }, [page, syncServerUrl]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleAdd = (form: TaskForm) => {
    void (async () => {
      await fetchJson<TaskResponse>(`${syncServerUrl}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle,
          status: form.status,
          priority: form.priority,
          estimate: form.estimate,
          done: form.status === "DONE",
        }),
      });
      setPage(0);
      await loadTasks(0);
    })();
  };

  const handleEdit = (form: TaskForm) => {
    if (!editTarget) return;
    void (async () => {
      await fetchJson<TaskResponse>(`${syncServerUrl}/tasks/${editTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle,
          status: form.status,
          priority: form.priority,
          estimate: form.estimate,
          done: form.status === "DONE",
        }),
      });
      await loadTasks(page);
    })();
  };

  const handleDelete = (id: number) => {
    void (async () => {
      await fetchJson<{ data: { id: number } }>(`${syncServerUrl}/tasks/${id}`, {
        method: "DELETE",
      });
      await loadTasks(page);
    })();
  };

  const handleToggle = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const done = !task.done;
    const status = done ? "DONE" : "TODO";

    void (async () => {
      await fetchJson<TaskResponse>(`${syncServerUrl}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done, status }),
      });
      await loadTasks(page);
    })();
  };

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
      {error ? (
        <div className="mb-3 rounded-lg bg-[#1c1b1d] px-4 py-3 text-[0.75rem] text-[#ff9b9b]">
          Failed to load tasks: {error}
        </div>
      ) : null}
      {loading ? (
        <div className="mb-3 rounded-lg bg-[#1c1b1d] px-4 py-3 text-[0.75rem] text-[#8e8d92]">
          Loading tasks…
        </div>
      ) : null}
      <TaskTable
        tasks={tasks}
        total={total}
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
