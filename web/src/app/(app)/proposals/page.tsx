"use client";

import Link from "next/link";
import { Clock, FileText } from "lucide-react";
import { useProposals } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TYPE_META, type ProposalRow } from "@/lib/types";

const STATUS_META: Record<ProposalRow["status"], { label: string; bg: string; fg: string }> = {
  submitted: { label: "Under review", bg: "#FBF3E2", fg: "#B07F1E" },
  accepted: { label: "Accepted", bg: "#E6F4EC", fg: "#1F8A5B" },
  rejected: { label: "Not selected", bg: "#FCEEE9", fg: "#C2552E" },
};

export default function ProposalsPage() {
  const { data: proposals = [], isLoading } = useProposals();

  if (isLoading) return <div className="p-10 text-muted-2">Loading…</div>;

  const counts = {
    total: proposals.length,
    submitted: proposals.filter((p) => p.status === "submitted").length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
  };

  return (
    <div className="animate-viewIn max-w-[980px] mx-auto px-8 py-7 pb-20">
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">My Proposals</h1>
      <p className="text-[14.5px] text-muted mb-6">
        Every bid you&apos;ve submitted to internal gigs &amp; challenges, with live status.
      </p>

      <div className="grid grid-cols-3 gap-3.5 mb-6">
        {[
          { label: "Total submitted", value: counts.total, color: "#1C1B1A" },
          { label: "Under review", value: counts.submitted, color: "#B07F1E" },
          { label: "Accepted", value: counts.accepted, color: "#1F8A5B" },
        ].map((s) => (
          <Card key={s.label} className="p-[16px_18px]">
            <div className="text-[12px] text-muted-2 font-semibold mb-2">{s.label}</div>
            <div className="text-[27px] font-extrabold tracking-[-0.6px]" style={{ color: s.color }}>
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      {proposals.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText size={34} className="mx-auto text-muted-2 mb-3" />
          <div className="font-bold text-[16px] mb-1">No proposals yet</div>
          <div className="text-[13.5px] text-muted-2 mb-5">
            Find a gig that fits your skills and submit your first bid.
          </div>
          <Link
            href="/explore"
            className="inline-flex h-10 items-center px-4 rounded-[9px] bg-primary text-white font-bold text-sm"
          >
            Explore opportunities
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {proposals.map((p) => {
            const tm = TYPE_META[p.opportunityType] ?? TYPE_META.automation;
            const sm = STATUS_META[p.status];
            return (
              <Link key={p.id} href={`/explore/${p.opportunityId}`}>
                <Card className="p-[17px_19px] hover:border-[#DAD8D0] hover:shadow-[0_8px_24px_rgba(28,27,26,0.06)] transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge style={{ background: tm.bg, color: tm.fg }}>{tm.label}</Badge>
                    <Badge style={{ background: sm.bg, color: sm.fg }} className="font-mono">
                      {sm.label}
                    </Badge>
                    <span className="ml-auto flex items-center gap-1.5 text-[12px] text-muted-2 font-medium">
                      <Clock size={13} /> {p.weeklyHours} hrs/wk pledged
                    </span>
                  </div>
                  <h3 className="text-[16px] font-bold tracking-[-0.3px] mb-1.5">{p.opportunityTitle}</h3>
                  {p.why && (
                    <p className="text-[13.5px] leading-normal text-muted line-clamp-2">
                      <span className="font-semibold text-ink-2">Why me: </span>
                      {p.why}
                    </p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
