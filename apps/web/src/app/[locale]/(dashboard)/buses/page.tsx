import { useTranslations } from "next-intl";

import { Placeholder } from "@/components/ui/placeholder";

export default function BusesPage() {
  const t = useTranslations("nav");
  return <Placeholder title={t("buses")} />;
}
