"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth/use-auth";

const schema = z.object({
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
  password: z.string().min(1, "passwordRequired"),
});
type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => router.replace("/dashboard"),
    });
  });

  return (
    <main className="grid min-h-screen place-items-center bg-background">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 shadow-sm">
        <div className="mb-6 text-center text-2xl font-bold text-brand-navy">
          BUS<span className="text-brand-amber">L</span>A
        </div>
        <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
          <label className="text-sm">
            {t("email")}
            <input
              type="email"
              autoComplete="email"
              className="mt-1 h-10 w-full rounded-md border border-border px-3"
              {...register("email")}
            />
            {errors.email?.message && (
              <span className="mt-1 block text-xs text-status-issue">
                {t(errors.email.message)}
              </span>
            )}
          </label>
          <label className="text-sm">
            {t("password")}
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1 h-10 w-full rounded-md border border-border px-3"
              {...register("password")}
            />
            {errors.password?.message && (
              <span className="mt-1 block text-xs text-status-issue">
                {t(errors.password.message)}
              </span>
            )}
          </label>

          {login.isError && (
            <p role="alert" className="text-sm text-status-issue">
              {t("invalidCredentials")}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="mt-2 h-10 rounded-md bg-brand-navy font-medium text-white disabled:opacity-60"
          >
            {login.isPending ? t("signingIn") : t("login")}
          </button>

          <Link
            href="/forgot-password"
            className="text-center text-sm text-brand-navy underline-offset-2 hover:underline"
          >
            {t("forgotPassword")}
          </Link>
        </form>
      </div>
    </main>
  );
}
