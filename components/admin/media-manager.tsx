"use client";

import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Trash2,
  UploadCloud,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface MediaItem {
  id: string;
  mediaType: "image" | "video";
  url: string;
  altText: string;
  originalFilename: string | null;
  mimeType: string;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  sortOrder: number;
}

export interface MediaSelection {
  mediaIds: string[];
  coverMediaId: string | null;
  beforeAfterMediaIds: { before: string | null; after: string | null };
}

interface MediaManagerProps {
  /** Media already attached to this project (edit mode). */
  initialItems: MediaItem[];
  value: MediaSelection;
  onChange: (next: MediaSelection) => void;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaManager({
  initialItems,
  value,
  onChange,
}: MediaManagerProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems);
  const [uploading, setUploading] = useState<"image" | "video" | null>(null);
  const [altText, setAltText] = useState("");
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  // Load leftover unattached uploads so they can be reused.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/media?scope=unattached")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { ok: boolean; media?: MediaItem[] } | null) => {
        const library = data?.media;
        if (cancelled || !data?.ok || !library) return;
        setItems((current) => {
          const known = new Set(current.map((item) => item.id));
          const extras = library.filter((item) => !known.has(item.id));
          return [...current, ...extras];
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoadingLibrary(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const upload = useCallback(
    async (file: File, kind: "image" | "video") => {
      setUploading(kind);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("kind", kind);
        if (altText.trim()) form.append("altText", altText.trim());

        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: form,
        });
        const data = (await response.json().catch(() => null)) as {
          ok: boolean;
          error?: string;
          media?: MediaItem;
        } | null;
        const uploaded = data?.media;

        if (!response.ok || !data?.ok || !uploaded) {
          toast.error(data?.error ?? "Upload failed.");
          return;
        }

        setItems((current) => [uploaded, ...current]);
        onChange({
          ...value,
          mediaIds: [...value.mediaIds, uploaded.id],
          coverMediaId:
            value.coverMediaId ??
            (uploaded.mediaType === "image" ? uploaded.id : null),
        });
        setAltText("");
        toast.success("File uploaded and added to the gallery.");
      } catch {
        toast.error("Upload failed. Please try again.");
      } finally {
        setUploading(null);
      }
    },
    [altText, onChange, value],
  );

  const isSelected = (id: string) => value.mediaIds.includes(id);

  function toggle(id: string) {
    if (isSelected(id)) {
      const mediaIds = value.mediaIds.filter((entry) => entry !== id);
      onChange({
        mediaIds,
        coverMediaId:
          value.coverMediaId === id
            ? (mediaIds.find((mid) => items.find((i) => i.id === mid)?.mediaType === "image") ?? null)
            : value.coverMediaId,
        beforeAfterMediaIds: {
          before: value.beforeAfterMediaIds.before === id ? null : value.beforeAfterMediaIds.before,
          after: value.beforeAfterMediaIds.after === id ? null : value.beforeAfterMediaIds.after,
        },
      });
    } else {
      const firstImage = value.mediaIds
        .map((mid) => items.find((item) => item.id === mid))
        .find((item) => item?.mediaType === "image");
      onChange({
        mediaIds: [...value.mediaIds, id],
        coverMediaId:
          value.coverMediaId ??
          (firstImage ? firstImage.id : items.find((i) => i.id === id)?.mediaType === "image" ? id : null),
        beforeAfterMediaIds: value.beforeAfterMediaIds,
      });
    }
  }

