"use client";

import Link from "next/link";
import { Sparkles, Trophy } from "lucide-react";
import { useOpportunities } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, SkillChip } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AVATAR_COLORS, TYPE_META } from "@/lib/types";

const IMPACT = [
  { label: "Srijan Points", value: "1,240", icon: "★", color: "#5046E5", bg: "#EEEDFD" },
  { label: "Projects Completed", value: "8", icon: "✔", color: "#1F8A5B", bg: "#E6F4EC" },
  { label: "Earnings", value: "₹45,000", icon: "₹", color: "#9A6E1A", bg: "#FBF3E2" },
  { label: "Rank", value: "Top 15%", icon: "▲", color: "#2A6FDB", bg: "#E8F0FC" },
];

const BADGES = ["#5046E5", "#1F8A5B", "#9A6E1A", "#2A6FDB", "#C2552E"];

const ACTIVE = [
  { name: "Employee Onboarding Automation", pct: 60, status: "In Progress", color: "#1F8A5B" },
  { name: "CI/CD Pipeline Optimizer", pct: 80, status: "In Review", color: "#9A6E1A" },
  { name: "Dashboard Data Sync Tool", pct: 30, status: "In Progress", color: "#1F8A5B" },
];

const INTERNAL = [
  { role: "DevOps Engineer", dept: "Platform Engineering", loc: "Bengaluru" },
  { role: "Data Engineer", dept: "Data & Analytics", loc: "Hyderabad" },
  { role: "SRE Specialist", dept: "Cloud Operations", loc: "Pune" },
];

const CONTRIBUTORS = [
  { rank: 1, name: "Neha Verma", pts: "2,450", i: 3 },
  { rank: 2, name: "Rohit Patel", pts: "2,150", i: 1 },
  { rank: 3, name: "Ananya Singh", pts: "1,980", i: 2 },
];

const STEPS = [
  ["Post Idea / Project", "Share what you need or your idea"],
  ["Submit Proposal", "Show interest and submit a proposal"],
  ["Get Selected", "Project owner picks the best team"],
  ["Collaborate & Build", "Work together and track progress"],
  ["Review & Earn", "Complete, get reviewed and earn rewards"],
];

