"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, LifeBuoy, Mail, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How do I get matched to opportunities?",
    a: "Srijan scores each gig against your skill profile and past projects. Higher match % means a closer fit — keep your profile skills current to improve matches.",
  },
  {
    q: "How are gig points earned and spent?",
    a: "You earn points by completing projects, shipping automations and receiving peer reviews. Spend them in the Rewards catalog on perks, learning budgets and time off.",
  },
  {
    q: "Can my manager see my proposals?",
    a: "Opportunity owners see proposals submitted to their gigs. Your manager sees aggregate participation, not the text of individual bids.",
  },
  {
    q: "What counts toward promotion readiness?",
    a: "Leadership on projects, breadth of departments worked with, peer review scores and innovation impact all feed the readiness score on your profile.",
  },
];

const CONTACTS = [
  { icon: MessageCircle, label: "Ask in #srijan-help", desc: "Fastest answers from the community.", action: "Open Slack" },
  { icon: Mail, label: "Email the team", desc: "srijan-support@kimbal.internal", action: "Compose" },
  { icon: BookOpen, label: "Read the docs", desc: "Guides, API reference & roadmap.", action: "Browse" },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="animate-viewIn max-w-[900px] mx-auto px-8 py-7 pb-20">
      <div className="flex items-center gap-3 mb-1">
        <LifeBuoy size={26} className="text-primary" />
        <h1 className="text-[27px] font-extrabold tracking-[-0.6px]">Help &amp; Support</h1>
      </div>
      <p className="text-[14.5px] text-muted mb-6">
        Answers to common questions, plus ways to reach the Srijan team.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-8">
        {CONTACTS.map((c) => (
          <Card key={c.label} className="p-[17px_18px]">
            <div className="w-10 h-10 rounded-[11px] bg-[#EEEDFD] text-primary flex items-center justify-center mb-3">
              <c.icon size={19} />
            </div>
            <div className="font-bold text-[14px] mb-0.5">{c.label}</div>
            <div className="text-[12.5px] text-muted mb-3">{c.desc}</div>
            <button className="text-[13px] font-semibold text-primary hover:underline">{c.action} →</button>
          </Card>
        ))}
      </div>

      <div className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-3">
        Frequently asked
      </div>
      <div className="flex flex-col gap-2.5">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Card key={f.q} className="overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center gap-3 p-[16px_18px] text-left cursor-pointer"
              >
                <span className="font-bold text-[14.5px] flex-1">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={cn("text-muted-2 transition-transform", isOpen && "rotate-180")}
                />
              </button>
              {isOpen && (
                <div className="px-[18px] pb-[16px] -mt-1 text-[13.5px] leading-relaxed text-muted">
                  {f.a}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
