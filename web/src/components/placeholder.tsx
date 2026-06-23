import { Card } from "@/components/ui/card";

export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="animate-viewIn max-w-[900px] mx-auto px-8 py-7">
      <h1 className="text-[27px] font-extrabold tracking-[-0.6px] mb-1">{title}</h1>
      <p className="text-[14.5px] text-muted mb-6">{note}</p>
      <Card className="p-10 text-center">
        <div className="text-[40px] mb-3">🚧</div>
        <div className="font-bold text-[16px] mb-1">Coming soon</div>
        <div className="text-[13.5px] text-muted-2">
          This module is on the roadmap — see <code className="font-mono">docs/ROADMAP.md</code>.
        </div>
      </Card>
    </div>
  );
}
