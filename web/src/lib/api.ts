import type { Board, Insights, Opportunity, Profile, ProposalInput } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  opportunities: (type?: string) =>
    req<Opportunity[]>(`/opportunities${type && type !== "all" ? `?type=${type}` : ""}`),
  opportunity: (id: number) => req<Opportunity>(`/opportunities/${id}`),
  submitProposal: (id: number, body: ProposalInput) =>
    req<unknown>(`/opportunities/${id}/proposals`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  profile: () => req<Profile>("/profile"),
  insights: () => req<Insights>("/insights"),
  board: () => req<Board>("/board"),
};