  function move(id: string, direction: -1 | 1) {
    const index = value.mediaIds.indexOf(id);
    if (index < 0) return;
    const next = [...value.mediaIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange({ ...value, mediaIds: next });
  }

  async function remove(item: MediaItem) {
    const wasSelected = isSelected(item.id);
    const remaining = value.mediaIds.filter((id) => id !== item.id);

    if (!wasSelected) {
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      return;
    }

    const attached = initialItems.some((entry) => entry.id === item.id);
    if (attached) {
      onChange({
        ...value,
        mediaIds: remaining,
        coverMediaId: value.coverMediaId === item.id ? (remaining[0] ?? null) : value.coverMediaId,
        beforeAfterMediaIds: {
          before: value.beforeAfterMediaIds.before === item.id ? null : value.beforeAfterMediaIds.before,
          after: value.beforeAfterMediaIds.after === item.id ? null : value.beforeAfterMediaIds.after,
        },
      });
      toast.success("Removed from the gallery. Save the project to apply.");
      return;
    }

    // Not attached anywhere yet — the file itself can be deleted.
    try {
      const response = await fetch(`/api/admin/media/${item.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setItems((current) => current.filter((entry) => entry.id !== item.id));
        onChange({
          mediaIds: remaining,
          coverMediaId: value.coverMediaId === item.id ? null : value.coverMediaId,
          beforeAfterMediaIds: {
            before: value.beforeAfterMediaIds.before === item.id ? null : value.beforeAfterMediaIds.before,
            after: value.beforeAfterMediaIds.after === item.id ? null : value.beforeAfterMediaIds.after,
          },
        });
        toast.success("File deleted.");
      } else {
        toast.error("Could not delete the file.");
      }
    } catch {
      toast.error("Could not delete the file.");
    }
  }

  const selectedImages = value.mediaIds
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is MediaItem => Boolean(item) && item!.mediaType === "image");

  return (
    <div className="space-y-5">
      <div className="rounded-sm border border-dashed border-line-strong bg-ivory/60 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1">
            <label
              htmlFor="media-alt"
              className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-mute"
            >
              Alt text for the next upload
            </label>
            <input
              id="media-alt"
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Describe the next photo for accessibility"
              className="h-10 w-full rounded-sm border border-line bg-card px-3 text-sm text-ink placeholder:text-ink-mute focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
            />
          </div>

          <button
            type="button"
            onClick={() => imageInput.current?.click()}
            disabled={uploading !== null}
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-line-strong bg-card px-4 text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink disabled:opacity-60"
          >
            {uploading === "image" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <UploadCloud className="size-4" aria-hidden />
            )}
            Upload image
          </button>

          <button
            type="button"
            onClick={() => videoInput.current?.click()}
            disabled={uploading !== null}
            className="inline-flex h-10 items-center gap-2 rounded-sm border border-line-strong bg-card px-4 text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink disabled:opacity-60"
          >
            {uploading === "video" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Video className="size-4" aria-hidden />
            )}
            Upload video
          </button>

          <input
            ref={imageInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file, "image");
              event.target.value = "";
            }}
          />
          <input
            ref={videoInput}
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file, "video");
              event.target.value = "";
            }}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-mute">
          Images: JPG, PNG, WebP or AVIF. Video: MP4 or WebM. Files are checked
          by content type and size limits before they are stored.
        </p>
      </div>

      {loadingLibrary ? (
        <p className="flex items-center gap-2 text-sm text-ink-mute">
          <Loader2 className="size-4 animate-spin" aria-hidden />
          Loading media…
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-sm border border-line bg-card px-4 py-6 text-sm text-ink-mute">
          No media yet — upload photos or videos to build the project gallery.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const selected = isSelected(item.id);
            const position = value.mediaIds.indexOf(item.id);
            return (
              <li key={item.id} className="group relative">
                <div
                  className={cn(
                    "relative aspect-4/3 overflow-hidden rounded-sm border transition-colors",
                    selected
                      ? "border-accent ring-1 ring-accent"
                      : "border-line bg-ivory",
                  )}
                >
                  {item.mediaType === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.altText || item.originalFilename || "Media"}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <video
                      src={item.url}
                      muted
                      className="size-full object-cover"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => toggle(item.id)}
                    aria-pressed={selected}
                    className="absolute inset-0 cursor-pointer"
                    aria-label={
                      selected ? "Deselect from gallery" : "Add to gallery"
                    }
                  />
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="min-w-0 truncate text-xs text-ink-mute">
                    {item.mediaType === "video" ? "Video · " : ""}
                    {item.originalFilename ?? "upload"}
                    {item.width && item.height
                      ? ` · ${item.width}×${item.height}`
                      : ""}
                    {formatBytes(item.sizeBytes) ? ` · ${formatBytes(item.sizeBytes)}` : ""}
                  </p>
                  <div className="flex shrink-0 items-center gap-1">
                    {selected ? (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-on-accent">
                        {position + 1}
                      </span>
                    ) : (
                      <span className="text-[0.6rem] uppercase tracking-[0.1em] text-ink-mute">
                        <ImagePlus className="size-3.5" aria-label="Not selected" />
                      </span>
                    )}
                    {selected ? (
                      <>
                        <button
                          type="button"
                          onClick={() => move(item.id, -1)}
                          disabled={position === 0}
                          aria-label="Move earlier"
                          className="rounded-sm p-1 text-ink-mute transition-colors hover:bg-sand/60 hover:text-ink disabled:opacity-30"
                        >
                          <ChevronUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(item.id, 1)}
                          disabled={position === value.mediaIds.length - 1}
                          aria-label="Move later"
                          className="rounded-sm p-1 text-ink-mute transition-colors hover:bg-sand/60 hover:text-ink disabled:opacity-30"
                        >
                          <ChevronDown className="size-3.5" />
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void remove(item)}
                      aria-label={
                        initialItems.some((entry) => entry.id === item.id)
                          ? "Remove from gallery"
                          : "Delete file"
                      }
                      className="rounded-sm p-1 text-ink-mute transition-colors hover:bg-terracotta/10 hover:text-terracotta"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label
            htmlFor="cover-media"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-mute"
          >
            Cover image
          </label>
          <select
            id="cover-media"
            value={value.coverMediaId ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                coverMediaId: event.target.value || null,
              })
            }
            className="h-11 w-full rounded-sm border border-line bg-card px-3 text-sm text-ink focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <option value="">Automatic (first image)</option>
            {selectedImages.map((image, index) => (
              <option key={image.id} value={image.id}>
                {index + 1}. {image.originalFilename ?? `Image ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="before-media"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-mute"
          >
            Before image (optional)
          </label>
          <select
            id="before-media"
            value={value.beforeAfterMediaIds.before ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                beforeAfterMediaIds: {
                  ...value.beforeAfterMediaIds,
                  before: event.target.value || null,
                },
              })
            }
            className="h-11 w-full rounded-sm border border-line bg-card px-3 text-sm text-ink focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <option value="">None</option>
            {selectedImages.map((image, index) => (
              <option key={image.id} value={image.id}>
                {index + 1}. {image.originalFilename ?? `Image ${index + 1}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="after-media"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-mute"
          >
            After image (optional)
          </label>
          <select
            id="after-media"
            value={value.beforeAfterMediaIds.after ?? ""}
            onChange={(event) =>
              onChange({
                ...value,
                beforeAfterMediaIds: {
                  ...value.beforeAfterMediaIds,
                  after: event.target.value || null,
                },
              })
            }
            className="h-11 w-full rounded-sm border border-line bg-card px-3 text-sm text-ink focus-visible:border-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta"
          >
            <option value="">None</option>
            {selectedImages.map((image, index) => (
              <option key={image.id} value={image.id}>
                {index + 1}. {image.originalFilename ?? `Image ${index + 1}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedImages.length < 2 &&
      (value.beforeAfterMediaIds.before || value.beforeAfterMediaIds.after) ? (
        <p className="text-xs text-terracotta">
          Select at least two images for a before/after comparison.
        </p>
      ) : null}
    </div>
  );
}
