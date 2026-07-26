import { useTranslations } from "next-intl";

import { Placeholder } from "@/components/ui/placeholder";

export default function UsersPage() {
  const t = useTranslations("nav");
  return <Placeholder title={t("users")} />;
}
