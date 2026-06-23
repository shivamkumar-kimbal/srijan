import { create } from "zustand";

interface UIState {
  filter: string;
  setFilter: (f: string) => void;
  available: boolean;
  toggleAvailable: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),
  available: true,
  toggleAvailable: () => set((s) => ({ available: !s.available })),
}));
