import { ipc } from "@/ipc/manager";

export async function getTodos() {
  return await ipc.client.db.getTodos();
}

export async function createTodo(title: string, notes?: string) {
  return await ipc.client.db.createTodo({ title, notes });
}

export async function toggleTodo(id: number, completed: boolean) {
  return await ipc.client.db.toggleTodo({ id, completed });
}

export async function deleteTodo(id: number) {
  return await ipc.client.db.deleteTodo({ id });
}