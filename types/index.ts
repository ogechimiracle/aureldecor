import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "pinterest" | "linkedin";
}

export interface DesignerProfile {
  name: string;
  title: string;
  tagline: string;
  shortBio: string;
  biography: string[];
  philosophy: string;
  mission: string;
  vision: string;
  portrait: ImageAsset;
  studioImage: ImageAsset;
  expertise: string[];
  values: DesignValue[];
  stats: Stat[];
  yearsExperience: number;
  location: string;
}

export interface DesignValue {
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Attribution / credit line for the placeholder photography. */
  credit?: string;
}

export interface Service {
  slug: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  description: string;
  longDescription: string;
  image: ImageAsset;
  deliverables: string[];
  idealFor: string;
  process: ServiceProcessStep[];
  timeline: string;
  featured: boolean;
}

export interface ServiceProcessStep {
  title: string;
  detail: string;
}

/**
 * Category slugs are stored in SQLite and may be created by the owner, so the
 * slug type is an open string (the original built-in slugs remain valid).
 */
export type ProjectCategorySlug = string;

export interface ProjectCategory {
  slug: ProjectCategorySlug;
  label: string;
}

export type ProjectGalleryImage = ImageAsset;

export interface BeforeAfterSet {
  before: ImageAsset;
  after: ImageAsset;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface ChallengeSolution {
  challenge: string;
  solution: string;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  propertyType: string;
  year: string;
  area?: string;
  categories: ProjectCategorySlug[];
  cover: ImageAsset;
  gallery: ProjectGalleryImage[];
  summary: string;
  overview: string;
  brief: string;
  concept: string;
  challenges: ChallengeSolution[];
  materials: string[];
  palette: ColorSwatch[];
  outcomes: string[];
  beforeAfter?: BeforeAfterSet;
  featured: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  project: string;
  /** Placeholder content must be replaced with verified client feedback before launch. */
  isPlaceholder: boolean;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

/** Resolved video presentation for a project detail page. */
export type ProjectVideo =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | { kind: "direct"; url: string }
  | { kind: "file"; src: string; poster: string | null }
  | null;

/**
 * A project as served to the public site: the static Project shape plus the
 * fields that only exist once content lives in SQLite.
 */
export interface PublicProject extends Project {
  id: string;
  status: "draft" | "published";
  mediaType: "image" | "video" | "mixed";
  video?: ProjectVideo;
  publishedAt?: Date | null;
  updatedAt?: Date;
}

export interface ContactChannel {
  label: string;
  value: string;
  href: string;
}

export interface SiteConfig {
  brandName: string;
  wordmark: string;
  tagline: string;
  description: string;
  url: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  serviceArea: string;
  social: SocialLink[];
  nav: NavLink[];
  footerNav: NavLink[];
  legalNav: NavLink[];
}
