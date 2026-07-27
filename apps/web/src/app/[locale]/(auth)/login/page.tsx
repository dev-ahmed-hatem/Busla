"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bus, Eye, EyeOff, Loader2, Lock, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/use-auth";

const schema = z.object({
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
  password: z.string().min(1, "passwordRequired"),
});
type FormValues = z.infer<typeof schema>;

/** BUSLA wordmark — navy with the amber "L". */
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      BUS<span className="text-brand-amber">L</span>A
    </span>
  );
}

/** Left brand panel (desktop only): navy gradient, tagline, and a product preview card. */
function BrandPanel() {
  const t = useTranslations("auth");
  return (
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-navy to-[#0a1730] lg:flex lg:flex-col lg:justify-between lg:p-12">
      {/* soft decorative glows */}
      <div
        className="pointer-events-none absolute -start-16 -top-16 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--color-brand-amber) 30%, transparent)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -end-10 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--color-status-info) 30%, transparent)" }}
      />

      <Wordmark className="relative text-2xl text-white" />

      <div className="relative">
        <h1 className="max-w-sm text-3xl font-bold leading-tight text-white">{t("brandHeadline")}</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">{t("brandSubtext")}</p>

        {/* live-journey preview — echoes the product */}
        <div className="mt-8 max-w-sm rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-amber text-brand-navy">
              <Bus className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">Bus 05</div>
              <div className="truncate text-xs text-white/60">{t("previewRoute")}</div>
            </div>
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-status-ontime"
              style={{ background: "color-mix(in srgb, var(--color-status-on-time) 22%, transparent)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-status-ontime" />
              {t("liveNow")}
            </span>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-2/3 rounded-full bg-brand-amber" />
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-white/60">
            <MapPin className="h-3 w-3" />
            8 / 12 stops
          </div>
        </div>
      </div>

      <p className="relative text-xs text-white/40">© {new Date().getFullYear()} BUSLA</p>
    </div>
  );
}

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, { onSuccess: () => router.replace("/dashboard") });
  });

  const fieldBase =
    "h-11 w-full rounded-lg border border-border bg-surface ps-10 pe-3 text-sm text-brand-navy outline-none transition-colors placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-brand-navy)_16%,transparent)]";

  return (
    <main className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-2">
      <BrandPanel />

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          {/* mobile logo (brand panel is hidden below lg) */}
          <Wordmark className="mb-8 block text-2xl text-brand-navy lg:hidden" />

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-brand-navy">{t("welcomeTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("welcomeSubtitle")}</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brand-navy">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  placeholder={t("emailPlaceholder")}
                  className={fieldBase}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
              </div>
              {errors.email?.message && (
                <span className="mt-1 block text-xs text-status-issue">{t(errors.email.message)}</span>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-brand-navy">
                  {t("password")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-status-info hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("passwordPlaceholder")}
                  className={`${fieldBase} pe-10`}
                  aria-invalid={!!errors.password}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  className="absolute inset-y-0 end-0 grid w-10 place-items-center text-slate-400 hover:text-brand-navy"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password?.message && (
                <span className="mt-1 block text-xs text-status-issue">
                  {t(errors.password.message)}
                </span>
              )}
            </div>

            {login.isError && (
              <p
                role="alert"
                className="rounded-lg border px-3 py-2 text-sm text-status-issue"
                style={{
                  borderColor: "color-mix(in srgb, var(--color-status-issue) 30%, transparent)",
                  background: "color-mix(in srgb, var(--color-status-issue) 10%, transparent)",
                }}
              >
                {t("invalidCredentials")}
              </p>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="mt-1 flex h-11 items-center justify-center gap-2 rounded-lg bg-brand-navy text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {login.isPending ? t("signingIn") : t("login")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
