import { cn } from "@/lib/utils/cn";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Circular avatar: shows the uploaded photo when `src` is set, else initials. */
export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- user-uploaded media, not a static asset
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }
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
