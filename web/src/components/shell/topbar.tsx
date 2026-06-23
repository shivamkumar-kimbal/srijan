"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, MessageSquare, Sparkles, X, Check } from "lucide-react";
import { useOpportunities } from "@/lib/queries";
import { useCurrentUser } from "@/lib/auth-store";
import { TYPE_META } from "@/lib/types";

type Panel = "search" | "bell" | "chat" | null;

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

interface Thread {
  id: number;
  name: string;
  initials: string;
  color: string;
  preview: string;
  time: string;
  unread: boolean;
}

const SEED_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "Proposal accepted", body: "You're in for “AI PR-Review Assistant”.", time: "2m ago", unread: true },
  { id: 2, title: "New comment", body: "Neha Verma replied on your proposal.", time: "1h ago", unread: true },
  { id: 3, title: "Reward credited", body: "+250 Srijan Points for onboarding docs.", time: "3h ago", unread: true },
  { id: 4, title: "Deadline soon", body: "“Reduce Staging Cloud Spend” closes in 2 days.", time: "5h ago", unread: false },
  { id: 5, title: "Internal job match", body: "SRE Specialist — Cloud Operations (Pune).", time: "1d ago", unread: false },
];

const SEED_THREADS: Thread[] = [
  { id: 1, name: "Neha Verma", initials: "NV", color: "#5046E5", preview: "Can you take the GitHub Actions piece?", time: "4m", unread: true },
  { id: 2, name: "Platform Team", initials: "PT", color: "#1F8A5B", preview: "Standup notes are in the doc 📄", time: "26m", unread: true },
  { id: 3, name: "Rohit Patel", initials: "RP", color: "#C2552E", preview: "Thanks for the review!", time: "2h", unread: false },
  { id: 4, name: "Ananya Singh", initials: "AS", color: "#8B3FD1", preview: "Let's sync on the migration plan.", time: "1d", unread: false },
];

