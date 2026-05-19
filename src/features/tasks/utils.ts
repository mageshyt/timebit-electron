import type { FilterTab, Task, TaskRange, TaskResponse, TaskListResponse, TaskSummaryResponse } from "./types";

export const normalizeTask = (task: TaskResponse): Task => ({
  id: task.id,
  title: task.title,
  subtitle: task.subtitle,
  status: task.status,
  priority: task.priority,
  estimate: task.estimate,
  done: task.done,
});

export const fetchJson = async <T,>(input: RequestInfo, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return (await response.json()) as T;
};

export const mapFilterToRange = (tab: FilterTab): TaskRange => {
  if (tab === "Today") return "today";
  if (tab === "Week") return "week";
  return "all";
};

export const buildTasksUrl = (
  baseUrl: string,
  page: number,
  pageSize: number,
  range: TaskRange,
) => {
  const url = new URL("/tasks", baseUrl);
  url.searchParams.set("page", String(page));
  url.searchParams.set("pageSize", String(pageSize));
  if (range !== "all") {
    url.searchParams.set("range", range);
  }
  return url.toString();
};

export const buildSummaryUrl = (baseUrl: string, range: TaskRange) => {
  const url = new URL("/summary", baseUrl);
  if (range !== "all") {
    url.searchParams.set("range", range);
  }
  return url.toString();
};

export const fetchTasksList = (
  baseUrl: string,
  page: number,
  pageSize: number,
  range: TaskRange,
) =>
  fetchJson<TaskListResponse>(buildTasksUrl(baseUrl, page + 1, pageSize, range));

export const fetchTaskSummary = (baseUrl: string, range: TaskRange) =>
  fetchJson<TaskSummaryResponse>(buildSummaryUrl(baseUrl, range));
