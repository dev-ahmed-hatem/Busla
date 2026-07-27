"use client";

import { Bell, ChevronDown, LogOut, Menu, Search, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useRef, useState } from "react";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useUnreadCount } from "@/lib/api/hooks";
import { useAuth } from "@/lib/auth/use-auth";
import { useSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

import { LocaleSwitch } from "./locale-switch";
import { SEGMENT_LABEL } from "./nav";

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

/** Account chip → click-away dropdown with Settings + Sign out. */
function UserMenu() {
  const tNav = useTranslations("nav");
  const tRoles = useTranslations("roles");
  const user = useSession((s) => s.user);
  const router = useRouter();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const signOut = () => {
    setOpen(false);
    logout.mutate(undefined, { onSettled: () => router.replace("/login") });
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn("flex items-center gap-2 rounded-pill p-1 hover:bg-slate-100")}
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-full bg-brand-navy text-xs font-semibold text-white">
          {user ? initials(user.full_name || user.email) : ""}
          <span className="absolute -end-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-status-ontime" />
        </span>
        <span className="hidden text-start text-sm leading-tight sm:block">
          <span className="block font-medium text-brand-navy">
            {user?.full_name || user?.email || "…"}
          </span>
          <span className="block text-xs text-slate-500">{user ? tRoles(user.user_type) : ""}</span>
        </span>
        <ChevronDown className={cn("hidden h-4 w-4 text-slate-400 transition-transform sm:block", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 z-20 mt-1 w-44 overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <Settings className="h-4 w-4" />
            {tNav("settings")}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={signOut}
            disabled={logout.isPending}
            className="flex w-full items-center gap-2 px-3 py-2 text-start text-sm text-status-issue hover:bg-[#fdecec] disabled:opacity-60"
          >
            <LogOut className="h-4 w-4 rtl:rotate-180" />
            {tNav("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}

export function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const t = useTranslations("common");
  const router = useRouter();
  const { data: unread } = useUnreadCount();
  const unreadCount = unread?.count ?? 0;
  const [query, setQuery] = useState("");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) router.push(`/users?q=${encodeURIComponent(q)}`);
  };

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

      <form onSubmit={onSearch} className="mx-auto hidden w-full max-w-md flex-1 justify-center md:flex">
        <div className="relative w-full">
          <button
            type="submit"
            aria-label={t("search")}
            className="absolute inset-y-0 start-0 grid w-9 place-items-center text-slate-400 hover:text-brand-navy"
          >
            <Search className="h-4 w-4" />
          </button>
          <input
            type="search"
            dir="auto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="h-9 w-full rounded-pill border border-border bg-background ps-9 pe-4 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </form>

      <div className="flex-1 md:hidden" />

      <LocaleSwitch />

      <Link
        href="/notifications"
        aria-label="Notifications"
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-slate-100"
      >
        <Bell className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-status-issue px-1 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>

      <UserMenu />
    </header>
  );
}
