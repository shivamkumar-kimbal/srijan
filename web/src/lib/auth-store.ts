"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  can,
  USERS,
  type DemoUser,
  type Permission,
  type Role,
} from "./access";

// localStorage with an in-memory fallback (SSR / tests) so persistence never throws.
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

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  initials: string;
}

interface AuthState {
  currentUserId: string | null;
  roleOverrides: Record<string, Role>;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setRole: (userId: string, role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUserId: null,
      roleOverrides: {},
      login: (email, password) => {
        const match = USERS.find(
          (u) =>
            u.email.toLowerCase() === email.trim().toLowerCase() &&
            u.password === password
        );
        if (!match) return false;
        set({ currentUserId: match.id });
        return true;
      },
      logout: () => set({ currentUserId: null }),
      setRole: (userId, role) =>
        set((s) => ({ roleOverrides: { ...s.roleOverrides, [userId]: role } })),
    }),
    {
      name: "srijan-auth",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);

// Effective role for a user (config role unless an admin overrode it).
export function effectiveRole(user: DemoUser, overrides: Record<string, Role>): Role {
  return overrides[user.id] ?? user.role;
}

export function useCurrentUser(): SessionUser | null {
  const id = useAuthStore((s) => s.currentUserId);
  const overrides = useAuthStore((s) => s.roleOverrides);
  if (!id) return null;
  const u = USERS.find((x) => x.id === id);
  if (!u) return null;
  const { password: _pw, ...rest } = u;
  void _pw;
  return { ...rest, role: effectiveRole(u, overrides) };
}

export function usePermission(perm: Permission): boolean {
  const user = useCurrentUser();
  return !!user && can(user.role, perm);
}
