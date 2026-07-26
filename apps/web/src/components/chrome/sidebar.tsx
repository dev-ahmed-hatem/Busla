import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

const ITEMS = [
  { key: "dashboard", href: "/dashboard" },
  { key: "liveTracking", href: "/live-tracking" },
  { key: "routePlanning", href: "/route-planning" },
  { key: "users", href: "/users/students" },
  { key: "buses", href: "/buses" },
] as const;

export function Sidebar() {
  const t = useTranslations("nav");
  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-border bg-surface">
      <div className="px-6 py-5 text-xl font-bold text-brand-navy">
        BUS<span className="text-brand-amber">L</span>A
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          >
            {t(item.key)}
          </Link>
        ))}
      </nav>
      <div className="px-3 py-4">
        <Link
          href="/settings"
          className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
        >
          {t("settings")}
        </Link>
      </div>
    </aside>
  );
}
