"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AuthGate } from "@/components/auth-gate";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/explore": "Explore Projects",
  "/proposals": "My Proposals",
  "/projects": "My Projects",
  "/automation": "Automation Hub",
  "/jobs": "Internal Jobs",
  "/profile": "My Profile",
  "/leaderboards": "Leaderboards",
  "/rewards": "Rewards",
  "/learning": "Learning",
  "/help": "Help & Support",
  "/admin": "Admin · Users & Roles",
};

function titleFor(path: string) {
  if (path.startsWith("/explore/")) return "Opportunity";
  return TITLES[path] ?? "Srijan";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AuthGate>
      <div className="flex min-h-screen w-full bg-background text-ink">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar title={titleFor(pathname)} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGate>
  );
}
