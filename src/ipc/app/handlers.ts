import { broadcaster } from "@/server/ws/broadcaster";
import { os } from "@orpc/server";
import { app } from "electron";
import z from "zod";

export const currentPlatfom = os.handler(() => {
  return process.platform;
});

export const appVersion = os.handler(() => {
  return app.getVersion();
});


export const emitWsEvent = os
  .input(z.object({ type: z.string(), payload: z.unknown().optional() }))
  .handler(({ input }) => {
  broadcaster.broadcast(input as Parameters<typeof broadcaster.broadcast>[0]);
  });