export type OppType =
  | "automation"
  | "innovation"
  | "cost"
  | "docs"
  | "techdebt"
  | "transfer";

export interface Role {
  name: string;
  status: "open" | "filled";
  slots: string;
}

export interface Opportunity {
  id: number;
  type: OppType;
  title: string;
  desc: string;
  longDesc: string;
  skills: string[];
  match: number;
  days: number;
  team: string;
  proposals: number;
  ownerName: string;
  ownerDept: string;
  ownerInitials: string;
  rewardBig: string;
  rewardLabel: string;
  matchPct: string;
  rewardChips: string[];
  roles: Role[];
}

export interface ProposalInput {
  why: string;
  experience: string;
  weeklyHours: number;
  authorName?: string;
}

export interface Profile {
  name: string;
  title: string;
  initials: string;
  status: string;
  promotionReadiness: number;
  certs: string[];
  stats: { label: string; value: string; sub: string; color: string }[];
  skills: { name: string; level: string; pct: string }[];
  depts: string[];
  completedProjects: { title: string; meta: string; points: string }[];
  reviews: { text: string; author: string }[];
}

export interface Insights {
  kpis: { label: string; value: string; delta: string; up: boolean; sub: string }[];
  costBars: { label: string; value: string; pct: string }[];
  performers: { rank: string; name: string; meta: string; points: string; initials: string; ai: number }[];
}

export interface Board {
  project: { title: string; lead: string; role: string; due: string };
  teamAvatars: { initials: string; i: number }[];
  columns: {
    name: string;
    dot: string;
    tasks: { id: string; title: string; tag: string; tagColor: string; assignee: string; ai: number }[];
  }[];
}

export const TYPE_META: Record<OppType, { label: string; bg: string; fg: string }> = {
  automation: { label: "Automation", bg: "#EEEDFD", fg: "#5046E5" },
  innovation: { label: "Innovation Challenge", bg: "#F3EAFB", fg: "#8B3FD1" },
  cost: { label: "Cost Optimization", bg: "#E6F4EC", fg: "#1F8A5B" },
  docs: { label: "Documentation", bg: "#FBF3E2", fg: "#B07F1E" },
  techdebt: { label: "Tech Debt", bg: "#FCEEE9", fg: "#C2552E" },
  transfer: { label: "Internal Transfer", bg: "#EEEFF1", fg: "#5B5A55" },
};

export const AVATAR_COLORS = ["#5046E5", "#1F8A5B", "#C2552E", "#8B3FD1", "#2A6FDB", "#B07F1E"];
