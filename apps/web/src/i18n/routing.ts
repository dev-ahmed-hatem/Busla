import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

/** RTL locales — drives the <html dir> attribute. */
export const RTL_LOCALES = new Set(["ar"]);
export function dirFor(locale: string): "rtl" | "ltr" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}
