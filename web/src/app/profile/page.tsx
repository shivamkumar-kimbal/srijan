"use client";

import { useProfile } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, SkillChip } from "@/components/ui/badge";

export default function ProfilePage() {
  const { data: p, isLoading } = useProfile();
  if (isLoading || !p) return <div className="p-10 text-muted-2">Loading…</div>;

  return (
    <div className="animate-viewIn max-w-[1080px] mx-auto px-8 py-7 pb-20">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-[76px] h-[76px] rounded-[18px] bg-gradient-to-br from-ink to-[#3C3B38] text-white flex items-center justify-center font-extrabold text-[28px] flex-none">
          {p.initials}
        </div>
        <div>
          <div className="flex items-center gap-2.5 mb-0.5">
            <h1 className="text-[25px] font-extrabold tracking-[-0.5px]">{p.name}</h1>
            <Badge style={{ background: "#E6F4EC", color: "#1F8A5B" }} className="font-mono">{p.status}</Badge>
          </div>
          <div className="text-[14.5px] text-muted">{p.title}</div>
          <div className="flex gap-1.5 mt-2.5">
            {p.certs.map((c) => (
              <SkillChip key={c}>{c}</SkillChip>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-3.5">
        {p.stats.map((st) => (
          <Card key={st.label} className="p-[16px_17px] rounded-[13px]">
            <div className="text-[12px] text-muted-2 font-semibold mb-2">{st.label}</div>
            <div className="text-[27px] font-extrabold tracking-[-0.6px]" style={{ color: st.color }}>{st.value}</div>
            <div className="text-[12px] text-muted-2 mt-0.5">{st.sub}</div>
          </Card>
        ))}
      </div>

      <Card className="p-[18px_20px] rounded-[13px] mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-bold text-[14.5px]">Promotion readiness</span>
          <span className="font-mono font-bold text-[14px] text-primary">{p.promotionReadiness}%</span>
        </div>
        <div className="h-2.5 bg-[#F1F0EC] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-2"
            style={{ width: `${p.promotionReadiness}%` }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SectionLabel>Skills</SectionLabel>
          <div className="flex flex-col gap-3.5">
            {p.skills.map((sk) => (
              <div key={sk.name}>
                <div className="flex justify-between text-[13.5px] mb-1.5">
                  <span className="font-semibold">{sk.name}</span>
                  <span className="text-muted-2 font-mono font-semibold text-[12px]">{sk.level}</span>
                </div>
                <div className="h-1.5 bg-[#F1F0EC] rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: sk.pct }} />
                </div>
              </div>
            ))}
          </div>
          <SectionLabel className="mt-7">Departments worked with</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {p.depts.map((d) => (
              <span key={d} className="text-[13px] font-medium text-ink-2 bg-[#F4F3EF] border border-[#EAE9E3] px-2.5 py-1 rounded-md">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel>Completed projects</SectionLabel>
          <div className="flex flex-col gap-2.5 mb-7">
            {p.completedProjects.map((c) => (
              <Card key={c.title} className="p-[13px_15px] rounded-[11px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-[14px]">{c.title}</span>
                  <span className="ml-auto font-mono font-bold text-[12px] text-gold bg-gold-bg px-2 py-0.5 rounded-md">{c.points}</span>
                </div>
                <div className="text-[12.5px] text-muted">{c.meta}</div>
              </Card>
            ))}
          </div>
          <SectionLabel>Peer reviews</SectionLabel>
          <div className="flex flex-col gap-2.5">
            {p.reviews.map((r, i) => (
              <Card key={i} className="p-[13px_15px] rounded-[11px] bg-[#FCFCFB]">
                <div className="text-[13.5px] leading-relaxed text-ink-2 italic">&ldquo;{r.text}&rdquo;</div>
                <div className="text-[12px] text-muted-2 mt-2 font-semibold">— {r.author}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-3 ${className}`}>
      {children}
    </div>
  );
}
