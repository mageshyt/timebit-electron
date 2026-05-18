import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSyncServerUrl } from "@/state/sync-status";
import { useTaskStore } from "./task.store";
import { normalizeTask, fetchJson, fetchTasksList, fetchTaskSummary, mapFilterToRange } from "./utils";
import type { TaskForm, TaskResponse, TaskTogglePayload, TaskUpdatePayload } from "./types";

const PAGE_SIZE = 4;

export { PAGE_SIZE };

export function useTaskActions() {
  const syncServerUrl = useMemo(() => getSyncServerUrl(), []);
  const queryClient = useQueryClient();

  const { activeFilter, page, setPage } = useTaskStore();
  const range = useMemo(() => mapFilterToRange(activeFilter), [activeFilter]);

  // ── Queries ───────────────────────────────────────────────────────────────

  const listQuery = useQuery({
    queryKey: ["tasks", syncServerUrl, page, PAGE_SIZE, range],
    queryFn: () => fetchTasksList(syncServerUrl, page, PAGE_SIZE, range),
    placeholderData: (prev) => prev,
  });

  const summaryQuery = useQuery({
    queryKey: ["tasks-summary", syncServerUrl, range],
    queryFn: () => fetchTaskSummary(syncServerUrl, range),
  });

  // ── Derived data ──────────────────────────────────────────────────────────

  const tasks = useMemo(
    () => listQuery.data?.data.map(normalizeTask) ?? [],
    [listQuery.data],
  );
  const total = listQuery.data?.meta.total ?? 0;
  const totalPages = listQuery.data?.meta.totalPages ?? 0;
  const remaining =
    summaryQuery.data?.tasks.remaining ?? tasks.filter((t) => !t.done).length;
  const errorMessage =
    listQuery.error instanceof Error ? listQuery.error.message : null;

  const refresh = () => {
    void listQuery.refetch();
    void summaryQuery.refetch();
  };

  // ── Shared cache invalidation ─────────────────────────────────────────────

  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["tasks-summary"] });
  };

  // ── Mutations ─────────────────────────────────────────────────────────────

  const createTaskMutation = useMutation({
    mutationFn: (form: TaskForm) =>
      fetchJson<TaskResponse>(`${syncServerUrl}/tasks`, {
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
      }),
    onSuccess: () => {
      setPage(0);
      invalidateTasks();
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, form }: TaskUpdatePayload) =>
      fetchJson<TaskResponse>(`${syncServerUrl}/tasks/${id}`, {
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
      }),
    onSuccess: () => invalidateTasks(),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) =>
      fetchJson<{ data: { id: number } }>(`${syncServerUrl}/tasks/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => invalidateTasks(),
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, done, status }: TaskTogglePayload) =>
      fetchJson<TaskResponse>(`${syncServerUrl}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done, status }),
      }),
    onSuccess: () => invalidateTasks(),
  });

  const createTask = (form: TaskForm) => createTaskMutation.mutate(form);

  const updateTask = (id: number, form: TaskForm) =>
    updateTaskMutation.mutate({ id, form });

  const deleteTask = (id: number) => deleteTaskMutation.mutate(id);

  const toggleTask = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const done = !task.done;
    const status = done ? "DONE" : "TODO";
    toggleTaskMutation.mutate({ id, done, status });
  };

  return {
    tasks,
    total,
    totalPages,
    remaining,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    errorMessage,
    refresh,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}
