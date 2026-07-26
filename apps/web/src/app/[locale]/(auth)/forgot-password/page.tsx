"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Link } from "@/i18n/navigation";

const schema = z.object({
  email: z.string().min(1, "emailRequired").email("emailInvalid"),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const reset = useMutation({
    mutationFn: async (values: FormValues) => {
      await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    },
  });

  const onSubmit = handleSubmit((values) => reset.mutate(values));

  return (
    <main className="grid min-h-screen place-items-center bg-background">
      <div className="w-full max-w-sm rounded-card border border-border bg-surface p-8 shadow-sm">
        <div className="mb-2 text-center text-2xl font-bold text-brand-navy">
          BUS<span className="text-brand-amber">L</span>A
        </div>
        <h1 className="mb-1 text-center text-lg font-semibold text-brand-navy">
          {t("forgotTitle")}
        </h1>

        {reset.isSuccess ? (
          <p role="status" className="mt-4 text-center text-sm">
            {t("resetEmailSent")}
          </p>
        ) : (
          <>
            <p className="mb-6 text-center text-sm">{t("forgotSubtitle")}</p>
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
              <button
                type="submit"
                disabled={reset.isPending}
                className="mt-2 h-10 rounded-md bg-brand-navy font-medium text-white disabled:opacity-60"
              >
                {reset.isPending ? t("sending") : t("sendResetLink")}
              </button>
            </form>
          </>
        )}

        <Link
          href="/login"
          className="mt-6 block text-center text-sm text-brand-navy underline-offset-2 hover:underline"
        >
          {t("backToLogin")}
        </Link>
      </div>
    </main>
  );
}
