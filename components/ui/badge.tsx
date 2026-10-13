import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line-strong bg-ivory/70 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ink-soft",
        className,
      )}
      {...props}
    />
  );
}
