import { useTranslations } from "next-intl";

import { BusesView } from "@/components/buses/buses-view";
import { PageHeader } from "@/components/ui/page-header";

export default function BusesPage() {
  const t = useTranslations("buses");
  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <BusesView />
    </div>
  );
}
