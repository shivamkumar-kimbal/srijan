"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, Plus, X } from "lucide-react";
import { useOpportunities, useCreateOpportunity } from "@/lib/queries";
import { useCurrentUser, usePermission } from "@/lib/auth-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, SkillChip } from "@/components/ui/badge";
import type { OppInput } from "@/lib/types";

export default function JobsPage() {
  const { data: transfers = [], isLoading } = useOpportunities("transfer");
  const canPost = usePermission("projects:manage");
  const [posting, setPosting] = useState(false);

  return (
    <div className="animate-viewIn max-w-[980px] mx-auto px-8 py-7 pb-20">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Internal Jobs</h1>
          <p className="text-[14.5px] text-muted">
            Internal openings, temporary assignments, transfers &amp; leadership roles — move without leaving.
          </p>
        </div>
        {canPost && (
          <Button onClick={() => setPosting(true)} className="flex-none">
            <Plus size={17} /> Post a Role
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-muted-2 py-8">Loading…</div>
      ) : transfers.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase size={34} className="mx-auto text-muted-2 mb-3" />
          <div className="font-bold text-[16px] mb-1">No internal roles open right now</div>
          <div className="text-[13.5px] text-muted-2 mb-5">
            New transfer &amp; assignment postings show up here as teams open seats.
          </div>
          {canPost && (
            <Button onClick={() => setPosting(true)}>
              <Plus size={17} /> Post the first role
            </Button>
          )}
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {transfers.map((o) => (
            <Link key={o.id} href={`/explore/${o.id}`}>
              <Card className="p-[18px_20px] hover:border-[#DAD8D0] hover:shadow-[0_8px_24px_rgba(28,27,26,0.06)] transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[12px] bg-[#EEEFF1] text-[#5B5A55] flex items-center justify-center flex-none">
                    <Briefcase size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[16px] font-bold tracking-[-0.3px]">{o.title}</h3>
                      <Badge style={{ background: "#EEEFF1", color: "#5B5A55" }} className="font-mono">
                        Internal Transfer
                      </Badge>
                    </div>
                    <p className="text-[13.5px] text-muted leading-normal line-clamp-2 mb-2.5">{o.desc}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {o.skills.slice(0, 4).map((s) => (
                        <SkillChip key={s}>{s}</SkillChip>
                      ))}
                      <span className="ml-auto flex items-center gap-1.5 text-[12px] text-muted-2 font-medium">
                        <MapPin size={13} /> {o.ownerDept}
                      </span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-muted-2 mt-1 flex-none" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {posting && <PostRoleModal onClose={() => setPosting(false)} />}
    </div>
  );
}

function PostRoleModal({ onClose }: { onClose: () => void }) {
  const me = useCurrentUser();
  const create = useCreateOpportunity();
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("");
  const [desc, setDesc] = useState("");
  const [skills, setSkills] = useState("");
  const [days, setDays] = useState("90");
  const [team, setTeam] = useState("1 seat");
  const [reward, setReward] = useState("");

  const valid = title.trim().length > 2 && dept.trim().length > 1 && desc.trim().length > 5;

  function submit() {
    if (!valid || create.isPending) return;
    const body: OppInput = {
      type: "transfer",
      title: title.trim(),
      desc: desc.trim(),
      longDesc: desc.trim(),
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      days: Number(days) || 90,
      team: team.trim() || "1 seat",
      ownerName: me?.name ?? "You",
      ownerDept: dept.trim(),
      ownerInitials: me?.initials ?? "YOU",
      rewardBig: reward.trim() || "Internal move",
      rewardLabel: reward.trim() ? "Highlight" : "Career growth",
      rewardChips: ["Internal mobility", "Skill growth"],
    };
    create.mutate(body, { onSuccess: () => onClose() });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className="text-[20px] font-extrabold tracking-[-0.4px]">Post an Internal Role</h2>
            <p className="text-[13px] text-muted-2 mt-0.5">
              Open a seat for an internal transfer or assignment.
            </p>
          </div>
          <button onClick={onClose} className="text-muted-2 hover:text-ink p-1 -mr-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 mt-5">
          <Field label="Role title *">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer — Payments"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Department / team *">
              <input
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                placeholder="e.g. Payments Platform"
                className={inputCls}
              />
            </Field>
            <Field label="Seats / team size">
              <input value={team} onChange={(e) => setTeam(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <Field label="Description *">
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder="What the role involves, who you're looking for, why it's a great move…"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Skills (comma separated)">
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Go, PostgreSQL, Kafka, System design"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Open for (days)">
              <input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Highlight / perk">
              <input
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="e.g. Lead role, relocation"
                className={inputCls}
              />
            </Field>
          </div>

          {create.isError && (
            <div className="text-[12.5px] text-[#C2552E] bg-[#FCEEE9] rounded-lg px-3 py-2">
              Couldn&apos;t post the role. Check the API is running and try again.
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 mt-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!valid || create.isPending}>
              {create.isPending ? "Posting…" : "Post role"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

const inputCls =
  "w-full rounded-[9px] border border-[#E2E1DB] bg-white px-3 py-2 text-[13.5px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12.5px] font-semibold text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}
