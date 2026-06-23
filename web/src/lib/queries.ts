import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { ProposalInput } from "./types";

export const useOpportunities = (type?: string) =>
  useQuery({ queryKey: ["opportunities", type ?? "all"], queryFn: () => api.opportunities(type) });

export const useOpportunity = (id: number) =>
  useQuery({ queryKey: ["opportunity", id], queryFn: () => api.opportunity(id), enabled: !!id });

export const useProfile = () => useQuery({ queryKey: ["profile"], queryFn: api.profile });
export const useInsights = () => useQuery({ queryKey: ["insights"], queryFn: api.insights });
export const useBoard = () => useQuery({ queryKey: ["board"], queryFn: api.board });

export const useSubmitProposal = (id: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProposalInput) => api.submitProposal(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["opportunity", id] });
      qc.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
};
