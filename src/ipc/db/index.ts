import * as handlers from "./handlers";

export const db = {
  getTodos: handlers.getTodos,
  createTodo: handlers.createTodo,
  toggleTodo: handlers.toggleTodo,
  deleteTodo: handlers.deleteTodo,
};