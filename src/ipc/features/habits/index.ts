import { createHabitHandler, deleteHabitHandler, updateHabitHandler } from "./handlers";

export const habits = {
  createHabit: createHabitHandler,
  deleteHabit: deleteHabitHandler,
  updateHabit: updateHabitHandler,
};
