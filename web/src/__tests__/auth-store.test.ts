import { beforeEach, describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { USERS } from "@/lib/access";
import {
  effectiveRole,
  useAllUsers,
  useAuthStore,
  useCurrentUser,
  usePermission,
} from "@/lib/auth-store";

function reset() {
  useAuthStore.setState({ currentUserId: null, roleOverrides: {}, extraUsers: [] });
}

describe("auth-store · login / logout", () => {
  beforeEach(reset);

  it("logs in with valid demo credentials", () => {
    const ok = useAuthStore.getState().login("admin", "admin");
    expect(ok).toBe(true);
    expect(useAuthStore.getState().currentUserId).toBe("u-admin");
  });

  it("matches email case-insensitively and trims whitespace", () => {
    const ok = useAuthStore.getState().login("  MANAGER@SRIJAN.DEV ", "manager123");
    expect(ok).toBe(true);
    expect(useAuthStore.getState().currentUserId).toBe("u-manager");
  });

  it("rejects an unknown email", () => {
    expect(useAuthStore.getState().login("nobody@srijan.dev", "x")).toBe(false);
    expect(useAuthStore.getState().currentUserId).toBeNull();
  });

  it("rejects a wrong password", () => {
    expect(useAuthStore.getState().login("admin", "wrong")).toBe(false);
    expect(useAuthStore.getState().currentUserId).toBeNull();
  });

  it("logout clears the current user", () => {
    useAuthStore.getState().login("admin", "admin");
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().currentUserId).toBeNull();
  });
});

describe("auth-store · setRole", () => {
  beforeEach(reset);

  it("records a role override for a user", () => {
    useAuthStore.getState().setRole("u-member", "manager");
    expect(useAuthStore.getState().roleOverrides["u-member"]).toBe("manager");
  });

  it("overwrites an existing override", () => {
    useAuthStore.getState().setRole("u-member", "manager");
    useAuthStore.getState().setRole("u-member", "viewer");
    expect(useAuthStore.getState().roleOverrides["u-member"]).toBe("viewer");
  });
});

describe("auth-store · addUser / removeUser", () => {
  beforeEach(reset);

  it("adds a new user that can then log in", () => {
    const res = useAuthStore.getState().addUser({
      name: "Aarti Sharma",
      email: "aarti@srijan.dev",
      password: "secret1",
      role: "member",
      title: "Designer",
      initials: "AS",
    });
    expect(res.ok).toBe(true);
    expect(useAuthStore.getState().extraUsers).toHaveLength(1);
    expect(useAuthStore.getState().login("aarti@srijan.dev", "secret1")).toBe(true);
  });

  it("rejects a duplicate email (case-insensitive) against seed users", () => {
    const res = useAuthStore.getState().addUser({
      name: "Fake Admin",
      email: "ADMIN",
      password: "x",
      role: "admin",
      title: "x",
      initials: "FA",
    });
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/already exists/i);
    expect(useAuthStore.getState().extraUsers).toHaveLength(0);
  });

  it("rejects a duplicate email against another added user", () => {
    const add = () =>
      useAuthStore.getState().addUser({
        name: "Dup",
        email: "dup@srijan.dev",
        password: "pw",
        role: "viewer",
        title: "t",
        initials: "DU",
      });
    expect(add().ok).toBe(true);
    expect(add().ok).toBe(false);
    expect(useAuthStore.getState().extraUsers).toHaveLength(1);
  });

  it("removeUser deletes the added user", () => {
    useAuthStore.getState().addUser({
      name: "Temp",
      email: "temp@srijan.dev",
      password: "pw",
      role: "viewer",
      title: "t",
      initials: "TE",
    });
    const id = useAuthStore.getState().extraUsers[0].id;
    useAuthStore.getState().removeUser(id);
    expect(useAuthStore.getState().extraUsers).toHaveLength(0);
  });

  it("removeUser signs out the user if they were logged in", () => {
    useAuthStore.getState().addUser({
      name: "Self",
      email: "self@srijan.dev",
      password: "pw",
      role: "member",
      title: "t",
      initials: "SE",
    });
    const id = useAuthStore.getState().extraUsers[0].id;
    useAuthStore.getState().login("self@srijan.dev", "pw");
    expect(useAuthStore.getState().currentUserId).toBe(id);
    useAuthStore.getState().removeUser(id);
    expect(useAuthStore.getState().currentUserId).toBeNull();
  });
});

describe("auth-store · effectiveRole", () => {
  it("returns the user's own role when no override exists", () => {
    const member = USERS.find((u) => u.id === "u-member")!;
    expect(effectiveRole(member, {})).toBe("member");
  });

  it("returns the override when present", () => {
    const member = USERS.find((u) => u.id === "u-member")!;
    expect(effectiveRole(member, { "u-member": "admin" })).toBe("admin");
  });
});

describe("auth-store · hooks", () => {
  beforeEach(reset);

  it("useCurrentUser is null when signed out and strips the password", () => {
    const { result, rerender } = renderHook(() => useCurrentUser());
    expect(result.current).toBeNull();

    act(() => {
      useAuthStore.getState().login("admin", "admin");
    });
    rerender();

    expect(result.current?.name).toBe("Admin");
    expect(result.current?.role).toBe("admin");
    expect(result.current as unknown as Record<string, unknown>).not.toHaveProperty("password");
  });

  it("useCurrentUser reflects a role override", () => {
    const { result, rerender } = renderHook(() => useCurrentUser());
    act(() => {
      useAuthStore.getState().login("member@srijan.dev", "member123");
      useAuthStore.getState().setRole("u-member", "manager");
    });
    rerender();
    expect(result.current?.role).toBe("manager");
  });

  it("usePermission resolves from the effective role", () => {
    const { result, rerender } = renderHook(() => usePermission("users:manage"));
    expect(result.current).toBe(false); // signed out

    act(() => {
      useAuthStore.getState().login("admin", "admin");
    });
    rerender();
    expect(result.current).toBe(true);

    act(() => {
      useAuthStore.getState().login("viewer@srijan.dev", "viewer123");
    });
    rerender();
    expect(result.current).toBe(false);
  });

  it("useAllUsers includes seed users plus added ones", () => {
    const { result, rerender } = renderHook(() => useAllUsers());
    expect(result.current).toHaveLength(USERS.length);

    act(() => {
      useAuthStore.getState().addUser({
        name: "Extra",
        email: "extra@srijan.dev",
        password: "pw",
        role: "viewer",
        title: "t",
        initials: "EX",
      });
    });
    rerender();
    expect(result.current).toHaveLength(USERS.length + 1);
  });
});
