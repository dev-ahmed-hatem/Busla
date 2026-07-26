import { useTranslations } from "next-intl";

import { Placeholder } from "@/components/ui/placeholder";

export default function SettingsPage() {
  const t = useTranslations("nav");
  return <Placeholder title={t("settings")} />;
}
