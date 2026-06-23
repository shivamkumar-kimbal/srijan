"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Compass,
  FileText,
  KanbanSquare,
  Bot,
  Briefcase,
  User,
  Trophy,
  Gift,
  GraduationCap,
  LifeBuoy,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/explore", label: "Explore Projects", icon: Compass },
  { href: "/proposals", label: "My Proposals", icon: FileText },
  { href: "/projects", label: "My Projects", icon: KanbanSquare },
  { href: "/automation", label: "Automation Hub", icon: Bot },
  { href: "/jobs", label: "Internal Jobs", icon: Briefcase },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/rewards", label: "Rewards", icon: Gift },
  { href: "/learning", label: "Learning", icon: GraduationCap },
  { href: "/help", label: "Help & Support", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();
  const available = useUIStore((s) => s.available);
  const toggle = useUIStore((s) => s.toggleAvailable);

  return (
    <aside className="w-[250px] flex-none bg-surface border-r border-border flex flex-col py-4 px-3 h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-2 pb-4">
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-primary to-primary-2 flex items-center justify-center shadow-[0_2px_6px_rgba(80,70,229,0.35)]">
          <Sparkles size={17} className="text-white" />
        </div>
        <div className="leading-none">
          <div className="font-extrabold text-[19px] tracking-[-0.4px]">Srijan</div>
          <div className="font-mono text-[8.5px] text-muted-2 mt-0.5">सृजन · नवसृजनमेव प्रगतिपथः।</div>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5 overflow-y-auto flex-1 -mx-1 px-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[9px] text-sm transition-colors",
                active
                  ? "bg-primary-bg text-primary font-semibold"
                  : "text-[#6B6A64] font-medium hover:bg-[#F4F3EF]"
              )}
            >
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-3 rounded-[11px] border border-border bg-[#FCFCFB] p-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-semibold">Available for Gigs</span>
          <button
            onClick={toggle}
            className={cn(
              "w-9 h-5 rounded-full transition-colors relative",
              available ? "bg-green" : "bg-[#D8D6CE]"
            )}
            aria-label="toggle availability"
          >
            <span
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
                available ? "left-[18px]" : "left-0.5"
              )}
            />
          </button>
        </div>
        <div className="text-[12px] text-muted-2 mt-1">5 hrs / week · Availability</div>
      </div>

      <Link
        href="/post"
        className="mt-2.5 flex items-center justify-center gap-2 h-10 rounded-[9px] bg-primary text-white font-bold text-sm shadow-[0_2px_8px_rgba(80,70,229,0.3)]"
      >
        <Plus size={16} strokeWidth={2.4} /> Post Project
      </Link>
    </aside>
  );
}
