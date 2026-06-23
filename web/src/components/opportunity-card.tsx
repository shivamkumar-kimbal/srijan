import Link from "next/link";
import { Users } from "lucide-react";
import { Badge, SkillChip } from "@/components/ui/badge";
import { TYPE_META, type Opportunity } from "@/lib/types";

export function OpportunityCard({ o }: { o: Opportunity }) {
  const m = TYPE_META[o.type];
  const good = o.match >= 85;
  return (
    <Link
      href={`/explore/${o.id}`}
      className="opp-card bg-surface border border-border rounded-[14px] p-[18px_19px] flex flex-col cursor-pointer hover:shadow-[0_8px_24px_rgba(28,27,26,0.08)] hover:border-[#DAD8D0] hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <Badge style={{ background: m.bg, color: m.fg }}>{m.label}</Badge>
        <Badge style={{ background: good ? "#E6F4EC" : "#FBF3E2", color: good ? "#1F8A5B" : "#B07F1E" }}>
          {o.match}% match
        </Badge>
        <span className="ml-auto font-mono font-semibold text-[12px] text-muted-2">{o.days}d left</span>
      </div>
      <h3 className="text-[16.5px] font-bold tracking-[-0.3px] leading-tight mb-1.5">{o.title}</h3>
      <p className="text-[13.5px] leading-normal text-muted line-clamp-2 mb-3.5">{o.desc}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {o.skills.map((s) => (
          <SkillChip key={s}>{s}</SkillChip>
        ))}
      </div>
      <div className="mt-auto flex items-end gap-3 pt-3.5 border-t border-[#F1F0EC]">
        <div>
          <div className="text-[19px] font-extrabold tracking-[-0.4px]">{o.rewardBig}</div>
          <div className="text-[11.5px] text-muted-2 font-medium">{o.rewardLabel}</div>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-[12px] text-muted font-medium">
            <Users size={13} className="text-muted-2" />
            {o.team}
          </div>
          <div className="text-[12px] text-muted font-medium">{o.proposals} proposals</div>
        </div>
      </div>
    </Link>
  );
}
