import { useTranslations } from "next-intl";

/** Phase-0 placeholder. Real JWT login lands in Phase 1 (Auth slice). */
export default function LoginPage() {
  const t = useTranslations("auth");
  return (
    <main className="grid min-h-screen place-items-center bg-background">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center text-2xl font-bold text-brand-navy">
          BUS<span className="text-brand-amber">L</span>A
        </div>
        <form className="flex flex-col gap-4">
          <label className="text-sm">
            {t("email")}
            <input
              type="email"
              className="mt-1 h-10 w-full rounded-md border border-border px-3"
            />
          </label>
          <label className="text-sm">
            {t("password")}
            <input
              type="password"
              className="mt-1 h-10 w-full rounded-md border border-border px-3"
            />
          </label>
          <button
            type="button"
            className="mt-2 h-10 rounded-md bg-brand-navy font-medium text-white"
          >
            {t("login")}
          </button>
        </form>
      </div>
    </main>
  );
}
