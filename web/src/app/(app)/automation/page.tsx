"use client";

import { useState } from "react";
import Link from "next/link";
import { Bot, Check, ChevronDown, Copy, GitBranch, Package } from "lucide-react";
import { useOpportunities } from "@/lib/queries";
import { OpportunityCard } from "@/components/opportunity-card";
import { Card } from "@/components/ui/card";
import { SkillChip } from "@/components/ui/badge";

interface Template {
  icon: typeof GitBranch;
  name: string;
  desc: string;
  reuses: number;
  tags: string[];
  snippet: string;
}

const TEMPLATES: Template[] = [
  {
    icon: GitBranch,
    name: "GitHub Actions · Release Pipeline",
    desc: "Lint → test → build → sign → deploy with manual approval gate.",
    reuses: 24,
    tags: ["CI/CD", "YAML"],
    snippet: `name: release
on:
  push:
    tags: ["v*"]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: make lint test build
  deploy:
    needs: build
    environment: production   # manual approval gate
    runs-on: ubuntu-latest
    steps:
      - run: ./scripts/deploy.sh`,
  },
  {
    icon: Package,
    name: "Terraform · EKS Baseline",
    desc: "Opinionated cluster with IRSA, autoscaling and cost tags.",
    reuses: 17,
    tags: ["Terraform", "AWS"],
    snippet: `module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "srijan-prod"
  cluster_version = "1.30"
  enable_irsa     = true

  eks_managed_node_groups = {
    default = { min_size = 2, max_size = 8, instance_types = ["m6i.large"] }
  }
  tags = { team = "platform", cost-center = "eng" }
}`,
  },
  {
    icon: Bot,
    name: "Agent · PR Summary Bot",
    desc: "LLM agent that summarises diffs and flags risky changes.",
    reuses: 31,
    tags: ["LLM", "Python"],
    snippet: `from srijan.agents import Agent

bot = Agent(model="gpt-4o-mini")

@bot.on("pull_request")
def summarise(pr):
    diff = pr.diff()
    summary = bot.ask(f"Summarise and flag risk:\\n{diff}")
    pr.comment(summary)`,
  },
  {
    icon: Copy,
    name: "K8s · Cost Exporter Helm Chart",
    desc: "Namespace-level spend metrics piped to Grafana + Slack.",
    reuses: 12,
    tags: ["Helm", "Grafana"],
    snippet: `helm repo add srijan https://charts.srijan.internal
helm install cost-exporter srijan/cost-exporter \\
  --set grafana.enabled=true \\
  --set slack.webhook=$SLACK_WEBHOOK \\
  --namespace observability --create-namespace`,
  },
];

export default function AutomationPage() {
  const { data: gigs = [], isLoading } = useOpportunities("automation");
  const [reuses, setReuses] = useState<number[]>(TEMPLATES.map((t) => t.reuses));
  const [copied, setCopied] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function copyTemplate(i: number) {
    try {
      await navigator.clipboard.writeText(TEMPLATES[i].snippet);
    } catch {
      /* clipboard may be blocked; still record the reuse */
    }
    setReuses((r) => r.map((n, idx) => (idx === i ? n + 1 : n)));
    setCopied(i);
    setTimeout(() => setCopied((c) => (c === i ? null : c)), 1600);
  }

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
        {TEMPLATES.map((t, i) => {
          const isOpen = expanded === i;
          return (
            <Card key={t.name} className="p-[17px_19px] flex flex-col">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[11px] bg-[#EEEDFD] text-primary flex items-center justify-center flex-none">
                  <t.icon size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[14.5px] mb-0.5">{t.name}</div>
                  <p className="text-[13px] text-muted leading-normal mb-2.5">{t.desc}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {t.tags.map((tag) => (
                      <SkillChip key={tag}>{tag}</SkillChip>
                    ))}
                    <span className="ml-auto text-[12px] text-muted-2 font-mono font-semibold">
                      {reuses[i]} reuses
                    </span>
                  </div>
                </div>
              </div>

              {isOpen && (
                <pre className="mt-3 text-[11.5px] leading-relaxed bg-[#1C1B1A] text-[#E8E7E1] rounded-[10px] p-3 overflow-x-auto font-mono">
                  {t.snippet}
                </pre>
              )}

              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => copyTemplate(i)}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[12.5px] font-bold transition-colors ${
                    copied === i ? "bg-green text-white" : "bg-primary text-white hover:bg-[#453dd0]"
                  }`}
                >
                  {copied === i ? <Check size={14} /> : <Copy size={14} />}
                  {copied === i ? "Copied!" : "Use template"}
                </button>
                <button
                  onClick={() => setExpanded((e) => (e === i ? null : i))}
                  className="inline-flex items-center gap-1 h-8 px-3 rounded-[8px] text-[12.5px] font-semibold text-muted hover:bg-[#F4F3EF] transition-colors"
                >
                  {isOpen ? "Hide" : "Preview"}
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </Card>
          );
        })}
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
