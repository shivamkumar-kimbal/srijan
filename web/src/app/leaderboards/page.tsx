"use client";

import { useInsights } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { AVATAR_COLORS } from "@/lib/types";

export default function LeaderboardsPage() {
  const { data, isLoading } = useInsights();
  if (isLoading || !data) return <div className="p-10 text-muted-2">Loading…</div>;

  return (
    <div className="animate-viewIn max-w-[1180px] mx-auto px-8 py-7 pb-20">
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Leadership Insights</h1>
      <p className="text-[14.5px] text-muted mb-6">
        Org-wide impact from internal gigs, automations &amp; mobility — FY26 to date.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
        {data.kpis.map((k) => (
          <Card key={k.label} className="p-[18px_20px]">
            <div className="text-[12.5px] text-muted-2 font-semibold mb-2.5">{k.label}</div>
            <div className="flex items-end gap-2.5">
              <div className="text-[30px] font-extrabold tracking-[-0.8px]">{k.value}</div>
              <div className="font-mono font-bold text-[12.5px] pb-1.5" style={{ color: k.up ? "#1F8A5B" : "#C2552E" }}>
                {k.delta}
              </div>
            </div>
            <div className="text-[12px] text-muted-2 mt-1">{k.sub}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-6">
        <Card className="p-[20px_22px]">
          <div className="font-bold text-[15px] mb-0.5">Cost saved by category</div>
          <div className="text-[12.5px] text-muted-2 mb-5">Attributed to delivered automations &amp; optimizations</div>
          <div className="flex flex-col gap-4">
            {data.costBars.map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-[13px] mb-1.5">
                  <span className="font-semibold">{b.label}</span>
                  <span className="font-mono font-bold text-[12.5px] text-green">{b.value}</span>
                </div>
                <div className="h-2.5 bg-[#F1F0EC] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-green to-[#46B07C]" style={{ width: b.pct }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-[20px_22px]">
          <div className="font-bold text-[15px] mb-0.5">Top contributors</div>
          <div className="text-[12.5px] text-muted-2 mb-4.5">By gig points this quarter</div>
          <div className="flex flex-col gap-1">
            {data.performers.map((p) => (
              <div key={p.rank} className="flex items-center gap-3 py-2.5 border-b border-[#F4F3EF] last:border-0">
                <span className="font-mono font-extrabold text-[14px] text-[#C7C5BC] w-[18px]">{p.rank}</span>
                <div
                  className="w-6 h-6 rounded-md text-white flex items-center justify-center font-bold text-[10px]"
                  style={{ background: AVATAR_COLORS[p.ai % AVATAR_COLORS.length] }}
                >
                  {p.initials}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[13.5px] leading-tight">{p.name}</div>
                  <div className="text-[11.5px] text-muted-2">{p.meta}</div>
                </div>
                <span className="ml-auto font-mono font-bold text-[13px] text-gold">{p.points}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
