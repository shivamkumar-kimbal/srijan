import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ProfileEdits {
  name?: string;
  title?: string;
  status?: string;
}

interface UIState {
  filter: string;
  setFilter: (f: string) => void;
  available: boolean;
  toggleAvailable: () => void;
  profileEdits: ProfileEdits;
  setProfileEdits: (edits: ProfileEdits) => void;
}

// Falls back to an in-memory store when localStorage is unavailable
// (SSR, unit tests), so persistence never throws.
const memory = new Map<string, string>();
const hasLS = () => {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
};
const safeStorage = {
  getItem: (k: string) => (hasLS() ? window.localStorage.getItem(k) : memory.get(k) ?? null),
  setItem: (k: string, v: string) =>
    hasLS() ? window.localStorage.setItem(k, v) : void memory.set(k, v),
  removeItem: (k: string) =>
    hasLS() ? window.localStorage.removeItem(k) : void memory.delete(k),
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      filter: "all",
      setFilter: (filter) => set({ filter }),
      available: true,
      toggleAvailable: () => set((s) => ({ available: !s.available })),
      profileEdits: {},
      setProfileEdits: (edits) =>
        set((s) => ({ profileEdits: { ...s.profileEdits, ...edits } })),
    }),
    {
      name: "srijan-ui",
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ profileEdits: s.profileEdits }),
    }
  )
);
