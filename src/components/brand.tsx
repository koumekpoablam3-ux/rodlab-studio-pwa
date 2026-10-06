import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials as getInitials } from "@/lib/format";

/** Marque officielle : logo R + accolade, issu des fichiers de l'entreprise. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/icons/logo-mark.png"
      alt=""
      width={512}
      height={512}
      priority
      aria-hidden="true"
      className={cn("h-10 w-10 select-none rounded-xl", className)}
    />
  );
}

export function Logo({
  className,
  size = "md",
  light = false,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  light?: boolean;
}) {
  const markSize = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markSize} />
      <span
        className={cn(
          "font-display font-semibold tracking-tight",
          light ? "text-cream-50" : "text-ink-900",
          textSize
        )}
      >
        RodLab<span className={light ? "text-gold-400" : "text-terra-600"}> Studio</span>
      </span>
    </span>
  );
}

export function Avatar({
  name,
  color = "#bd4f2b",
  size = "md",
  className,
}: {
  name: string;
  color?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim =
    size === "sm" ? "h-8 w-8 text-[11px]" : size === "lg" ? "h-16 w-16 text-xl" : "h-10 w-10 text-sm";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        dim,
        className
      )}
      style={{ backgroundColor: color || "#bd4f2b" }}
    >
      {getInitials(name)}
    </span>
  );
}
