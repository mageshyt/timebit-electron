import { os } from "@orpc/server";
import { createHabit, deleteHabit } from "@/server/services/habits.service";
import { broadcaster } from "@/server/ws/broadcaster";
import z from "zod";

export const createHabitHandler = os
  .input(
    z.object({
      title: z.string(),
      category: z.string().optional(),
      resetFrequency: z.string().optional(),
    })
  )
  .handler(async ({ input }) => {
    const habit = await createHabit(input);
    broadcaster.broadcast({ type: "habit:updated", payload: habit });
    return habit;
  });

export const deleteHabitHandler = os
  .input(z.number())
  .handler(async ({ input: id }) => {
    await deleteHabit(id);
    broadcaster.broadcast({ type: "habit:updated", payload: { reset: true } });
    return { ok: true };
  });
