import { app } from "./app";
import { shell } from "./shell";
import { theme } from "./theme";
import { window } from "./window";
import { settings } from "./features/settings";
import { habits } from "./features/habits";

export const router = {
  theme,
  window,
  app,
  shell,
  settings,
  habits,
};
