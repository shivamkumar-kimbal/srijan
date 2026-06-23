"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth-store";

// Client-side guard for the demo credentials auth. Redirects to /login when
// there is no signed-in user. Runs after hydration to avoid SSR mismatch.
export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useCurrentUser();
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready) return null;
  if (!user) return null;
  return <>{children}</>;
}
