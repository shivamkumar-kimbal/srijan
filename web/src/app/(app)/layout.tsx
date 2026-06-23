import { Providers } from "@/components/providers";
import { AppShell } from "@/components/shell/app-shell";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
