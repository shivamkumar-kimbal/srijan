import { describe, expect, it } from "vitest";
import { can, ROLE_PERMISSIONS, USERS, type Role } from "@/lib/access";

describe("access control", () => {
  it("admin has every permission", () => {
    const all = ROLE_PERMISSIONS.admin;
    expect(all).toContain("users:manage");
    expect(all).toContain("admin:access");
  });

  it("viewer is read-only", () => {
    expect(can("viewer", "explore:view")).toBe(true);
    expect(can("viewer", "proposals:submit")).toBe(false);
    expect(can("viewer", "users:manage")).toBe(false);
  });

  it("only admin can manage users", () => {
    const roles: Role[] = ["admin", "manager", "member", "viewer"];
    const allowed = roles.filter((r) => can(r, "users:manage"));
    expect(allowed).toEqual(["admin"]);
  });

  it("member can apply to jobs and submit proposals but not manage projects", () => {
    expect(can("member", "jobs:apply")).toBe(true);
    expect(can("member", "proposals:submit")).toBe(true);
    expect(can("member", "projects:manage")).toBe(false);
  });

  it("ships a default admin / admin demo account", () => {
    const admin = USERS.find((u) => u.email === "admin");
    expect(admin?.password).toBe("admin");
    expect(admin?.role).toBe("admin");
  });
});
