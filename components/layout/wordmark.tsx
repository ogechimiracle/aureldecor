import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  tone?: "dark" | "light";
  withSubline?: boolean;
}

export function Wordmark({
  className,
  tone = "dark",
  withSubline = true,
}: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.brandName} — home`}
      className={cn("inline-flex flex-col leading-none", className)}
    >
      <span
        className={cn(
          "font-serif text-[1.6rem] tracking-[0.2em]",
          tone === "light" ? "text-ivory" : "text-ink",
        )}
      >
        {siteConfig.wordmark}
      </span>
      {withSubline ? (
        <span
          className={cn(
            "mt-1 text-[0.5rem] uppercase tracking-[0.44em]",
            tone === "light" ? "text-ivory/70" : "text-ink-mute",
          )}
        >
          Interiors
        </span>
      ) : null}
    </Link>
  );
}
