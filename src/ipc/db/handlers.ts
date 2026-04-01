import { os } from "@orpc/server";
import { z } from "zod";
import prisma from "@/db/index";

export const getTodos = os.handler(async () => {
  return await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
});

export const createTodo = os
  .input(
    z.object({
      title: z.string().min(1),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ input }) => {
    return await prisma.todo.create({
      data: {
        title: input.title,
        notes: input.notes,
      },
    });
  });

export const toggleTodo = os
  .input(
    z.object({
      id: z.number(),
      completed: z.boolean(),
    }),
  )
  .handler(async ({ input }) => {
    return await prisma.todo.update({
      where: { id: input.id },
      data: {
        completed: input.completed,
        completedAt: input.completed ? new Date() : null,
      },
    });
  });

export const deleteTodo = os
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    return await prisma.todo.delete({
      where: { id: input.id },
    });
  });