export type TaskStatus = "IN PROGRESS" | "TODO" | "DONE";
export type TaskPriority = "High" | "Medium" | "Low";
export type FilterTab = "Today" | "Week" | "All";

export interface Task {
  id: number;
  status: TaskStatus;
  title: string;
  subtitle: string;
  category: string | null;
  priority: TaskPriority;
  estimate: string;
  done: boolean;
  scheduleAt: string;
  completedAt: string | null;
  dueTime: string | null;
}

export interface TaskForm {
  title: string;
  subtitle: string;
  category?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate: string;
  scheduleAt?: string;
  dueTime?: string;
}

export type TaskResponse = Task & {
  createdAt: string;
  updatedAt: string;
};

export type TaskListResponse = {
  data: TaskResponse[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type TaskSummaryResponse = {
  tasks: {
    total: number;
    completed: number;
    remaining: number;
  };
};

export type TaskRange = "today" | "week" | "all";

export type TaskUpdatePayload = {
  id: number;
  form: TaskForm;
};

export type TaskTogglePayload = {
  id: number;
  done: boolean;
  status: Task["status"];
};
