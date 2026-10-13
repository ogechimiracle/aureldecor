import { pexelsPhoto } from "@/lib/utils";
import type { DesignerProfile } from "@/types";

/**
 * Designer / studio profile.
 * PLACEHOLDER — the name, biography and imagery must be replaced with the real
 * designer's details before launch. Photography below is licensed stock used as
 * a visual stand-in.
 */
export const profile: DesignerProfile = {
  name: "Elena Márquez",
  title: "Founder & Principal Designer",
  tagline: "Spaces composed with intention, warmth and quiet confidence.",
  shortBio:
    "I design homes and workplaces that feel effortless to live in — spaces where light, proportion and material tell the story of the people who inhabit them.",
  biography: [
    "For over fifteen years I have worked alongside homeowners, architects and business owners to shape interiors that balance beauty with the small, daily rituals of living. My practice began in residential architecture before moving into full-service interior design, and that foundation still guides how I read a room — structure first, then feeling.",
    "Every project starts with listening. I want to understand how you actually use a space: where the morning light lands, where you gather, what you want to leave behind. From there I build a considered narrative of materials, furniture and light that feels inevitable rather than decorated.",
    "I keep the studio deliberately small so that each commission receives my direct attention from the first sketch to the final styling day. The result is interiors that are calm, generous and unmistakably your own.",
  ],
  philosophy:
    "Good design is quiet. It should serve the people living in it long before it impresses anyone else. I look for the honest, timeless solution beneath the trend — natural materials, considered proportion and a palette that will still feel right a decade from now.",
  mission:
    "To create interiors that improve the quality of everyday life — functional, enduring and deeply personal, delivered with care and transparency.",
  vision:
    "A studio known for interiors that outlive trends: spaces that feel as thoughtful on the tenth anniversary as they did on the day they were completed.",
  portrait: {
    src: pexelsPhoto(38139753, { width: 1200, height: 1500 }),
    alt: "Interior designer reviewing material and colour samples at a studio desk",
    width: 1200,
    height: 1500,
    credit: "Photo via Pexels",
  },
  studioImage: {
    src: pexelsPhoto(6580562, { width: 1400, height: 1000 }),
    alt: "Two designers reviewing fabric swatches together in a bright studio",
    width: 1400,
    height: 1000,
    credit: "Photo via Pexels",
  },
  expertise: [
    "Residential interiors",
    "Space planning",
    "Material & finish curation",
    "Furniture sourcing",
    "Colour direction",
    "Renovation coordination",
    "Lighting design",
    "Styling & handover",
  ],
  values: [
    {
      title: "Listen first",
      description:
        "Every design decision begins with how you live, work and gather — not with a signature style.",
    },
    {
      title: "Material honesty",
      description:
        "Natural, tactile finishes chosen for how they age, not just how they photograph.",
    },
    {
      title: "Enduring over trendy",
      description:
        "Proportion, light and restraint over seasonal palettes that date a space quickly.",
    },
    {
      title: "Radical clarity",
      description:
        "Transparent budgets, clear timelines and honest advice at every stage of the project.",
    },
  ],
  // PLACEHOLDER statistics — replace with verified studio figures before launch.
  stats: [
    { value: "15+", label: "Years in practice" },
    { value: "120+", label: "Spaces completed" },
    { value: "8", label: "Service disciplines" },
    { value: "End-to-end", label: "Full-service delivery" },
  ],
  yearsExperience: 15,
  location: "Studio based, working internationally",
};