export default function DashboardPage() {
  const { data: opps = [] } = useOpportunities();
  const featured = opps.slice(0, 4);

  return (
    <div className="animate-viewIn max-w-[1320px] mx-auto px-6 lg:px-8 py-7 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
      {/* LEFT COLUMN */}
      <div className="min-w-0 space-y-6">
        {/* hero */}
        <Card className="overflow-hidden bg-gradient-to-r from-[#EEEDFD] to-[#F5EFFB] border-[#E5E1F7]">
          <div className="p-8 max-w-[560px]">
            <h1 className="text-[28px] font-extrabold tracking-[-0.6px] mb-2">Collaborate. Build. Grow.</h1>
            <p className="text-[14.5px] text-muted leading-relaxed mb-5">
              Post your ideas, collaborate with experts across departments, earn rewards and
              grow your career.
            </p>
            <Link href="/explore">
              <Button size="lg">Explore Projects</Button>
            </Link>
          </div>
        </Card>

        {/* featured */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[17px]">Featured Projects</h2>
            <Link href="/explore" className="text-[13px] font-semibold text-primary">View All Projects</Link>
          </div>
          <div className="flex flex-col divide-y divide-[#F1F0EC]">
            {featured.map((o) => {
              const m = TYPE_META[o.type];
              return (
                <div key={o.id} className="flex items-center gap-4 py-4 first:pt-0">
                  <div
                    className="w-11 h-11 rounded-[11px] flex-none flex items-center justify-center font-bold"
                    style={{ background: m.bg, color: m.fg }}
                  >
                    {o.title[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[14.5px] truncate">{o.title}</span>
                      {o.match >= 85 && (
                        <Badge style={{ background: "#EEEDFD", color: "#5046E5" }}>New</Badge>
                      )}
                    </div>
                    <p className="text-[13px] text-muted line-clamp-1 mt-0.5">{o.desc}</p>
                    <div className="flex gap-1.5 mt-2">
                      {o.skills.slice(0, 3).map((s) => (
                        <SkillChip key={s}>{s}</SkillChip>
                      ))}
                    </div>
                  </div>
                  <div className="hidden lg:block text-center w-20">
                    <div className="font-bold text-[14px]">{o.rewardBig}</div>
                    <div className="text-[11px] text-muted-2">Reward</div>
                  </div>
                  <div className="hidden lg:block text-center w-16">
                    <div className="font-bold text-[14px] font-mono">{o.team.split("/")[1]?.trim()}</div>
                    <div className="text-[11px] text-muted-2">Max Team</div>
                  </div>
                  <div className="hidden lg:block text-center w-20">
                    <div className="font-bold text-[13px] text-[#C2552E]">{o.days} days left</div>
                    <div className="text-[11px] text-muted-2">Deadline</div>
                  </div>
                  <Link href={`/explore/${o.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              );
            })}
            {featured.length === 0 && (
              <div className="py-8 text-center text-muted-2 text-sm">
                No projects yet — is the API running on :8080?
              </div>
            )}
          </div>
        </Card>

        {/* how it works */}
        <Card className="p-6">
          <h2 className="font-bold text-[17px] mb-5">How It Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {STEPS.map(([t, d], i) => (
              <div key={t} className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary-bg text-primary flex items-center justify-center font-bold mb-3">
                  {i + 1}
                </div>
                <div className="font-semibold text-[12.5px] leading-tight">{t}</div>
                <div className="text-[11.5px] text-muted-2 mt-1 leading-snug">{d}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* RIGHT RAIL */}
      <div className="space-y-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px]">Your Impact</h3>
            <Link href="/profile" className="text-[12px] font-semibold text-primary">View Profile</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {IMPACT.map((s) => (
              <div key={s.label} className="border border-border rounded-[11px] p-3">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] font-bold mb-2"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <div className="font-extrabold text-[18px] tracking-[-0.4px]">{s.value}</div>
                <div className="text-[11px] text-muted-2">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-5 mb-2">
            <span className="font-bold text-[13px]">Badges Earned</span>
            <span className="text-[11px] text-primary font-semibold">View All</span>
          </div>
          <div className="flex gap-2">
            {BADGES.map((c, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-[10px] flex items-center justify-center text-white"
                style={{ background: c }}
              >
                <Sparkles size={15} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px]">My Active Projects</h3>
            <Link href="/projects" className="text-[12px] font-semibold text-primary">View All</Link>
          </div>
          <div className="space-y-4">
            {ACTIVE.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-[13px]">{p.name}</span>
                  <Badge
                    style={{
                      background: p.status === "In Review" ? "#FBF3E2" : "#E6F4EC",
                      color: p.status === "In Review" ? "#9A6E1A" : "#1F8A5B",
                    }}
                  >
                    {p.status}
                  </Badge>
                </div>
                <div className="h-1.5 bg-[#F1F0EC] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px]">Internal Opportunities</h3>
            <Link href="/jobs" className="text-[12px] font-semibold text-primary">View All</Link>
          </div>
          <div className="space-y-3">
            {INTERNAL.map((j) => (
              <div key={j.role} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[9px] bg-[#F1F0EC] flex items-center justify-center text-muted font-bold text-[12px]">
                  {j.role[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-[13px] leading-tight">{j.role}</div>
                  <div className="text-[11.5px] text-muted-2">{j.dept} · {j.loc}</div>
                </div>
                <Button size="sm" variant="secondary" className="!h-8 !px-3 !text-[12px] text-primary border-[#E0DEF6]">
                  Apply
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[15px]">Top Contributors</h3>
            <Link href="/leaderboards" className="text-[12px] font-semibold text-primary">View All</Link>
          </div>
          <div className="space-y-1">
            {CONTRIBUTORS.map((c) => (
              <div key={c.rank} className="flex items-center gap-3 py-2 border-b border-[#F4F3EF] last:border-0">
                {c.rank === 1 ? (
                  <Trophy size={16} className="text-[#C99528] w-[18px]" />
                ) : (
                  <span className="font-mono font-extrabold text-[14px] text-[#C7C5BC] w-[18px] text-center">{c.rank}</span>
                )}
                <div
                  className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-[11px]"
                  style={{ background: AVATAR_COLORS[c.i] }}
                >
                  {c.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <span className="font-bold text-[13.5px] flex-1">{c.name}</span>
                <span className="font-mono font-bold text-[13px] text-gold">{c.pts} pts</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
