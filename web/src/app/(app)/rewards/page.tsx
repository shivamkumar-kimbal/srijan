"use client";

import { useState } from "react";
import { Award, Check, Coffee, Gift, GraduationCap, Plane } from "lucide-react";
import { useProfile } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CATALOG = [
  { id: "learn", icon: GraduationCap, name: "Conference / course budget", desc: "₹25,000 towards any approved course or conference.", cost: 800 },
  { id: "swag", icon: Coffee, name: "Premium swag pack", desc: "Limited-edition hoodie, bottle & sticker set.", cost: 300 },
  { id: "day", icon: Plane, name: "Extra day off", desc: "One additional paid leave day this quarter.", cost: 1000 },
  { id: "mentor", icon: Award, name: "Exec mentorship slot", desc: "A 1:1 mentoring session with a senior leader.", cost: 600 },
];

export default function RewardsPage() {
  const { data: p, isLoading } = useProfile();
  const [redeemed, setRedeemed] = useState<Set<string>>(new Set());

  if (isLoading || !p) return <div className="p-10 text-muted-2">Loading…</div>;

  const gigPoints = p.stats.find((s) => s.label === "Gig Points");
  const balance = Number((gigPoints?.value ?? "0").replace(/[^0-9]/g, ""));
  const spent = CATALOG.filter((c) => redeemed.has(c.id)).reduce((n, c) => n + c.cost, 0);
  const available = balance - spent;

  const toggle = (id: string, cost: number) => {
    setRedeemed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (available >= cost) next.add(id);
      return next;
    });
  };

  return (
    <div className="animate-viewIn max-w-[980px] mx-auto px-8 py-7 pb-20">
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Rewards</h1>
      <p className="text-[14.5px] text-muted mb-6">
        Spend the gig points you&apos;ve earned from completed projects, automations &amp; reviews.
      </p>

      <Card className="p-[22px_24px] mb-7 bg-gradient-to-br from-ink to-[#3C3B38] text-white border-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[14px] bg-white/15 flex items-center justify-center flex-none">
            <Gift size={24} />
          </div>
          <div>
            <div className="text-[12.5px] uppercase tracking-wide font-semibold text-white/70">
              Available balance
            </div>
            <div className="text-[34px] font-extrabold tracking-[-0.8px] leading-none mt-1">
              {available.toLocaleString()} <span className="text-[16px] font-bold text-white/70">pts</span>
            </div>
          </div>
          <div className="ml-auto text-right text-[12.5px] text-white/70">
            <div>{balance.toLocaleString()} earned</div>
            <div>{spent.toLocaleString()} redeemed</div>
          </div>
        </div>
      </Card>

      <div className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-3">
        Rewards catalog
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {CATALOG.map((c) => {
          const isRedeemed = redeemed.has(c.id);
          const affordable = available >= c.cost || isRedeemed;
          return (
            <Card key={c.id} className="p-[17px_19px] flex flex-col">
              <div className="flex items-start gap-3 mb-3.5">
                <div className="w-10 h-10 rounded-[11px] bg-gold-bg text-gold flex items-center justify-center flex-none">
                  <c.icon size={19} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[14.5px] mb-0.5">{c.name}</div>
                  <p className="text-[13px] text-muted leading-normal">{c.desc}</p>
                </div>
              </div>
              <div className="mt-auto flex items-center gap-3 pt-3 border-t border-[#F1F0EC]">
                <span className="font-mono font-extrabold text-[15px] text-gold">{c.cost} pts</span>
                <Button
                  size="sm"
                  variant={isRedeemed ? "secondary" : "primary"}
                  className="ml-auto"
                  disabled={!affordable}
                  onClick={() => toggle(c.id, c.cost)}
                >
                  {isRedeemed ? (
                    <>
                      <Check size={15} /> Redeemed
                    </>
                  ) : affordable ? (
                    "Redeem"
                  ) : (
                    "Not enough points"
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
