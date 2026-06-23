"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, MapPin } from "lucide-react";
import { useOpportunities } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, SkillChip } from "@/components/ui/badge";

export default function JobsPage() {
  const { data: transfers = [], isLoading } = useOpportunities("transfer");

  return (
    <div className="animate-viewIn max-w-[980px] mx-auto px-8 py-7 pb-20">
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Internal Jobs</h1>
      <p className="text-[14.5px] text-muted mb-6">
        Internal openings, temporary assignments, transfers &amp; leadership roles — move without leaving.
      </p>

      {isLoading ? (
        <div className="text-muted-2 py-8">Loading…</div>
      ) : transfers.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase size={34} className="mx-auto text-muted-2 mb-3" />
          <div className="font-bold text-[16px] mb-1">No internal roles open right now</div>
          <div className="text-[13.5px] text-muted-2">
            New transfer &amp; assignment postings show up here as teams open seats.
          </div>
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
    </div>
  );
}
