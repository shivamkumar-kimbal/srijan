"use client";

import { useBoard } from "@/lib/queries";
import { Badge } from "@/components/ui/badge";
import { AVATAR_COLORS } from "@/lib/types";

export default function ProjectsPage() {
  const { data, isLoading } = useBoard();
  if (isLoading || !data) return <div className="p-10 text-muted-2">Loading…</div>;

  return (
    <div className="animate-viewIn px-8 py-7 pb-10 flex flex-col h-full">
      <div className="flex items-center gap-3.5 mb-1.5">
        <Badge style={{ background: "#EEEDFD", color: "#5046E5" }}>ACTIVE</Badge>
        <h1 className="text-[23px] font-extrabold tracking-[-0.5px]">{data.project.title}</h1>
      </div>
      <div className="flex items-center gap-4 mb-5 text-[13.5px] text-muted">
        <span>Lead: <b className="text-ink">{data.project.lead}</b></span>
        <span className="text-[#D8D6CE]">·</span>
        <span>You: <b className="text-ink">{data.project.role}</b></span>
        <span className="text-[#D8D6CE]">·</span>
        <span>Due in <b className="text-ink">{data.project.due}</b></span>
        <div className="ml-auto flex items-center">
          {data.teamAvatars.map((a) => (
            <div
              key={a.initials}
              className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-[11px] border-2 border-background -ml-1.5"
              style={{ background: AVATAR_COLORS[a.i % AVATAR_COLORS.length] }}
            >
              {a.initials}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 flex-1 min-h-0">
        {data.columns.map((col) => (
          <div key={col.name} className="bg-[#F1F0EC] rounded-[13px] p-[11px_11px_14px] flex flex-col min-h-0">
            <div className="flex items-center gap-2 p-[5px_7px_12px]">
              <span className="w-2 h-2 rounded-full" style={{ background: col.dot }} />
              <span className="font-bold text-[13px]">{col.name}</span>
              <span className="ml-auto font-mono font-semibold text-[11px] text-muted-2 bg-white px-1.5 rounded-full">
                {col.tasks.length}
              </span>
            </div>
            <div className="flex flex-col gap-2.5 overflow-y-auto">
              {col.tasks.map((t) => (
                <div key={t.id} className="bg-white border border-[#E8E7E1] rounded-[10px] p-[11px_12px] cursor-grab">
                  <span
                    className="inline-flex font-mono font-semibold text-[10.5px] px-1.5 py-0.5 rounded"
                    style={{ background: `${t.tagColor}14`, color: t.tagColor }}
                  >
                    {t.tag}
                  </span>
                  <div className="text-[13px] font-semibold leading-snug my-2 text-[#2A2926]">{t.title}</div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-md text-white flex items-center justify-center font-bold text-[10px]"
                      style={{ background: AVATAR_COLORS[t.ai % AVATAR_COLORS.length] }}
                    >
                      {t.assignee}
                    </div>
                    <span className="font-mono font-semibold text-[11px] text-[#B5B3AA] ml-auto">{t.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
