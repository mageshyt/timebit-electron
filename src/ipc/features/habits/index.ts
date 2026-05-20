import { createHabitHandler, deleteHabitHandler } from "./handlers";

export const habits = {
  createHabit: createHabitHandler,
  deleteHabit: deleteHabitHandler,
};
