import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const button = cva(
  "inline-flex items-center justify-center gap-2 rounded-[9px] font-bold cursor-pointer transition-colors disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-[0_2px_8px_rgba(80,70,229,0.3)] hover:bg-[#453dd0]",
        secondary: "bg-surface text-[#5B5A55] border border-[#E2E1DB] hover:bg-[#FCFCFB]",
        ghost: "bg-transparent text-muted hover:text-ink",
      },
      size: {
        sm: "h-9 px-3 text-[13px]",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-[14.5px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />;
}
