"use client";

import { LogOut, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/use-auth";
import { cn } from "@/lib/utils/cn";

import { NAV_ITEMS } from "./nav";

const NAV_BASE =
  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors";
const NAV_ACTIVE = "bg-[#eaeef5] text-brand-navy";
const NAV_IDLE = "text-slate-600 hover:bg-slate-100";

export function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const onSignOut = () => {
    logout.mutate(undefined, { onSettled: () => router.replace("/login") });
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-border bg-surface py-4">
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(NAV_BASE, active ? NAV_ACTIVE : NAV_IDLE)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{t(item.key)}</span>
              {item.badge ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-status-issue px-1.5 text-xs font-semibold text-white">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-border px-3 pt-3">
        <Link
          href="/settings"
          aria-current={isActive("/settings") ? "page" : undefined}
          className={cn(NAV_BASE, isActive("/settings") ? NAV_ACTIVE : NAV_IDLE)}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {t("settings")}
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          disabled={logout.isPending}
          className={cn(
            NAV_BASE,
            "text-status-issue hover:bg-[#fdecec] disabled:opacity-60",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 rtl:rotate-180" />
          {t("signOut")}
        </button>
      </div>
    </aside>
  );
}
