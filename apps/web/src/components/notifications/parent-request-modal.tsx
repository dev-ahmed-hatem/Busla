"use client";

import { ArrowUpDown, Check, Lightbulb, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Loading } from "@/components/ui/spinner";
import { useParentRequest, useResolveRequest } from "@/lib/api/hooks";

export function ParentRequestModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const t = useTranslations("users.profile");
  const { data: r, isLoading } = useParentRequest(id);
  const resolve = useResolveRequest();

  function handle(action: "approve" | "reject") {
    if (!id) return;
    resolve.mutate({ id, action }, { onSuccess: onClose });
  }

  return (
    <Modal open={!!id} onClose={onClose} title={t("changeDetails")} size="lg">
      {isLoading || !r ? (
        <Loading />
      ) : r.status !== "pending" ? (
        <div className="grid place-items-center py-12 text-center">
          <div className="text-sm font-semibold text-brand-navy">
            {r.status === "approved" ? t("approve") : t("reject")}
          </div>
          <div className="mt-1 text-xs text-slate-400">{r.date}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-brand-navy">{t("changeDetails")}</span>
            <span className="text-xs text-slate-500">{r.date}</span>
          </div>

          <div className="rounded-lg border border-border p-3">
            <div className="text-sm text-slate-600">{r.current.address}</div>
            <div className="mt-1 text-xs text-slate-500">{r.current.route}</div>
            <span className="mt-2 inline-block rounded-full bg-[#e9f7ef] px-2 py-0.5 text-xs font-medium text-status-ontime">
              {r.current.tag}
            </span>
          </div>

          <div className="flex justify-center">
            <ArrowUpDown className="h-4 w-4 text-slate-400" />
          </div>

          <div
            className="rounded-lg border border-border p-3"
            style={{ borderInlineStartWidth: 4, borderInlineStartColor: "var(--color-status-delayed)" }}
          >
            <div className="text-sm text-slate-600">{r.requested.address}</div>
            <span className="mt-2 inline-block rounded-full bg-[#fdf3e7] px-2 py-0.5 text-xs font-medium text-status-delayed">
              {r.requested.status}
            </span>
          </div>

          <div className="rounded-lg bg-[#fdf9ee] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
              <Lightbulb className="h-4 w-4 text-status-delayed" />
              {t("systemSuggestion")}
            </div>
            <p className="mt-1 text-xs text-slate-600">{r.suggestion.text}</p>
            <div className="mt-3 text-sm">
              <span className="mb-1 block text-xs font-medium text-slate-500">
                {t("assignNewBus")} *
              </span>
              <div className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-slate-700">
                {r.suggestion.bus}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <span>{t("seatsLeft", { n: r.suggestion.seatsLeft })}</span>
              <div className="w-24">
                <ProgressBar percent={r.suggestion.percent} tone="delayed" />
              </div>
              <span>{r.suggestion.percent}%</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="dangerOutline" disabled={resolve.isPending} onClick={() => handle("reject")}>
              <X className="h-4 w-4" />
              {t("reject")}
            </Button>
            <Button variant="success" disabled={resolve.isPending} onClick={() => handle("approve")}>
              <Check className="h-4 w-4" />
              {t("approve")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
