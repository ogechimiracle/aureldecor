import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
  tone?: "dark" | "light";
  withSubline?: boolean;
  wordmark?: string;
  brandName?: string;
}

export function Wordmark({
  className,
  tone = "dark",
  withSubline = true,
  wordmark = siteConfig.wordmark,
  brandName = siteConfig.brandName,
}: WordmarkProps) {
  return (
    <Link
      href="/"
      aria-label={`${brandName} — home`}
      className={cn("inline-flex flex-col leading-none", className)}
    >
      <span
        className={cn(
          "font-serif text-[1.6rem] tracking-[0.2em]",
          tone === "light" ? "text-onmedia" : "text-ink",
        )}
      >
        {wordmark}
      </span>
      {withSubline ? (
        <span
          className={cn(
            "mt-1 text-[0.5rem] uppercase tracking-[0.44em]",
            tone === "light" ? "text-onmedia/70" : "text-ink-mute",
          )}
        >
          Interiors
        </span>
      ) : null}
    </Link>
  );
}
