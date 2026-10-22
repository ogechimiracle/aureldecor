"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  tone?: "dark" | "light";
  className?: string;
}

export function ThemeToggle({ tone = "dark", className }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full border transition-colors duration-300",
        tone === "light"
          ? "border-onmedia/40 text-onmedia hover:bg-onmedia/15"
          : "border-line text-ink-soft hover:border-ink hover:text-ink",
        className,
      )}
    >
      {isDark ? (
        <Sun className="size-[1.05rem]" aria-hidden />
      ) : (
        <Moon className="size-[1.05rem]" aria-hidden />
      )}
    </button>
  );
}
