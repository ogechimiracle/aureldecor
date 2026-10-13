"use client";

import { Maximize2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/portfolio/lightbox";
import type { ProjectGalleryImage } from "@/types";

interface ProjectGalleryProps {
  images: ProjectGalleryImage[];
  title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            aria-label={`Open image ${index + 1} of ${images.length} in a gallery`}
            onClick={() => {
              setActiveIndex(index);
              setOpen(true);
            }}
            className={`group relative overflow-hidden rounded-sm bg-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
              index === 0 ? "col-span-2 aspect-[16/9]" : "aspect-4/5"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={`(min-width: 1024px) ${index === 0 ? "66vw" : "33vw"}, 92vw`}
              className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25">
              <span className="inline-flex size-11 translate-y-2 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <Maximize2 className="size-4" />
              </span>
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        initialIndex={activeIndex}
        open={open}
        onOpenChange={setOpen}
        title={title}
      />
    </div>
  );
}