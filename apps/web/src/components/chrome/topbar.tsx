import { useTranslations } from "next-intl";

import { LocaleSwitch } from "./locale-switch";

export function TopBar() {
  const t = useTranslations("common");
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
        <div className="h-9 w-9 rounded-full bg-brand-navy" aria-hidden />
      </div>
    </header>
  );
}
