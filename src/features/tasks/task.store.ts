import { create } from "zustand";
import type { FilterTab, Task } from "./types";

type TaskUIState = {
  activeFilter: FilterTab;
  page: number;
  addOpen: boolean;
  editTarget: Task | null;

  setActiveFilter: (tab: FilterTab) => void;
  setPage: (page: number, totalPages?: number) => void;
  openAdd: () => void;
  closeAdd: () => void;
  openEdit: (task: Task) => void;
  closeEdit: () => void;
};

export const useTaskStore = create<TaskUIState>((set) => ({
  activeFilter: "Today",
  page: 0,
  addOpen: false,
  editTarget: null,

  setActiveFilter: (tab) => set({ activeFilter: tab, page: 0 }),

  setPage: (page, totalPages) =>
    set({
      page:
        totalPages != null
          ? Math.min(page, Math.max(0, totalPages - 1))
          : Math.max(0, page),
    }),

  openAdd: () => set({ addOpen: true }),
  closeAdd: () => set({ addOpen: false }),
  openEdit: (task) => set({ editTarget: task }),
  closeEdit: () => set({ editTarget: null }),
}));
