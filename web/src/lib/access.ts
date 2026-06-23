// Role-based access config for the Srijan demo.
// NOTE: these are demo credentials for local/dev use only — not real auth.

export type Role = "admin" | "manager" | "member" | "viewer";

export type Permission =
  | "explore:view"
  | "proposals:submit"
  | "projects:manage"
  | "automation:publish"
  | "jobs:apply"
  | "rewards:redeem"
  | "admin:access"
  | "users:manage";

export const PERMISSIONS: { key: Permission; label: string }[] = [
  { key: "explore:view", label: "View opportunities" },
  { key: "proposals:submit", label: "Submit proposals" },
  { key: "projects:manage", label: "Manage projects" },
  { key: "automation:publish", label: "Publish automations" },
  { key: "jobs:apply", label: "Apply to internal jobs" },
  { key: "rewards:redeem", label: "Redeem rewards" },
  { key: "admin:access", label: "Access admin panel" },
  { key: "users:manage", label: "Manage users & roles" },
];

export const ROLES: { key: Role; label: string; desc: string; color: string }[] = [
  { key: "admin", label: "Admin", desc: "Full access, manages users & roles.", color: "#5046E5" },
  { key: "manager", label: "Manager", desc: "Runs projects, posts gigs & jobs.", color: "#1F8A5B" },
  { key: "member", label: "Member", desc: "Bids on gigs, applies to jobs.", color: "#B07F1E" },
  { key: "viewer", label: "Viewer", desc: "Read-only access to the board.", color: "#5B5A55" },
];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: PERMISSIONS.map((p) => p.key),
  manager: [
    "explore:view",
    "proposals:submit",
    "projects:manage",
    "automation:publish",
    "jobs:apply",
    "rewards:redeem",
  ],
  member: ["explore:view", "proposals:submit", "jobs:apply", "rewards:redeem"],
  viewer: ["explore:view"],
};

export function can(role: Role, perm: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(perm);
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  title: string;
  initials: string;
}

// Demo accounts. Sign in with email + password (admin / admin for the admin).
export const USERS: DemoUser[] = [
  {
    id: "u-admin",
    name: "Admin",
    email: "admin",
    password: "admin",
    role: "admin",
    title: "Platform Administrator",
    initials: "AD",
  },
  {
    id: "u-manager",
    name: "Priya Nair",
    email: "manager@srijan.dev",
    password: "manager123",
    role: "manager",
    title: "Engineering Manager · Platform",
    initials: "PN",
  },
  {
    id: "u-member",
    name: "Shivam Kumar",
    email: "member@srijan.dev",
    password: "member123",
    role: "member",
    title: "Senior Software Engineer",
    initials: "SK",
  },
  {
    id: "u-viewer",
    name: "Guest Viewer",
    email: "viewer@srijan.dev",
    password: "viewer123",
    role: "viewer",
    title: "Read-only Guest",
    initials: "GV",
  },
];
