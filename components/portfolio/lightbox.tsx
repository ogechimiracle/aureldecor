"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ProjectGalleryImage } from "@/types";

interface LightboxProps {
  images: ProjectGalleryImage[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible label, e.g. the project title. */
  title: string;
}

export function Lightbox({
  images,
  initialIndex,
  open,
  onOpenChange,
  title,
}: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  // Sync the visible image with the requested index when the gallery opens,
  // adjusting state during render (React's recommended pattern for this case).
  const [syncedOpen, setSyncedOpen] = useState(open);

  if (open && syncedOpen !== open) {
    setSyncedOpen(open);
    setIndex(initialIndex);
  }

  const current = images[index];
  if (!current) return null;

  const go = (next: number) => {
    setIndex((next + images.length) % images.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose={false}
        className="max-w-5xl border-none bg-transparent p-0 shadow-none"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          {current.alt} — image {index + 1} of {images.length}
        </DialogDescription>

        <div className="relative">
          <div className="relative aspect-16/9 w-full overflow-hidden rounded-sm">
            <Image
              src={current.src}
              alt={current.alt}
              fill
              sizes="(min-width: 1024px) 64vw, 92vw"
              className="object-cover"
            />
          </div>

          <button
            type="button"
            aria-label="Close gallery"
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-ink/60 text-ivory backdrop-blur-sm transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <span className="sr-only">Close</span>
            <span aria-hidden className="block text-lg leading-none">
              ×
            </span>
          </button>

          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(index - 1)}
            disabled={images.length <= 1}
            className="absolute left-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-ivory backdrop-blur-sm transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(index + 1)}
            disabled={images.length <= 1}
            className="absolute right-4 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink/60 text-ivory backdrop-blur-sm transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-ivory/80">
          {index + 1} / {images.length} — {current.alt}
        </p>
      </DialogContent>
    </Dialog>
  );
}