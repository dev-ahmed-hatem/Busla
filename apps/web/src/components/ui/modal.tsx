"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

const SIZES = {
  sm: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

/** Centered dialog with a dimmed backdrop. Renders nothing when `open` is false. */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "sm",
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: keyof typeof SIZES;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-card bg-surface shadow-xl",
          SIZES[size],
        )}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-4 border-b border-border p-6 pb-4">
            <div>
              {title && <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>}
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-auto p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-border p-6 pt-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
