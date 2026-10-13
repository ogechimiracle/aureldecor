import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-sm border border-line bg-card px-3.5 py-2 text-sm text-ink shadow-[inset_0_1px_0_rgba(38,35,31,0.02)] transition-colors placeholder:text-ink-mute focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-terracotta",
        className,
      )}
      {...props}
    />
  );
}
