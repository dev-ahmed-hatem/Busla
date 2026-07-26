import type { ReactNode } from "react";

import { PageHeader } from "./page-header";

/** Temporary section stub until the screen is built out (design-catalog.md). */
export function Placeholder({ title, subtitle }: { title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid h-64 place-items-center rounded-card border border-dashed border-border bg-surface text-sm text-slate-400">
        Coming soon
      </div>
    </div>
  );
}
