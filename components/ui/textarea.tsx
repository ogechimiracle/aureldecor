import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full rounded-sm border border-line bg-card px-3.5 py-3 text-sm text-ink transition-colors placeholder:text-ink-mute focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-terracotta",
        className,
      )}
      {...props}
    />
  );
}
