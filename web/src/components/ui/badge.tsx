import { cn } from "@/lib/utils";

export function Badge({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn("inline-flex items-center rounded-[7px] px-2.5 py-1 text-[11.5px] font-bold", className)}
      style={style}
    >
      {children}
    </span>
  );
}

export function SkillChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[12px] text-[#5B5A55] bg-[#F4F3EF] border border-[#EAE9E3] px-2 py-[3px] rounded-md">
      {children}
    </span>
  );
}
