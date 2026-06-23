"use client";

import { useProfile } from "@/lib/queries";
import { Card } from "@/components/ui/card";
import { Badge, SkillChip } from "@/components/ui/badge";
import { BookOpen, PlayCircle, Trophy } from "lucide-react";

const PATHS = [
  { title: "Distributed Systems Design", level: "Advanced", hours: 14, skill: "System Design", progress: 60, color: "#5046E5" },
  { title: "LLMs & RAG in Production", level: "Working", hours: 9, skill: "LLMs / RAG", progress: 25, color: "#8B3FD1" },
  { title: "Kubernetes Operator Patterns", level: "Proficient", hours: 11, skill: "Kubernetes", progress: 40, color: "#1F8A5B" },
  { title: "Advanced PostgreSQL Performance", level: "Advanced", hours: 7, skill: "PostgreSQL", progress: 80, color: "#B07F1E" },
];

export default function LearningPage() {
  const { data: p } = useProfile();
  const credits = 12;

  return (
    <div className="animate-viewIn max-w-[1080px] mx-auto px-8 py-7 pb-20">
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">Learning</h1>
      <p className="text-[14.5px] text-muted mb-6">
        Curated paths matched to your skill gaps — fund them with learning credits.
      </p>

      <div className="grid grid-cols-3 gap-3.5 mb-7">
        {[
          { icon: Trophy, label: "Learning credits", value: `${credits}`, sub: "available this year" },
          { icon: PlayCircle, label: "In progress", value: "3", sub: "active paths" },
          { icon: BookOpen, label: "Completed", value: "8", sub: "courses this year" },
        ].map((s) => (
          <Card key={s.label} className="p-[16px_18px]">
            <div className="flex items-center gap-2 text-muted-2 mb-2">
              <s.icon size={16} />
              <span className="text-[12px] font-semibold">{s.label}</span>
            </div>
            <div className="text-[27px] font-extrabold tracking-[-0.6px]">{s.value}</div>
            <div className="text-[12px] text-muted-2 mt-0.5">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="font-extrabold text-[13px] tracking-wide uppercase text-muted-2 mb-3">
        Recommended for you
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {PATHS.map((path) => (
          <Card key={path.title} className="p-[18px_20px]">
            <div className="flex items-center gap-2 mb-2.5">
              <Badge style={{ background: "#EEEDFD", color: path.color }}>{path.level}</Badge>
              <span className="ml-auto text-[12px] text-muted-2 font-mono font-semibold">{path.hours}h</span>
            </div>
            <h3 className="text-[15.5px] font-bold tracking-[-0.3px] mb-1">{path.title}</h3>
            <div className="mb-3.5">
              <SkillChip>Builds: {path.skill}</SkillChip>
            </div>
            <div className="flex justify-between text-[12px] mb-1.5">
              <span className="text-muted-2 font-semibold">Progress</span>
              <span className="font-mono font-bold" style={{ color: path.color }}>{path.progress}%</span>
            </div>
            <div className="h-2 bg-[#F1F0EC] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${path.progress}%`, background: path.color }} />
            </div>
          </Card>
        ))}
      </div>

      {p && (
        <p className="text-[12.5px] text-muted-2 mt-6">
          Recommendations are tuned to {p.name.split(" ")[0]}&apos;s current skill levels.
        </p>
      )}
    </div>
  );
}
