import { useTranslations } from "next-intl";

import { UsersView } from "@/components/users/users-view";
import { PageHeader } from "@/components/ui/page-header";

export default function UsersPage() {
  const t = useTranslations("users");
  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <UsersView />
    </div>
  );
}
