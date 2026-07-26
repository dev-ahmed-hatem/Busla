import { useTranslations } from "next-intl";

import { NotificationsView } from "@/components/notifications/notifications-view";
import { PageHeader } from "@/components/ui/page-header";

export default function NotificationsPage() {
  const t = useTranslations("notifications");
  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <NotificationsView />
    </div>
  );
}
