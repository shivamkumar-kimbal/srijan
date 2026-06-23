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
  extraUsers: DemoUser[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setRole: (userId: string, role: Role) => void;
  addUser: (input: Omit<DemoUser, "id">) => { ok: boolean; error?: string };
  removeUser: (userId: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      roleOverrides: {},
      extraUsers: [],
      login: (email, password) => {
        const all = [...USERS, ...get().extraUsers];
        const match = all.find(
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
      addUser: (input) => {
        const email = input.email.trim().toLowerCase();
        const exists = [...USERS, ...get().extraUsers].some(
          (u) => u.email.toLowerCase() === email
        );
        if (exists) return { ok: false, error: "That email already exists." };
        const user: DemoUser = {
          ...input,
          email: input.email.trim(),
          id: `u-${Date.now().toString(36)}`,
        };
        set((s) => ({ extraUsers: [...s.extraUsers, user] }));
        return { ok: true };
      },
      removeUser: (userId) =>
        set((s) => ({
          extraUsers: s.extraUsers.filter((u) => u.id !== userId),
          currentUserId: s.currentUserId === userId ? null : s.currentUserId,
        })),
    }),
    {
      name: "srijan-auth",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);

// All users = seed accounts plus any added by an admin at runtime.
export function useAllUsers(): DemoUser[] {
  const extra = useAuthStore((s) => s.extraUsers);
  return [...USERS, ...extra];
}

// Effective role for a user (config role unless an admin overrode it).
export function effectiveRole(user: DemoUser, overrides: Record<string, Role>): Role {
  return overrides[user.id] ?? user.role;
}

export function useCurrentUser(): SessionUser | null {
  const id = useAuthStore((s) => s.currentUserId);
  const overrides = useAuthStore((s) => s.roleOverrides);
  const extra = useAuthStore((s) => s.extraUsers);
  if (!id) return null;
  const u = [...USERS, ...extra].find((x) => x.id === id);
  if (!u) return null;
  const { password: _pw, ...rest } = u;
  void _pw;
  return { ...rest, role: effectiveRole(u, overrides) };
}

export function usePermission(perm: Permission): boolean {
  const user = useCurrentUser();
  return !!user && can(user.role, perm);
}
