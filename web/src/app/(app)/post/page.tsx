"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useCreateOpportunity } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TYPE_META, type OppType } from "@/lib/types";
import { cn } from "@/lib/utils";

const TYPES = Object.keys(TYPE_META) as OppType[];
const field =
  "w-full border border-[#E2E1DB] rounded-[9px] p-[10px_12px] text-[13.5px] leading-normal ta-focus";

export default function PostPage() {
  const router = useRouter();
  const create = useCreateOpportunity();

  const [type, setType] = useState<OppType>("automation");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [skills, setSkills] = useState("");
  const [days, setDays] = useState(21);
  const [teamMax, setTeamMax] = useState(5);
  const [rewardBig, setRewardBig] = useState("");
  const [rewardLabel, setRewardLabel] = useState("");

  const valid = title.trim() && desc.trim();

  const submit = () => {
    create.mutate(
      {
        type,
        title: title.trim(),
        desc: desc.trim(),
        longDesc: longDesc.trim() || desc.trim(),
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        days,
        team: `0 / ${teamMax}`,
        ownerName: "Shivam Kumar",
        ownerDept: "Payments",
        ownerInitials: "SK",
        rewardBig: rewardBig.trim() || "—",
        rewardLabel: rewardLabel.trim() || "reward",
        rewardChips: rewardBig.trim() ? [rewardBig.trim()] : [],
      },
      { onSuccess: (o) => router.push(`/explore/${o.id}`) }
    );
  };

  return (
    <div className="animate-viewIn max-w-[760px] mx-auto px-8 py-6 pb-20">
      <Link href="/explore" className="flex items-center gap-1.5 text-muted font-semibold text-[13.5px] py-1.5 mb-3.5">
        <ChevronLeft size={16} /> Back to board
      </Link>
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Post an Opportunity</h1>
      <p className="text-[14.5px] text-muted mb-6">
        Describe the work, the reward, and the team you need.
      </p>

      <Card className="p-6 space-y-5">
        <div>
          <Label>Type</Label>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => {
              const m = TYPE_META[t];
              const on = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={cn(
                    "px-3 h-9 rounded-[9px] text-[13px] font-semibold border transition-colors",
                    on ? "text-white border-transparent" : "bg-white border-[#E7E6E0] text-[#5B5A55]"
                  )}
                  style={on ? { background: m.fg } : undefined}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Title *</Label>
          <input className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Automate X…" />
        </div>

        <div>
          <Label>Short description *</Label>
          <textarea className={cn(field, "min-h-16 resize-y")} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="One-line summary shown on the card" />
        </div>

        <div>
          <Label>Full details</Label>
          <textarea className={cn(field, "min-h-24 resize-y")} value={longDesc} onChange={(e) => setLongDesc(e.target.value)} placeholder="Business impact, scope, deliverables…" />
        </div>

        <div>
          <Label>Required skills (comma-separated)</Label>
          <input className={field} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Go, Kubernetes, Terraform" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Proposal deadline (days)</Label>
            <input type="number" min={1} max={120} className={field} value={days} onChange={(e) => setDays(Number(e.target.value))} />
          </div>
          <div>
            <Label>Max team size</Label>
            <input type="number" min={1} max={10} className={field} value={teamMax} onChange={(e) => setTeamMax(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Reward</Label>
            <input className={field} value={rewardBig} onChange={(e) => setRewardBig(e.target.value)} placeholder="₹10,000" />
          </div>
          <div>
            <Label>Reward label</Label>
            <input className={field} value={rewardLabel} onChange={(e) => setRewardLabel(e.target.value)} placeholder="cash + promotion points" />
          </div>
        </div>

        {create.isError && (
          <div className="text-[13px] text-[#C2552E]">Failed to post — is the API running?</div>
        )}

        <div className="flex gap-2.5 pt-1">
          <Button className="flex-1" disabled={!valid || create.isPending} onClick={submit}>
            {create.isPending ? "Posting…" : "Post opportunity"}
          </Button>
          <Link href="/explore">
            <Button variant="secondary">Cancel</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block font-semibold text-[12.5px] text-[#5B5A55] mb-1.5">{children}</label>;
}
