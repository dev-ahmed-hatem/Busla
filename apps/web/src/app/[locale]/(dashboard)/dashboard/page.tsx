"use client";

import { StatusPill } from "@busla/ui";
import { useTranslations } from "next-intl";

import { useHealth } from "@/lib/api/use-health";

/** Phase-0 walking-skeleton screen: fetches /health via the generated client. */
export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data, isLoading, isError } = useHealth();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-brand-navy">{t("title")}</h1>

      <section className="max-w-md rounded-card border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">{t("healthTitle")}</h2>
        {isLoading && <p className="text-sm text-slate-500">…</p>}
        {isError && <StatusPill status="issue" label="API unreachable" />}
        {data && (
          <div className="flex flex-col gap-2">
            <StatusPill status={data.status === "ok" ? "on_time" : "issue"} label={t("healthOk")} />
            <dl className="mt-2 grid grid-cols-2 gap-1 text-sm text-slate-600">
              <dt>Service</dt>
              <dd className="text-end">{data.service}</dd>
              <dt>Version</dt>
              <dd className="text-end">{data.version}</dd>
            </dl>
          </div>
        )}
      </section>
    </div>
  );
}
