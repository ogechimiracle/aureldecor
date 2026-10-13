"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  const clean = href.split("#")[0];
  if (clean === "/") return pathname === "/";
  return pathname === clean || pathname.startsWith(`${clean}/`);
}

interface MainNavProps {
  tone?: "dark" | "light";
  className?: string;
  onNavigate?: () => void;
}

export function MainNav({ tone = "dark", className, onNavigate }: MainNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={className}>
      <ul className="flex items-center gap-7">
        {siteConfig.nav.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative text-[0.78rem] uppercase tracking-[0.16em] transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100",
                  tone === "light"
                    ? "text-ivory/80 hover:text-ivory"
                    : "text-ink-soft hover:text-ink",
                  active &&
                    (tone === "light"
                      ? "text-ivory after:scale-x-100"
                      : "text-ink after:scale-x-100"),
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
