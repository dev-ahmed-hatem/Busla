"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { useSession } from "@/lib/auth/session";
import { silentRefresh } from "@/lib/auth/silent-refresh";
import { useMe } from "@/lib/auth/use-me";

/**
 * Client guard for the dashboard shell. On mount it attempts a silent refresh (turning
 * the httpOnly cookie into an access token); if that yields no session the user is sent
 * to /login. Children render only once authenticated.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("common");
  const router = useRouter();
  const accessToken = useSession((s) => s.accessToken);
  const [checked, setChecked] = useState(false);

  // Hydrate the user profile as soon as a token exists.
  useMe();

  useEffect(() => {
    let active = true;
    (async () => {
      if (!useSession.getState().accessToken) {
        await silentRefresh();
      }
      if (active) setChecked(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (checked && !accessToken) {
      router.replace("/login");
    }
  }, [checked, accessToken, router]);

  if (!checked || !accessToken) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-brand-navy">
        {t("loading")}
      </div>
    );
  }

  return <>{children}</>;
}
