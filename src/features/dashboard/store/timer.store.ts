import { create } from "zustand";


export const DEFAULT_SESSION_MS = 25 * 60 * 1000;


interface TimerState {
  startTime: number | null;
  elapsed: number;
  isActive: boolean;
  sessionDuration: number;
}

interface TimerActions {
  start: () => void;
  pause: () => void;
  reset: () => void;
  _tick: () => void;
}

type TimerStore = TimerState & TimerActions;

// ── Store ─────────────────────────────────────────────────────────────────────

export const useTimerStore = create<TimerStore>((set, get) => ({
  startTime: null,
  elapsed: 0,
  isActive: false,
  sessionDuration: DEFAULT_SESSION_MS,

  start() {
    const { elapsed, startTime } = get();
    const resumeFrom = startTime !== null ? Date.now() - elapsed : Date.now();
    set({ isActive: true, startTime: resumeFrom, elapsed: startTime !== null ? elapsed : 0 });
  },

  pause() {
    set({ isActive: false });
  },

  reset() {
    set({ isActive: false, startTime: null, elapsed: 0 });
  },

  _tick() {
    const { isActive, startTime } = get();
    if (!isActive || startTime === null) return;
    set({ elapsed: Date.now() - startTime });
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
