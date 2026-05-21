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

  _tick() {
    const { isActive, startTime } = get();
    if (!isActive || startTime === null) return;
    const elapsed = Date.now() - startTime;
    set({ elapsed });
    // Auto-complete when session time is reached
    if (elapsed >= get().sessionDuration) {
      set({ isActive: false });
    }
  },

  pause() {
    set({ isActive: false });
  },

  reset() {
    set({ isActive: false, startTime: null, elapsed: 0, activeSessionId: null });
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
    set((s) => ({
      isActive: false,
      startTime: null,
      elapsed: 0,
      activeSessionId: null,
      sessionCount: s.sessionCount + 1,
      taskId: null,
      taskLabel: null,
    }));
  },

  _onSessionAbandoned() {
    set({ isActive: false, startTime: null, elapsed: 0, activeSessionId: null });
  },

  setSessionCount(n) {
    set({ sessionCount: n });
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
