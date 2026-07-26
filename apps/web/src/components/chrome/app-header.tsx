"use client";

import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import { useSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

import { LocaleSwitch } from "./locale-switch";
import { SEGMENT_LABEL } from "./nav";

const NOTIFICATION_COUNT = 20;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function titleCase(segment: string): string {
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function Breadcrumb() {
  const tNav = useTranslations("nav");
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || segments[0] === "dashboard") return null;

  const crumbs = [
    { label: tNav("dashboard"), href: "/dashboard" },
    ...segments.map((seg, i) => ({
      label: SEGMENT_LABEL[seg] ? tNav(SEGMENT_LABEL[seg]) : titleCase(seg),
      href: `/${segments.slice(0, i + 1).join("/")}`,
    })),
  ];

  return (
    <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm lg:flex">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <Fragment key={c.href}>
            {i > 0 && <span className="text-slate-300">›</span>}
            {last ? (
              <span className="font-medium text-brand-navy">{c.label}</span>
            ) : (
              <Link href={c.href} className="text-slate-500 hover:text-brand-navy">
                {c.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

export function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const t = useTranslations("common");
  const tRoles = useTranslations("roles");
  const user = useSession((s) => s.user);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border bg-surface px-4 sm:gap-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open menu"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link
        href="/dashboard"
        className="shrink-0 text-xl font-bold text-brand-navy lg:w-44"
      >
        BUS<span className="text-brand-amber">L</span>A
      </Link>

      <Breadcrumb />

      <div className="mx-auto hidden w-full max-w-md flex-1 justify-center md:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
          <input
            type="search"
            dir="auto"
            placeholder={t("search")}
            className="h-9 w-full rounded-pill border border-border bg-background ps-9 pe-4 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="flex-1 md:hidden" />

      <LocaleSwitch />

      <Link
        href="/notifications"
        aria-label="Notifications"
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-slate-100"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-status-issue px-1 text-[10px] font-semibold text-white">
          {NOTIFICATION_COUNT}
        </span>
      </Link>

      <button
        type="button"
        className={cn("flex shrink-0 items-center gap-2 rounded-pill p-1 hover:bg-slate-100")}
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-brand-navy text-xs font-semibold text-white">
          {user ? initials(user.full_name || user.email) : ""}
          <span className="absolute -end-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-status-ontime" />
        </span>
        <span className="hidden text-start text-sm leading-tight sm:block">
          <span className="block font-medium text-brand-navy">
            {user?.full_name || user?.email || "…"}
          </span>
          <span className="block text-xs text-slate-500">
            {user ? tRoles(user.user_type) : ""}
          </span>
        </span>
        <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
      </button>
    </header>
  );
}
