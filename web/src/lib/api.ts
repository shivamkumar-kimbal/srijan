import type { Board, Insights, Opportunity, OppInput, Profile, ProposalInput, ProposalRow } from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// When auth is enabled, the Entra access token is attached to every API call.
// Set from the client session (see components/providers). No-op in dev.
let accessToken: string | undefined;
export function setAccessToken(token?: string) {
  accessToken = token;
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init?.headers ?? {}),
    },
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
  createOpportunity: (body: OppInput) =>
    req<Opportunity>("/opportunities", { method: "POST", body: JSON.stringify(body) }),
  submitProposal: (id: number, body: ProposalInput) =>
    req<unknown>(`/opportunities/${id}/proposals`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  proposals: (author?: string) =>
    req<ProposalRow[]>(`/proposals${author ? `?author=${encodeURIComponent(author)}` : ""}`),
  profile: () => req<Profile>("/profile"),
  insights: () => req<Insights>("/insights"),
  board: () => req<Board>("/board"),
};