export function Topbar({ title }: { title: string }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [threads, setThreads] = useState(SEED_THREADS);
  const rootRef = useRef<HTMLDivElement>(null);

  const { data: opps = [] } = useOpportunities();
  const me = useCurrentUser();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return opps
      .filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.desc.toLowerCase().includes(q) ||
          o.skills.some((s) => s.toLowerCase().includes(q)) ||
          o.ownerName.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, opps]);

  const unreadNotif = notifications.filter((n) => n.unread).length;
  const unreadChat = threads.filter((t) => t.unread).length;

  // Close panels on outside click or Escape.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setPanel(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPanel(null);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggle = (p: Panel) => setPanel((cur) => (cur === p ? null : p));

  function goTo(id: number) {
    setPanel(null);
    setQuery("");
    router.push(`/explore/${id}`);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) goTo(results[0].id);
  }

  return (
    <header
      ref={rootRef}
      className="h-[60px] flex-none border-b border-border bg-white/85 backdrop-blur sticky top-0 z-20 flex items-center gap-4 px-6"
    >
      <div className="font-bold text-[15px]">{title}</div>
      <div className="ml-auto flex items-center gap-3">
        {/* SEARCH */}
        <div className="relative hidden md:block">
          <form
            onSubmit={onSearchSubmit}
            className="flex items-center gap-2 w-[300px] h-9 px-3 border border-[#E7E6E0] rounded-[9px] bg-[#FCFCFB] focus-within:border-primary transition-colors"
          >
            <Search size={15} className="text-muted-2 flex-none" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPanel("search");
              }}
              onFocus={() => setPanel("search")}
              placeholder="Search projects, skills, people…"
              className="flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-muted-2"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-muted-2 hover:text-ink flex-none"
                aria-label="clear search"
              >
                <X size={14} />
              </button>
            )}
          </form>
          {panel === "search" && query.trim() && (
            <Dropdown className="w-[360px]">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-[13px] text-muted-2">
                  No matches for “{query}”.
                </div>
              ) : (
                results.map((o) => {
                  const m = TYPE_META[o.type];
                  return (
                    <button
                      key={o.id}
                      onClick={() => goTo(o.id)}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-[#F7F6F2] transition-colors"
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex-none flex items-center justify-center font-bold text-[13px]"
                        style={{ background: m.bg, color: m.fg }}
                      >
                        {o.title[0]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-[13.5px] truncate">{o.title}</span>
                        <span className="block text-[11.5px] text-muted-2 truncate">
                          {m.label} · {o.ownerName}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </Dropdown>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div className="relative">
          <IconButton
            onClick={() => toggle("bell")}
            active={panel === "bell"}
            badge={unreadNotif}
            badgeColor="#5046E5"
            label="notifications"
          >
            <Bell size={17} />
          </IconButton>
          {panel === "bell" && (
            <Dropdown className="w-[340px] right-0">
              <PanelHeader
                title="Notifications"
                action={unreadNotif > 0 ? "Mark all read" : undefined}
                onAction={() =>
                  setNotifications((ns) => ns.map((n) => ({ ...n, unread: false })))
                }
              />
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() =>
                      setNotifications((ns) =>
                        ns.map((x) => (x.id === n.id ? { ...x, unread: false } : x))
                      )
                    }
                    className="w-full text-left flex gap-3 px-4 py-3 hover:bg-[#F7F6F2] transition-colors border-b border-[#F4F3EF] last:border-0"
                  >
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full flex-none ${
                        n.unread ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-[13px]">{n.title}</span>
                        <span className="ml-auto text-[11px] text-muted-2 flex-none">{n.time}</span>
                      </span>
                      <span className="block text-[12.5px] text-muted mt-0.5">{n.body}</span>
                    </span>
                  </button>
                ))}
              </div>
            </Dropdown>
          )}
        </div>

        {/* CHAT */}
        <div className="relative">
          <IconButton
            onClick={() => toggle("chat")}
            active={panel === "chat"}
            badge={unreadChat}
            badgeColor="#C2552E"
            label="messages"
          >
            <MessageSquare size={17} />
          </IconButton>
          {panel === "chat" && (
            <Dropdown className="w-[340px] right-0">
              <PanelHeader
                title="Messages"
                action={unreadChat > 0 ? "Mark all read" : undefined}
                onAction={() => setThreads((ts) => ts.map((t) => ({ ...t, unread: false })))}
              />
              <div className="max-h-[360px] overflow-y-auto">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      setThreads((ts) =>
                        ts.map((x) => (x.id === t.id ? { ...x, unread: false } : x))
                      )
                    }
                    className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-[#F7F6F2] transition-colors border-b border-[#F4F3EF] last:border-0"
                  >
                    <span
                      className="w-9 h-9 rounded-[10px] flex-none flex items-center justify-center font-bold text-white text-[12px]"
                      style={{ background: t.color }}
                    >
                      {t.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-[13px]">{t.name}</span>
                        <span className="ml-auto text-[11px] text-muted-2 flex-none">{t.time}</span>
                      </span>
                      <span className="block text-[12.5px] text-muted truncate mt-0.5">{t.preview}</span>
                    </span>
                    {t.unread && <span className="w-2 h-2 rounded-full bg-[#C2552E] flex-none" />}
                  </button>
                ))}
              </div>
            </Dropdown>
          )}
        </div>

        <div className="flex items-center gap-2 h-[34px] px-3 rounded-[9px] bg-gold-bg border border-[#F2E4C5]">
          <Sparkles size={14} className="text-[#C99528]" />
          <span className="font-mono font-bold text-[13px] text-gold">1,240</span>
        </div>
        <div className="w-[34px] h-[34px] rounded-[9px] bg-ink text-white flex items-center justify-center font-bold text-[13px]">
          {me?.initials ?? "SK"}
        </div>
      </div>
    </header>
  );
}

function IconButton({
  children,
  onClick,
  active,
  badge,
  badgeColor,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
  badge: number;
  badgeColor: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`relative w-9 h-9 rounded-[9px] border flex items-center justify-center transition-colors ${
        active ? "border-primary bg-primary-bg text-primary" : "border-[#E7E6E0] bg-white text-muted"
      }`}
    >
      {children}
      {badge > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-white text-[10px] font-mono flex items-center justify-center"
          style={{ background: badgeColor }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function Dropdown({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`absolute top-[calc(100%+8px)] bg-white border border-border rounded-[12px] shadow-[0_12px_32px_rgba(20,20,20,0.12)] overflow-hidden z-30 animate-viewIn ${className}`}
    >
      {children}
    </div>
  );
}

function PanelHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F0EC]">
      <span className="font-bold text-[14px]">{title}</span>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline"
        >
          <Check size={13} /> {action}
        </button>
      )}
    </div>
  );
}
