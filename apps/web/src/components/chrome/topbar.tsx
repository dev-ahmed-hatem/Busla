"use client";

import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/lib/auth/session";
import { useAuth } from "@/lib/auth/use-auth";

import { LocaleSwitch } from "./locale-switch";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TopBar() {
  const t = useTranslations("common");
  const tNav = useTranslations("nav");
  const tRoles = useTranslations("roles");
  const router = useRouter();
  const user = useSession((s) => s.user);
  const { logout } = useAuth();

  const onSignOut = () => {
    logout.mutate(undefined, { onSettled: () => router.replace("/login") });
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-surface px-6">
      <input
        type="search"
        dir="auto"
        placeholder={t("search")}
        className="h-9 w-96 max-w-full rounded-pill border border-border bg-background px-4 text-sm"
      />
      <div className="ms-auto flex items-center gap-4">
        <LocaleSwitch />
        {user && (
          <div className="flex items-center gap-2">
            <div className="text-end text-sm leading-tight">
              <div className="font-medium text-brand-navy">
                {user.full_name || user.email}
              </div>
              <div className="text-xs opacity-70">{tRoles(user.user_type)}</div>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-navy text-xs font-semibold text-white">
              {initials(user.full_name || user.email)}
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={onSignOut}
          disabled={logout.isPending}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-brand-navy disabled:opacity-60"
        >
          {tNav("signOut")}
        </button>
      </div>
    </header>
  );
}
