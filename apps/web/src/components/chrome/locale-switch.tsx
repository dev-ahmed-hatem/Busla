"use client";

import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";

/** Toggles EN ⇆ AR, which flips the document direction (LTR ⇆ RTL). */
export function LocaleSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const next = locale === "en" ? "ar" : "en";
  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: next })}
      className="rounded-pill border border-border px-3 py-1 text-sm font-medium"
    >
      {next.toUpperCase()}
    </button>
  );
}
