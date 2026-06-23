"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Check } from "lucide-react";
import { useOpportunity, useSubmitProposal } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, SkillChip } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TYPE_META } from "@/lib/types";

export default function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const oid = Number(id);
  const { data: sel, isLoading } = useOpportunity(oid);
  const submit = useSubmitProposal(oid);

  const [showForm, setShowForm] = useState(false);
  const [why, setWhy] = useState("");
  const [exp, setExp] = useState("");
  const [hours, setHours] = useState(6);

  if (isLoading || !sel) {
    return <div className="p-10 text-muted-2">Loading…</div>;
  }

  const m = TYPE_META[sel.type];
  const good = sel.match >= 85;
  const submitted = submit.isSuccess;

  return (
    <div className="animate-viewIn max-w-[1080px] mx-auto px-8 py-6 pb-20">
      <Link href="/explore" className="flex items-center gap-1.5 text-muted font-semibold text-[13.5px] py-1.5 mb-3.5">
        <ChevronLeft size={16} /> Back to board
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-7 items-start">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Badge style={{ background: m.bg, color: m.fg }}>{m.label}</Badge>
            <Badge style={{ background: good ? "#E6F4EC" : "#FBF3E2", color: good ? "#1F8A5B" : "#B07F1E" }}>
              {sel.match}% match
            </Badge>
          </div>
          <h1 className="text-[28px] font-extrabold tracking-[-0.6px] leading-tight mb-3">{sel.title}</h1>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-[30px] h-[30px] rounded-lg bg-primary text-white flex items-center justify-center font-bold text-[12px]">
              {sel.ownerInitials}
            </div>
            <div className="text-[13.5px] text-muted">
              Posted by <span className="text-ink font-bold">{sel.ownerName}</span> · {sel.ownerDept}
            </div>
          </div>

          {submitted && (
            <div className="flex gap-3 bg-[#E9F6EE] border border-[#BFE6CE] rounded-[13px] p-[17px_18px] mb-6">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-green flex items-center justify-center flex-none">
                <Check size={18} className="text-white" strokeWidth={2.4} />
              </div>
              <div>
                <div className="font-bold text-[15px] text-[#14613F] mb-0.5">Proposal submitted</div>
                <div className="text-[13.5px] text-[#2E7351] leading-normal">
                  {sel.ownerName} will review your proposal. You&apos;ll be notified when the team is
                  formed. Track status under <b>My Projects</b>.
                </div>
              </div>
            </div>
          )}

          {showForm && !submitted && (
            <Card className="p-[22px] mb-6 border-[#E0DEF6] shadow-[0_4px_18px_rgba(80,70,229,0.07)]">
              <div className="font-extrabold text-[16px] mb-0.5">Submit your proposal</div>
              <div className="text-[13px] text-muted-2 mb-4">Like a bid — tell the owner why you&apos;re the right fit.</div>

              <label className="block font-semibold text-[12.5px] text-[#5B5A55] mb-1.5">Why do you want this project?</label>
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="What draws you to this work…"
                className="ta-focus w-full min-h-16 resize-y border border-[#E2E1DB] rounded-[9px] p-[10px_12px] text-[13.5px] leading-normal mb-4"
              />
              <label className="block font-semibold text-[12.5px] text-[#5B5A55] mb-1.5">Relevant experience &amp; expected contribution</label>
              <textarea
                value={exp}
                onChange={(e) => setExp(e.target.value)}
                placeholder="Past work, skills you'll bring, what you'll deliver…"
                className="ta-focus w-full min-h-16 resize-y border border-[#E2E1DB] rounded-[9px] p-[10px_12px] text-[13.5px] leading-normal mb-4"
              />
              <label className="flex justify-between font-semibold text-[12.5px] text-[#5B5A55] mb-2">
                Estimated weekly hours
                <span className="font-mono font-bold text-[13px] text-primary">{hours} hrs/wk</span>
              </label>
              <input
                type="range"
                min={1}
                max={20}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full accent-primary mb-5"
              />
              <div className="flex gap-2.5">
                <Button
                  className="flex-1"
                  disabled={submit.isPending}
                  onClick={() => submit.mutate({ why, experience: exp, weeklyHours: hours })}
                >
                  {submit.isPending ? "Submitting…" : "Submit proposal"}
                </Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </Card>
          )}

          <SectionLabel>About this opportunity</SectionLabel>
          <p className="text-[15px] leading-relaxed text-ink-2 mb-7">{sel.longDesc}</p>

          <SectionLabel>Required skills</SectionLabel>
          <div className="flex flex-wrap gap-1.5 mb-7">
            {sel.skills.map((s) => (
              <SkillChip key={s}>{s}</SkillChip>
            ))}
          </div>

          <SectionLabel>Team &amp; roles</SectionLabel>
          <div className="flex flex-col gap-2">
            {sel.roles.map((r) => (
              <div key={r.name} className="flex items-center gap-3 bg-surface border border-border rounded-[10px] p-[12px_15px]">
                <span className="font-bold text-[14px]">{r.name}</span>
                <span
                  className="font-mono font-semibold text-[11px] px-2 py-0.5 rounded"
                  style={{
                    background: r.status === "filled" ? "#E6F4EC" : "#EEEDFD",
                    color: r.status === "filled" ? "#1F8A5B" : "#5046E5",
                  }}
                >
                  {r.status}
                </span>
                <span className="ml-auto font-mono font-semibold text-[12px] text-muted-2">{r.slots}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT STICKY */}
        <aside className="lg:sticky lg:top-4">
          <Card className="p-5 shadow-[0_2px_10px_rgba(28,27,26,0.04)]">
            <div className="text-[11.5px] font-bold tracking-wide uppercase text-muted-2 mb-1.5">Reward</div>
            <div className="text-[30px] font-extrabold tracking-[-0.8px] leading-none mb-1">{sel.rewardBig}</div>
            <div className="text-[13px] text-muted font-medium mb-4">{sel.rewardLabel}</div>
            <div className="flex flex-col gap-1.5 mb-4">
              {sel.rewardChips.map((c) => (
                <div key={c} className="flex items-center gap-2 text-[13px] text-ink-2 font-medium">
                  <Check size={15} className="text-green" strokeWidth={2.2} /> {c}
                </div>
              ))}
            </div>
            <div className="h-px bg-[#F1F0EC] -mx-5 mb-4" />
            <div className="flex flex-col gap-3 mb-4 text-[13px]">
              <Row label="Team size" value={sel.team} />
              <Row label="Proposals" value={`${sel.proposals} proposals`} />
              <Row label="Closes in" value={`${sel.days}d left`} />
              <Row label="Your match" value={sel.matchPct} valueClass="text-green" />
            </div>
            <Button
              className="w-full !h-11"
              variant={submitted ? "secondary" : "primary"}
              onClick={() => !submitted && setShowForm((v) => !v)}
            >
              {submitted ? "Proposal submitted ✓" : showForm ? "Hide proposal form" : "Submit a Proposal"}
            </Button>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-2.5">{children}</div>
  );
}

function Row({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-2">{label}</span>
      <span className={`font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}
