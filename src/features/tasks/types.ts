export type TaskStatus = "IN PROGRESS" | "TODO" | "DONE";
export type TaskPriority = "High" | "Medium" | "Low";
export type FilterTab = "Today" | "Week" | "All";

export interface Task {
  id: number;
  status: TaskStatus;
  title: string;
  subtitle: string;
  priority: TaskPriority;
  estimate: string;
  done: boolean;
}

export interface TaskForm {
  title: string;
  subtitle: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate: string;
}
