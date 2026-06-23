"use client";

import { useOpportunities } from "@/lib/queries";
import { useUIStore } from "@/lib/store";
import { OpportunityCard } from "@/components/opportunity-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const CHIPS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "automation", label: "Automation" },
  { key: "innovation", label: "Innovation" },
  { key: "cost", label: "Cost" },
  { key: "techdebt", label: "Tech Debt" },
  { key: "transfer", label: "Transfers" },
];

export default function ExplorePage() {
  const filter = useUIStore((s) => s.filter);
  const setFilter = useUIStore((s) => s.setFilter);
  const { data: all = [] } = useOpportunities();
  const list = filter === "all" ? all : all.filter((o) => o.type === filter);

  const count = (key: string) =>
    key === "all" ? all.length : all.filter((o) => o.type === key).length;

  return (
    <div className="animate-viewIn max-w-[1180px] mx-auto px-8 py-7 pb-16">
      <div className="flex items-end gap-4 mb-5">
        <div>
          <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Opportunity Board</h1>
          <p className="text-[14.5px] text-muted">
            Internal gigs, automations &amp; innovation challenges open across the org.
          </p>
        </div>
        <Button className="ml-auto" size="md">
          <Plus size={16} strokeWidth={2.2} /> Post Opportunity
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {CHIPS.map((c) => {
          const on = filter === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={cn(
                "inline-flex items-center gap-1.5 h-[34px] px-3.5 rounded-[9px] cursor-pointer font-semibold text-[13px] border transition-colors",
                on ? "bg-ink text-white border-ink" : "bg-white text-[#5B5A55] border-[#E7E6E0]"
              )}
            >
              {c.label}
              <span
                className={cn(
                  "font-mono text-[11px] px-1.5 rounded",
                  on ? "bg-white/20 text-white" : "bg-[#F1F0EC] text-muted-2"
                )}
              >
                {count(c.key)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((o) => (
          <OpportunityCard key={o.id} o={o} />
        ))}
      </div>
      {list.length === 0 && (
        <div className="py-16 text-center text-muted-2">No opportunities for this filter.</div>
      )}
    </div>
  );
}
