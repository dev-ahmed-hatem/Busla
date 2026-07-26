import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "outline" | "danger" | "dangerOutline" | "success" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-navy text-white hover:opacity-90",
  outline: "border border-border text-slate-700 hover:bg-slate-100",
  danger: "bg-status-issue text-white hover:opacity-90",
  dangerOutline: "border border-status-issue text-status-issue hover:bg-[#fdecec]",
  success: "bg-status-ontime text-white hover:opacity-90",
  ghost: "text-slate-600 hover:bg-slate-100",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-60",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
