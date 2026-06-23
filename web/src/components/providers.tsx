"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { setAccessToken } from "@/lib/api";

// Pushes the Entra access token (when present) into the API client. No-op in dev.
function TokenBridge() {
  const { data } = useSession();
  useEffect(() => {
    setAccessToken((data as { accessToken?: string } | null)?.accessToken);
  }, [data]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false } },
      })
  );
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <TokenBridge />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
