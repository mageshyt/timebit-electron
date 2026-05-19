import { create } from "zustand";
import type { UserSettings } from "./types";

interface SettingsStore {
  draftSettings: Partial<UserSettings>;
  setDraftSettings: (settings: Partial<UserSettings>) => void;
  updateDraftField: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void;
  resetDraft: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  draftSettings: {},
  setDraftSettings: (settings) => set({ draftSettings: settings }),
  updateDraftField: (key, value) =>
    set((state) => ({
      draftSettings: { ...state.draftSettings, [key]: value },
    })),
  resetDraft: () => set({ draftSettings: {} }),
}));
