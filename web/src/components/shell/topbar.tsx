"use client";

import { Search, Bell, MessageSquare, Sparkles } from "lucide-react";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="h-[60px] flex-none border-b border-border bg-white/85 backdrop-blur sticky top-0 z-10 flex items-center gap-4 px-6">
      <div className="font-bold text-[15px]">{title}</div>
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 w-[300px] h-9 px-3 border border-[#E7E6E0] rounded-[9px] bg-[#FCFCFB]">
          <Search size={15} className="text-muted-2" />
          <span className="text-[13.5px] text-muted-2">Search projects, skills, people…</span>
        </div>
        <button className="relative w-9 h-9 rounded-[9px] border border-[#E7E6E0] bg-white flex items-center justify-center text-muted">
          <Bell size={17} />
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[10px] font-mono flex items-center justify-center">12</span>
        </button>
        <button className="relative w-9 h-9 rounded-[9px] border border-[#E7E6E0] bg-white flex items-center justify-center text-muted">
          <MessageSquare size={17} />
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#C2552E] text-white text-[10px] font-mono flex items-center justify-center">5</span>
        </button>
        <div className="flex items-center gap-2 h-[34px] px-3 rounded-[9px] bg-gold-bg border border-[#F2E4C5]">
          <Sparkles size={14} className="text-[#C99528]" />
          <span className="font-mono font-bold text-[13px] text-gold">1,240</span>
        </div>
        <div className="w-[34px] h-[34px] rounded-[9px] bg-ink text-white flex items-center justify-center font-bold text-[13px]">SK</div>
      </div>
    </header>
  );
}
