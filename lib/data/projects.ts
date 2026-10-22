import { pexelsPhoto } from "@/lib/utils";
import type { Project, ProjectCategory } from "@/types";

export const projectCategories: ProjectCategory[] = [
  { slug: "residential", label: "Residential" },
  { slug: "commercial", label: "Commercial" },
  { slug: "bedroom", label: "Bedroom" },
  { slug: "living-room", label: "Living Room" },
  { slug: "kitchen", label: "Kitchen" },
  { slug: "renovation", label: "Renovation" },
];

function img(
  id: number,
  alt: string,
  width = 1600,
  height = 1100,
) {
  return {
    src: pexelsPhoto(id, { width, height }),
    alt,
    width,
    height,
    credit: "Photo via Pexels",
  };
}

/**
 * Portfolio projects.
 * PLACEHOLDER — project names, locations, narratives and outcomes are
 * illustrative demonstration content and must be replaced with real, verified
 * project records (and licensed photography) before launch.
 */
export const projects: Project[] = [
  {
    slug: "meadowbrook-residence",
    title: "Meadowbrook Residence",
    location: "Riverside District",
    propertyType: "Detached family home",
    year: "2024",
    area: "280 m²",
    categories: ["residential", "living-room"],
    cover: img(2440471, "Meadowbrook Residence living room with fireplace and cityscape artwork"),
    gallery: [
      img(2440471, "Living room anchored by a fireplace and layered lighting"),
      img(36363112, "Corner seating styled with warm textiles and a floor lamp"),
      img(7546645, "Bright secondary living space with natural light"),
    ],
    summary:
      "A grounded, light-filled family home where every room was planned around the rhythm of daily life.",
    overview:
      "The family had lived in the house for a decade and knew exactly what worked and what did not. The brief was to open the ground floor to light and reorganise circulation, then furnish it with pieces that could take real life — children, dogs and long dinners.",
    brief:
      "Create a calm, durable home with generous seating for a family of five, a dedicated reading corner and a palette that would age gracefully.",
    concept:
      "The concept borrows from the surrounding landscape: oat, clay and sage, textured wool and linen, and a horizontal emphasis that lets the eye rest. Structure was simplified so the light does the decorating.",
    challenges: [
      {
        challenge: "A dark, compartmentalised ground floor with limited daylight.",
        solution:
          "Re-planned circulation to open sightlines to the garden and placed reflective, pale surfaces where light lands.",
      },
      {
        challenge: "Furniture had to withstand a busy family.",
        solution:
          "Selected performance fabrics and hard-wearing natural materials, with washable covers on the main seating.",
      },
    ],
    materials: [
      "Oiled oak flooring",
      "Lime-washed walls",
      "Bouclé and wool upholstery",
      "Brushed brass hardware",
    ],
    palette: [
      { name: "Oat", hex: "#E4DBCB" },
      { name: "Clay", hex: "#B77F63" },
      { name: "Sage", hex: "#8A9179" },
      { name: "Charcoal", hex: "#2E2C29" },
    ],
    outcomes: [
      "Open-plan living, kitchen and dining now share continuous daylight.",
      "A dedicated reading corner gives the plan a quiet counterpoint.",
      "Durable finishes chosen to patina rather than wear out.",
    ],
    featured: true,
  },
  {
    slug: "atelier-noir-loft",
    title: "Atelier Noir Loft",
    location: "Old Quarter",
    propertyType: "Converted warehouse loft",
    year: "2023",
    area: "165 m²",
    categories: ["residential", "living-room", "renovation"],
    cover: img(1510173, "Converted loft living space with industrial proportions and soft furnishings"),
    gallery: [
      img(1510173, "Double-height living space with original structural details"),
      img(210265, "Bedroom nook set within the open loft volume"),
      img(7045841, "Dining area beneath the original ceiling structure"),
    ],
    summary:
      "A raw warehouse shell softened into a liveable loft without erasing its industrial character.",
    overview:
      "The loft arrived with exposed brick, steel and extraordinary volume — but little comfort. The task was to add warmth, zoning and acoustic softness while keeping the rawness that made the space special.",
    brief:
      "Introduce distinct living, sleeping and working zones within one open volume, and tame the acoustics, without hiding the building's history.",
    concept:
      "A restrained, almost gallery-like approach: a near-monochrome base of lime plaster and steel, punctuated with deep terracotta and warm timber so the eye reads zones rather than one undifferentiated hall.",
    challenges: [
      {
        challenge: "A single open volume with no privacy.",
        solution:
          "Introduced a lowered, translucent sleeping pod and a full-height timber joinery wall to divide with light rather than block it.",
      },
      {
        challenge: "Harsh acoustics from hard surfaces.",
        solution:
          "Layered deep-pile rugs, heavy curtains and soft upholstery to absorb sound.",
      },
    ],
    materials: [
      "Lime plaster",
      "Blackened steel",
      "Smoked oak joinery",
      "Wool rugs and heavy linen drapes",
    ],
    palette: [
      { name: "Plaster", hex: "#EAE4DA" },
      { name: "Terracotta", hex: "#A65B3C" },
      { name: "Smoked Oak", hex: "#6B533F" },
      { name: "Ink", hex: "#232323" },
    ],
    outcomes: [
      "Clear zoning while preserving the double-height volume.",
      "Measurably calmer acoustics in the main living zone.",
      "Original brick and steel retained as the focal material story.",
    ],
    featured: true,
  },
  {
    slug: "the-linen-suite",
    title: "The Linen Suite",
    location: "Hillcrest",
    propertyType: "Principal bedroom suite",
    year: "2024",
    categories: ["bedroom", "residential"],
    cover: img(6207451, "Serene principal bedroom with layered neutral bedding"),
    gallery: [
      img(6207451, "Bed dressed in layered neutral linens"),
      img(11062931, "Minimal bedroom detailing with timber and concrete"),
      img(6583346, "Curated textile and colour swatches for the suite"),
    ],
    summary:
      "A restful principal suite built around texture, softness and a deliberately narrow palette.",
    overview:
      "The clients wanted their bedroom to function as a retreat from a busy household. The design strips the room back to essentials, then layers textiles and lighting so it feels enveloping without clutter.",
    brief:
      "Create a calm, hotel-quality retreat with generous storage and lighting that supports winding down.",
    concept:
      "A tonal study in warm neutrals — linen, oat and soft grey — where interest comes from texture and shadow rather than pattern or colour blocking.",
    challenges: [
      {
        challenge: "Clutter and insufficient storage made the room feel busy.",
        solution:
          "Added full-height mirrored joinery to conceal storage and bounce light around the room.",
      },
      {
        challenge: "Harsh ceiling lighting.",
        solution:
          "Replaced overhead glare with layered bedside, wall-wash and floor lighting on dimmers.",
      },
    ],
    materials: [
      "Washed linen bedding",
      "Bouclé headboard",
      "Wool carpet",
      "Antiqued brass lighting",
    ],
    palette: [
      { name: "Linen", hex: "#E7DFD2" },
      { name: "Greige", hex: "#B9B1A4" },
      { name: "Soft Grey", hex: "#8B8880" },
      { name: "Walnut", hex: "#5C4634" },
    ],
    outcomes: [
      "A clutter-free room with concealed, full-height storage.",
      "Layered, dimmable lighting for a genuine wind-down.",
      "A durable, tonal palette that is easy to refresh seasonally.",
    ],
    featured: true,
  },
  {
    slug: "calacatta-culinary-suite",
    title: "Calacatta Culinary Suite",
    location: "Northgate",
    propertyType: "Kitchen renovation",
    year: "2023",
    categories: ["kitchen", "renovation", "residential"],
    cover: img(12202394, "Contemporary kitchen with marble surfaces and integrated appliances"),
    gallery: [
      img(12202394, "Marble-topped island with bar seating"),
      img(7601278, "Integrated appliances within a streamlined run of cabinetry"),
      img(4030908, "Minimalist kitchen detailing with warm timber accents"),
    ],
    summary:
      "A hard-working family kitchen with the quiet confidence of a stone-and-timber material palette.",
    overview:
      "The original kitchen was cramped and closed off. We opened it to the dining area, rationalised the working triangle and used a restrained material palette so the space feels calm even at breakfast time.",
    brief:
      "A sociable kitchen with abundant storage, a large island for gathering, and surfaces that could handle real cooking.",
    concept:
      "Honest materials doing the talking: honed stone, warm timber and a matte, handleless cabinetry run that keeps the focus on the island and the light.",
    challenges: [
      {
        challenge: "Limited worktop space in a narrow galley.",
        solution:
          "Introduced a large island that doubles as prep space, dining and gathering point.",
      },
      {
        challenge: "Poor task lighting over work zones.",
        solution:
          "Specified integrated under-cabinet and pendant lighting on separate circuits.",
      },
    ],
    materials: [
      "Honed marble",
      "Matte lacquer cabinetry",
      "Oiled oak accents",
      "Brushed nickel hardware",
    ],
    palette: [
      { name: "Calacatta", hex: "#F1EDE6" },
      { name: "Warm Timber", hex: "#9C7549" },
      { name: "Graphite", hex: "#3A3A38" },
      { name: "Brushed Nickel", hex: "#B9BCC0" },
    ],
    outcomes: [
      "An open kitchen that connects to dining and garden views.",
      "A defined working triangle for efficient cooking.",
      "Storage scaled to a busy family of five.",
    ],
    // PLACEHOLDER comparison imagery — replace with the client's own
    // before-and-after photography of the same project before launch.
    beforeAfter: {
      before: img(4030908, "The kitchen before renovation — placeholder comparison image"),
      after: img(12202394, "The completed kitchen — placeholder comparison image"),
    },
    featured: true,
  },
  {
    slug: "harborview-executive-floor",
    title: "Harborview Executive Floor",
    location: "Financial District",
    propertyType: "Corporate office",
    year: "2024",
    area: "640 m²",
    categories: ["commercial"],
    cover: img(7534224, "Contemporary executive office with soft lounge seating"),
    gallery: [
      img(7534224, "Reception and lounge zone with soft blue seating"),
      img(18033178, "Open-plan workspace with considered circulation"),
      img(33827318, "Collaborative work area with natural light"),
    ],
    summary:
      "A calm, brand-led executive floor that balances focus work with generous collaboration space.",
    overview:
      "A financial services firm wanted a floor that felt more like a thoughtful hospitality space than a traditional office, while still supporting focused work and confidentiality. The design zones the floor by activity and uses acoustics and material to signal each area.",
    brief:
      "Improve collaboration and client-facing hospitality without sacrificing focus zones or acoustic privacy, and express the firm's brand subtly.",
    concept:
      "A quiet, confident palette of warm greys and deep blue, with natural timber and soft seating to soften a glass-and-concrete base build.",
    challenges: [
      {
        challenge: "An open floor plate that risked feeling corporate and cold.",
        solution:
          "Layered soft seating, planting and warm materials to create distinct, human-scaled pockets.",
      },
      {
        challenge: "Acoustic privacy for client conversations.",
        solution:
          "Specified acoustic partitions, fabric panels and enclosed meeting rooms along the core.",
      },
    ],
    materials: [
      "Acoustic fabric panels",
      "Smoked oak veneer",
      "Wool blend upholstery",
      "Polished concrete flooring",
    ],
    palette: [
      { name: "Harbour Blue", hex: "#2F4257" },
      { name: "Warm Grey", hex: "#B7B2A9" },
      { name: "Oak", hex: "#8A6A48" },
      { name: "Slate", hex: "#4A4E54" },
    ],
    outcomes: [
      "Clear zoning between focus, collaboration and hospitality.",
      "Improved acoustic comfort across the open floor.",
      "A brand expression carried through material and light rather than logos.",
    ],
    featured: false,
  },
  {
    slug: "nordic-light-apartment",
    title: "Nordic Light Apartment",
    location: "West End",
    propertyType: "City apartment",
    year: "2023",
    area: "96 m²",
    categories: ["residential", "bedroom", "living-room"],
    cover: img(13041939, "Scandinavian-inspired apartment bedroom in soft grey tones"),
    gallery: [
      img(13041939, "Bedroom in muted Scandinavian tones"),
      img(38800602, "Minimal bedroom with pendant lighting and warm timber"),
      img(31737843, "Layered luxury bedroom detailing"),
    ],
    summary:
      "A compact apartment made to feel larger through light, reflection and a disciplined palette.",
    overview:
      "A small city apartment with good bones but tight proportions. The design maximises a sense of space with light-reflective finishes, integrated storage and furniture scaled precisely to the rooms.",
    brief:
      "Make a modest apartment feel spacious and calm, with clever storage and furniture that punches above its footprint.",
    concept:
      "A bright Nordic base of pale ash, off-white and considered grey, warmed by a single earthy accent and generous textiles.",
    challenges: [
      {
        challenge: "Low ceilings and small rooms.",
        solution:
          "Chose low-profile, leggy furniture and pale floors to open up the volume visually.",
      },
      {
        challenge: "Nowhere to store belongings.",
        solution:
          "Built discrete full-height joinery into every available recess.",
      },
    ],
    materials: [
      "Pale ash veneer",
      "Off-white paint",
      "Wool and linen textiles",
      "Matte white ceramics",
    ],
    palette: [
      { name: "Chalk", hex: "#EFECE6" },
      { name: "Ash", hex: "#C9C2B5" },
      { name: "Fog", hex: "#9A9992" },
      { name: "Earthy Clay", hex: "#A8795E" },
    ],
    outcomes: [
      "The apartment reads noticeably larger through light and reflection.",
      "Concealed storage frees the visible surfaces.",
      "A calm palette that suits compact living.",
    ],
    featured: false,
  },
  {
    slug: "terracotta-dining-pavilion",
    title: "Terracotta Dining Pavilion",
    location: "Lakeside",
    propertyType: "Dining extension",
    year: "2024",
    categories: ["renovation", "living-room", "residential"],
    cover: img(4469144, "Bright dining pavilion with a round table and layered light"),
    gallery: [
      img(4469144, "Round dining table beneath garden-facing glazing"),
      img(17947888, "Contemporary dining setting with sculptural furniture"),
      img(26886881, "Statement lighting over an elegant dining table"),
    ],
    summary:
      "A glazed dining extension that turns a family's evening meal into an event with the garden as its backdrop.",
    overview:
      "The family wanted a dedicated dining space connected to the garden. A modest rear extension was given a warm terracotta identity inside, so the new room feels distinct yet continuous with the existing home.",
    brief:
      "Create a warm, light-filled dining room that seats ten and opens directly onto the garden.",
    concept:
      "A single earthy terracotta gesture — floor, joinery and plaster — set against full-height glazing and a sculptural dining table that celebrates the act of gathering.",
    challenges: [
      {
        challenge: "The new glazed volume risked feeling cold and exposed.",
        solution:
          "Used warm terracotta plaster and timber to temper the glass and add thermal mass.",
      },
      {
        challenge: "Seating ten without a cavernous room.",
        solution:
          "A round table and low profile benches keep the plan intimate at any number.",
      },
    ],
    materials: [
      "Terracotta micro-cement",
      "Oiled oak",
      "Lime plaster",
      "Woven pendant lighting",
    ],
    palette: [
      { name: "Terracotta", hex: "#B4654A" },
      { name: "Oak", hex: "#9A774B" },
      { name: "Chalk", hex: "#F0E9DE" },
      { name: "Olive", hex: "#6E7256" },
    ],
    outcomes: [
      "A dedicated dining room with a direct garden connection.",
      "Seating for ten in a space that still feels intimate.",
      "A distinctive identity that ties old and new together.",
    ],
    featured: true,
  },
  {
    slug: "the-studio-headquarters",
    title: "The Studio Headquarters",
    location: "Design Quarter",
    propertyType: "Creative studio & office",
    year: "2023",
    area: "410 m²",
    categories: ["commercial", "renovation"],
    cover: img(33393712, "Bright creative studio workspace with planting and natural light"),
    gallery: [
      img(33393712, "Sunlit open studio with modular workstations"),
      img(37550263, "Minimalist meeting room with ergonomic seating"),
      img(4930018, "Focused desk area with warm materials"),
    ],
    summary:
      "A creative agency's headquarters designed to feel like a workshop: open, flexible and full of natural light.",
    overview:
      "A growing creative agency needed a headquarters that could flex with project teams and host clients without turning into a generic open plan. The design provides adaptable zones and a materials library at its heart.",
    brief:
      "Support changing team sizes, provide inspiring client-facing space and express a craft-led brand.",
    concept:
      "An honest, workshop-like language — exposed services softened with timber, planting and a warm neutral palette that keeps attention on the work.",
    challenges: [
      {
        challenge: "Team sizes fluctuate week to week.",
        solution:
          "Modular, reconfigurable workstations and bookable focus rooms.",
      },
      {
        challenge: "The fit-out had to be delivered quickly.",
        solution:
          "Prioritised fast, durable materials and standardised joinery modules.",
      },
    ],
    materials: [
      "Exposed ceilings",
      "Birch ply joinery",
      "Recycled rubber flooring",
      "Acoustic felt panels",
    ],
    palette: [
      { name: "Birch", hex: "#E3D6BE" },
      { name: "Warm White", hex: "#F2EEE7" },
      { name: "Moss", hex: "#6C7358" },
      { name: "Graphite", hex: "#3C3E3D" },
    ],
    outcomes: [
      "Flexible desk capacity that adapts to project teams.",
      "A central materials library that doubles as a client meeting point.",
      "A durable fit-out delivered on a compressed programme.",
    ],
    featured: false,
  },
  {
    slug: "ivory-onyx-kitchen",
    title: "Ivory Onyx Kitchen",
    location: "Palm Grove",
    propertyType: "Kitchen renovation",
    year: "2024",
    categories: ["kitchen", "renovation", "residential"],
    cover: img(11209666, "Sleek kitchen with warm timber cabinetry and integrated lighting"),
    gallery: [
      img(11209666, "Streamlined run of timber cabinetry"),
      img(7601278, "Integrated appliances within the cabinetry line"),
      img(35283768, "Warm ambient lighting over a dining counter"),
    ],
    summary:
      "A serene, handleless kitchen where warm timber and stone are used with restraint and precision.",
    overview:
      "A keen cook wanted a kitchen that felt composed rather than clinical. The design pushes storage into handleless cabinetry and lets a single warm timber and a single stone carry the whole palette.",
    brief:
      "A calm, practical kitchen for serious cooking, with concealed storage and effortless surfaces.",
    concept:
      "Two materials, used well: warm timber and a light stone, organised on a single horizontal datum so the room reads quiet and ordered.",
    challenges: [
      {
        challenge: "A busy cook needed lots of storage without visual noise.",
        solution:
          "Full-height handleless cabinetry with internal drawers and concealed appliance garages.",
      },
      {
        challenge: "The room faced away from the garden light.",
        solution:
          "Borrowed light through a glazed splashback and layered artificial wash lighting.",
      },
    ],
    materials: [
      "Light stone worktops",
      "Warm oak cabinetry",
      "Matte white splashback",
      "Integrated task lighting",
    ],
    palette: [
      { name: "Ivory", hex: "#F1ECE2" },
      { name: "Onyx", hex: "#2C2A28" },
      { name: "Warm Oak", hex: "#A5763F" },
      { name: "Stone Grey", hex: "#C6C1B8" },
    ],
    outcomes: [
      "A clutter-free kitchen with generous concealed storage.",
      "A two-material palette that feels calm and long-lasting.",
      "Task and ambient lighting tuned to cooking and dining.",
    ],
    featured: false,
  },
  {
    slug: "warm-minimal-bedroom",
    title: "Warm Minimal Bedroom",
    location: "Elm Court",
    propertyType: "Guest bedroom",
    year: "2022",
    categories: ["bedroom", "residential"],
    cover: img(29150446, "Warm minimalist bedroom with soft lighting and elegant linens"),
    gallery: [
      img(29150446, "Warm minimal bedroom with layered soft lighting"),
      img(210265, "Modern bedroom with calm, neutral detailing"),
      img(11062931, "Minimal bedroom in timber and concrete tones"),
    ],
    summary:
      "A guest room designed to feel like a boutique hotel stay — warm, quiet and effortlessly comfortable.",
    overview:
      "A spare room needed to work hard as both a welcoming guest space and a quiet retreat. The design uses warm minimalism: few elements, each chosen for comfort and texture.",
    brief:
      "A warm, welcoming guest room that feels considered and hotel-like without feeling impersonal.",
    concept:
      "Warm minimalism — a narrow palette, generous textiles and soft, layered light — where comfort comes from proportion and touch rather than ornament.",
    challenges: [
      {
        challenge: "A small, awkwardly shaped room.",
        solution:
          "Centred the bed on the longest wall and used wall-mounted lighting to free the side tables.",
      },
      {
        challenge: "Needed to suit different guests.",
        solution:
          "Used a neutral base with easy-to-change textiles and accessories.",
      },
    ],
    materials: [
      "Warm plaster walls",
      "Linen bedding",
      "Sheer and blackout window layers",
      "Wall-mounted reading lights",
    ],
    palette: [
      { name: "Warm White", hex: "#EFE9DF" },
      { name: "Sand", hex: "#CDBBA2" },
      { name: "Taupe", hex: "#8E8579" },
      { name: "Bronze", hex: "#7A5C3E" },
    ],
    outcomes: [
      "A small room that feels calm and proportionate.",
      "Layered lighting for reading and relaxation.",
      "A textile-led palette that is easy to refresh.",
    ],
    featured: false,
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects() {
  return projects.filter((project) => project.featured);
}

export function getRelatedProjects(slug: string, limit = 3) {
  const current = getProjectBySlug(slug);
  if (!current) return [];
  const sameCategory = projects.filter(
    (project) =>
      project.slug !== slug &&
      project.categories.some((category) =>
        current.categories.includes(category),
      ),
  );
  const rest = projects.filter(
    (project) => project.slug !== slug && !sameCategory.includes(project),
  );
  return [...sameCategory, ...rest].slice(0, limit);
}

export function getCategoryLabel(slug: string) {
  const known = projectCategories.find((category) => category.slug === slug);
  if (known) return known.label;
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
