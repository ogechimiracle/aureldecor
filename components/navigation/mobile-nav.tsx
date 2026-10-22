"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  tone?: "dark" | "light";
}

export function MobileNav({ tone = "dark" }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the drawer when the route changes, adjusting state during render
  // (React's recommended pattern) so no effect/render cascade is needed.
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const close = () => setOpen(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-sm transition-colors lg:hidden",
            tone === "light"
              ? "text-onmedia hover:bg-onmedia/10"
              : "text-ink hover:bg-sand/70",
          )}
        >
          <Menu className="size-6" />
        </button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-scrim/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col bg-ivory shadow-soft outline-none data-[state=open]:animate-in data-[state=closed]:animate-out lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <DialogPrimitive.Title className="font-serif text-xl tracking-[0.2em]">
              {siteConfig.wordmark}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Primary site navigation
            </DialogPrimitive.Description>
            <DialogPrimitive.Close
              aria-label="Close navigation menu"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink-soft hover:bg-sand/70 hover:text-ink"
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="flex flex-col gap-1">
              {siteConfig.nav.map((link) => {
                const clean = link.href.split("#")[0];
                const active =
                  clean === "/" ? pathname === "/" : pathname.startsWith(clean);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "block border-b border-line/70 py-4 font-serif text-2xl transition-colors",
                        active ? "text-terracotta" : "text-ink hover:text-terracotta",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-line px-6 py-6">
            <Button asChild className="w-full" variant="accent">
              <Link href="/contact">Book a Consultation</Link>
            </Button>
            <p className="mt-4 text-center text-xs text-ink-mute">
              {siteConfig.email}
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
