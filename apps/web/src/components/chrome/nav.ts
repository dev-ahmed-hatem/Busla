import { Bus, LayoutDashboard, MapPin, Route, Users, type LucideIcon } from "lucide-react";

export interface NavItem {
  /** i18n key under `nav`. */
  key: string;
  href: string;
  icon: LucideIcon;
}

/** Primary sidebar navigation, in design order. */
export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "liveTracking", href: "/live-tracking", icon: MapPin },
  { key: "routePlanning", href: "/route-planning", icon: Route },
  { key: "users", href: "/users", icon: Users },
  { key: "buses", href: "/buses", icon: Bus },
];

/** URL segment → `nav` i18n key, for breadcrumbs. */
export const SEGMENT_LABEL: Record<string, string> = {
  dashboard: "dashboard",
  "live-tracking": "liveTracking",
  "route-planning": "routePlanning",
  users: "users",
  buses: "buses",
  notifications: "notifications",
  settings: "settings",
};
