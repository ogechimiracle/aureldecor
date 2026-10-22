"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Minimal server-side logging only — never surface stack traces to users.
    console.error("[error boundary]", error.message, error.digest ?? "");
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] items-center py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow text-terracotta">Something went wrong</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
          An unexpected error occurred.
        </h1>
        <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
          Please try again. If the problem persists, feel free to contact the
          studio directly.
        </p>
        <div className="mt-9 flex justify-center">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </Container>
  );
}