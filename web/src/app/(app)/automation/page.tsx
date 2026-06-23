"use client";

import Link from "next/link";
import { Bot, Copy, GitBranch, Package } from "lucide-react";
import { useOpportunities } from "@/lib/queries";
import { OpportunityCard } from "@/components/opportunity-card";
import { Card } from "@/components/ui/card";
import { SkillChip } from "@/components/ui/badge";

const TEMPLATES = [
  {
    icon: GitBranch,
    name: "GitHub Actions · Release Pipeline",
    desc: "Lint → test → build → sign → deploy with manual approval gate.",
    reuses: 24,
    tags: ["CI/CD", "YAML"],
  },
  {
    icon: Package,
    name: "Terraform · EKS Baseline",
    desc: "Opinionated cluster with IRSA, autoscaling and cost tags.",
    reuses: 17,
    tags: ["Terraform", "AWS"],
  },
  {
    icon: Bot,
    name: "Agent · PR Summary Bot",
    desc: "LLM agent that summarises diffs and flags risky changes.",
    reuses: 31,
    tags: ["LLM", "Python"],
  },
  {
    icon: Copy,
    name: "K8s · Cost Exporter Helm Chart",
    desc: "Namespace-level spend metrics piped to Grafana + Slack.",
    reuses: 12,
    tags: ["Helm", "Grafana"],
  },
];

export default function AutomationPage() {
  const { data: gigs = [], isLoading } = useOpportunities("automation");

  return (
    <div className="animate-viewIn max-w-[1180px] mx-auto px-8 py-7 pb-20">
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Automation Hub</h1>
      <p className="text-[14.5px] text-muted mb-6">
        Publish &amp; reuse Terraform, Actions, K8s templates and agents — and pick up automation gigs.
      </p>

      <div className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-3">
        Reusable templates
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-8">
        {TEMPLATES.map((t) => (
          <Card key={t.name} className="p-[17px_19px]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[11px] bg-[#EEEDFD] text-primary flex items-center justify-center flex-none">
                <t.icon size={19} />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[14.5px] mb-0.5">{t.name}</div>
                <p className="text-[13px] text-muted leading-normal mb-2.5">{t.desc}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {t.tags.map((tag) => (
                    <SkillChip key={tag}>{tag}</SkillChip>
                  ))}
                  <span className="ml-auto text-[12px] text-muted-2 font-mono font-semibold">
                    {t.reuses} reuses
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2">
          Open automation gigs
        </span>
        <Link href="/explore" className="ml-auto text-[13px] font-semibold text-primary hover:underline">
          View all →
        </Link>
      </div>
      {isLoading ? (
        <div className="text-muted-2 py-8">Loading…</div>
      ) : gigs.length === 0 ? (
        <Card className="p-10 text-center text-muted-2">No open automation gigs right now.</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gigs.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>
      )}
    </div>
  );
}
