"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MainNav } from "@/components/navigation/main-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/layout/wordmark";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

interface SiteHeaderProps {
  brandName?: string;
  wordmark?: string;
}

export function SiteHeader({
  brandName = siteConfig.brandName,
  wordmark = siteConfig.wordmark,
}: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const overlay = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow] duration-500",
        overlay
          ? "border-b border-transparent bg-transparent"
          : "border-b border-line bg-ivory/90 shadow-[0_1px_0_rgba(38,35,31,0.03)] backdrop-blur-md",
      )}
    >
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Wordmark
          tone={overlay ? "light" : "dark"}
          wordmark={wordmark}
          brandName={brandName}
        />

        <div className="hidden items-center gap-8 lg:flex">
          <MainNav tone={overlay ? "light" : "dark"} />
          <div className="flex items-center gap-3">
            <ThemeToggle tone={overlay ? "light" : "dark"} />
            <Button asChild size="sm" variant={overlay ? "lightOutline" : "accent"}>
              <Link href="/contact">Book a Consultation</Link>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle tone={overlay ? "light" : "dark"} />
          <MobileNav tone={overlay ? "light" : "dark"} />
        </div>
      </div>
    </header>
  );
}
