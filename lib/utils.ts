import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Build a Pexels delivery URL for a given photo id. Explicit width/height keep
 * the request small and let Next.js re-optimise from a sensibly sized source.
 */
export function pexelsPhoto(
  id: number,
  opts: { width?: number; height?: number } = {},
) {
  const width = opts.width ?? 1600;
  const params = new URLSearchParams({
    auto: "compress",
    cs: "tinysrgb",
    fit: "crop",
    w: String(width),
  });
  if (opts.height) params.set("h", String(opts.height));
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${params.toString()}`;
}

export function formatYear(date = new Date()) {
  return date.getFullYear();
}

/** Build a click-to-chat WhatsApp link from a phone number in any format. */
export function whatsappLink(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function telLink(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
