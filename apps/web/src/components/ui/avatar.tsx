import { cn } from "@/lib/utils/cn";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Circular initials avatar (stand-in for photos in the design). */
export function Avatar({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-[#dbe3ef] font-semibold text-brand-navy",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
