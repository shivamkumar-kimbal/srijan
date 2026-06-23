"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LogIn } from "lucide-react";
import { useAuthStore, useCurrentUser } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const current = useCurrentUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Already signed in → go to the dashboard.
  useEffect(() => {
    if (current) router.replace("/");
  }, [current, router]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const ok = login(email, password);
    if (ok) router.replace("/");
    else setError("Invalid email or password.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7F5] px-6">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-2.5 justify-center mb-5">
          <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-primary to-primary-2 flex items-center justify-center shadow-[0_2px_6px_rgba(80,70,229,0.35)]">
            <Sparkles size={18} className="text-white" />
          </div>
          <div className="leading-none">
            <div className="font-extrabold text-[20px] tracking-[-0.4px]">Srijan</div>
            <div className="font-mono text-[9px] text-muted-2 mt-0.5">नवसृजनमेव प्रगतिपथः।</div>
          </div>
        </div>

        <div className="bg-white border border-[#ECEBE6] rounded-[16px] p-7 shadow-[0_8px_30px_rgba(28,27,26,0.06)]">
          <h1 className="text-[18px] font-extrabold tracking-[-0.3px] mb-1">Sign in</h1>
          <p className="text-[13px] text-muted-2 mb-5">Use your internal credentials to continue.</p>

          <form onSubmit={submit} className="flex flex-col gap-3.5">
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted-2 mb-1.5">Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                placeholder="admin"
                className="w-full h-10 px-3 rounded-[9px] border border-[#E7E6E0] bg-[#FCFCFB] text-[14px] outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="block text-[12px] font-semibold text-muted-2 mb-1.5">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full h-10 px-3 rounded-[9px] border border-[#E7E6E0] bg-[#FCFCFB] text-[14px] outline-none focus:border-primary"
              />
            </label>

            {error && (
              <div className="text-[12.5px] text-[#C2552E] bg-[#FCEEE9] border border-[#F2D9CE] rounded-[8px] px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-1 inline-flex items-center justify-center gap-2 w-full h-11 rounded-[9px] bg-primary text-white font-bold text-sm shadow-[0_2px_8px_rgba(80,70,229,0.3)]"
            >
              <LogIn size={16} /> Sign in
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#F1F0EC]">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-2 mb-2">
              Demo accounts
            </div>
            <ul className="text-[12.5px] text-muted space-y-1 font-mono">
              <li><b className="text-ink">admin</b> / admin — full access</li>
              <li><b className="text-ink">manager@srijan.dev</b> / manager123</li>
              <li><b className="text-ink">member@srijan.dev</b> / member123</li>
              <li><b className="text-ink">viewer@srijan.dev</b> / viewer123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
