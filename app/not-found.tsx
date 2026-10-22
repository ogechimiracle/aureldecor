import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1 pt-20">
        <Container className="flex min-h-[70vh] items-center py-24">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-terracotta">Error 404</p>
            <h1 className="mt-4 text-balance font-serif text-4xl leading-tight sm:text-5xl">
              This room doesn&apos;t exist.
            </h1>
            <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
              The page you&apos;re looking for may have moved or been removed. Let&apos;s
              guide you back to something worth looking at.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to home
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/portfolio">
                  Explore the portfolio
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
