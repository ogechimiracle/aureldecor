import { Play } from "lucide-react";
import type { ProjectVideo as ProjectVideoData } from "@/types";

interface ProjectVideoProps {
  video: NonNullable<ProjectVideoData>;
  title: string;
}

/**
 * Renders the project's video in whichever form it was supplied: an embedded
 * YouTube/Vimeo player, a direct URL, or an uploaded file served by /api/media.
 */
export function ProjectVideo({ video, title }: ProjectVideoProps) {
  if (video.kind === "youtube" || video.kind === "vimeo") {
    const src =
      video.kind === "youtube"
        ? `https://www.youtube-nocookie.com/embed/${video.id}`
        : `https://player.vimeo.com/video/${video.id}`;

    return (
      <div className="relative aspect-video overflow-hidden rounded-sm bg-ink">
        <iframe
          src={src}
          title={`${title} — project film`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  const src = video.kind === "direct" ? video.url : video.src;
  const poster = video.kind === "file" ? video.poster : null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-sm bg-ink">
      <video
        src={src}
        poster={poster ?? undefined}
        controls
        preload="metadata"
        playsInline
        className="absolute inset-0 size-full object-cover"
      >
        Your browser does not support embedded video.
      </video>
    </div>
  );
}

export function VideoBadgeLabel() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink-mute">
      <Play className="size-3.5 text-terracotta" aria-hidden />
      Project film
    </span>
  );
}
