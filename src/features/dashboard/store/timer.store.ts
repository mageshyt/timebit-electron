import { create } from "zustand";

export const DEFAULT_SESSION_MS = 25 * 60 * 1000;

export const SESSION_CATEGORIES = [
  "General",
  "Project Work",
  "Studies",
  "Admin",
  "Personal",
] as const;

export type SessionCategory = (typeof SESSION_CATEGORIES)[number];

export type TimerMode = "focus" | "short_break" | "long_break";

interface TimerState {
  startTime: number | null;
  elapsed: number;
  isActive: boolean;
  sessionDuration: number;
  activeSessionId: number | null;
  category: SessionCategory;
  taskId: number | null;
  taskLabel: string | null;
  sessionCount: number;
  mode: TimerMode;
  focusDurationMins: number;
  focusShortBreakMins: number;
  focusLongBreakMins: number;
}

interface TimerActions {
  _tick: () => void;
  pause: () => void;
  reset: () => void;
  setCategory: (cat: SessionCategory) => void;
  setTask: (id: number | null, label: string | null) => void;
  _onSessionStarted: (sessionId: number) => void;
  _onSessionCompleted: () => void;
  _onSessionAbandoned: () => void;
  setSessionCount: (n: number) => void;
  setMode: (mode: TimerMode) => void;
  syncSettings: (settings: {
    focusDurationMins: number;
    focusShortBreakMins: number;
    focusLongBreakMins: number;
  }) => void;
}

type TimerStore = TimerState & TimerActions;

export const useTimerStore = create<TimerStore>((set, get) => ({
  startTime: null,
  elapsed: 0,
  isActive: false,
  sessionDuration: DEFAULT_SESSION_MS,
  activeSessionId: null,
  category: "General",
  taskId: null,
  taskLabel: null,
  sessionCount: 0,
  mode: "focus",
  focusDurationMins: 25,
  focusShortBreakMins: 5,
  focusLongBreakMins: 15,

  _tick() {
    const { isActive, startTime, sessionDuration } = get();
    if (!isActive || startTime === null) return;
    const elapsed = Date.now() - startTime;
    const finalElapsed = Math.min(elapsed, sessionDuration);
    set({ elapsed: finalElapsed });
    // Auto-complete when session time is reached
    if (elapsed >= sessionDuration) {
      set({ isActive: false });
    }
  },

  pause() {
    set({ isActive: false });
  },

  reset() {
    const { mode, focusDurationMins, focusShortBreakMins, focusLongBreakMins } = get();
    let durationMins = focusDurationMins;
    if (mode === "short_break") durationMins = focusShortBreakMins;
    else if (mode === "long_break") durationMins = focusLongBreakMins;
    set({
      isActive: false,
      startTime: null,
      elapsed: 0,
      activeSessionId: null,
      sessionDuration: durationMins * 60 * 1000,
    });
  },

  setCategory(cat) {
    set({ category: cat });
  },

  setTask(id, label) {
    set({ taskId: id, taskLabel: label });
  },

  _onSessionStarted(sessionId) {
    const resumeFrom = Date.now();
    set({ isActive: true, startTime: resumeFrom, elapsed: 0, activeSessionId: sessionId });
  },

  _onSessionCompleted() {
    const { mode, sessionCount, focusDurationMins, focusShortBreakMins, focusLongBreakMins } = get();
    if (mode === "focus") {
      const newSessionCount = sessionCount + 1;
      const nextMode = newSessionCount % 4 === 0 ? "long_break" : "short_break";
      const nextDurationMins = nextMode === "long_break" ? focusLongBreakMins : focusShortBreakMins;
      set({
        isActive: false,
        startTime: null,
        elapsed: 0,
        activeSessionId: null,
        sessionCount: newSessionCount,
        taskId: null,
        taskLabel: null,
        mode: nextMode,
        sessionDuration: nextDurationMins * 60 * 1000,
      });
    } else {
      // Completed short_break or long_break
      set({
        isActive: false,
        startTime: null,
        elapsed: 0,
        activeSessionId: null,
        mode: "focus",
        sessionDuration: focusDurationMins * 60 * 1000,
      });
    }
  },

  _onSessionAbandoned() {
    const { mode, focusDurationMins, focusShortBreakMins, focusLongBreakMins } = get();
    let durationMins = focusDurationMins;
    if (mode === "short_break") durationMins = focusShortBreakMins;
    else if (mode === "long_break") durationMins = focusLongBreakMins;
    set({
      isActive: false,
      startTime: null,
      elapsed: 0,
      activeSessionId: null,
      sessionDuration: durationMins * 60 * 1000,
    });
  },

  setSessionCount(n) {
    set({ sessionCount: n });
  },

  setMode(mode) {
    const { isActive, focusDurationMins, focusShortBreakMins, focusLongBreakMins } = get();
    if (isActive) return;
    let durationMins = focusDurationMins;
    if (mode === "short_break") durationMins = focusShortBreakMins;
    else if (mode === "long_break") durationMins = focusLongBreakMins;
    set({
      mode,
      elapsed: 0,
      startTime: null,
      sessionDuration: durationMins * 60 * 1000,
    });
  },

  syncSettings(settings) {
    const { isActive, mode } = get();
    set({
      focusDurationMins: settings.focusDurationMins,
      focusShortBreakMins: settings.focusShortBreakMins,
      focusLongBreakMins: settings.focusLongBreakMins,
    });
    if (!isActive) {
      let durationMins = settings.focusDurationMins;
      if (mode === "short_break") durationMins = settings.focusShortBreakMins;
      else if (mode === "long_break") durationMins = settings.focusLongBreakMins;
      set({ sessionDuration: durationMins * 60 * 1000 });
    }
  },
}));

let tickHandle: ReturnType<typeof setInterval> | null = null;

export function startTimerEngine() {
  if (tickHandle !== null) return;
  tickHandle = setInterval(() => {
    useTimerStore.getState()._tick();
  }, 250);
}

startTimerEngine();
