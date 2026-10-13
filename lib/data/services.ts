import {
  Armchair,
  Building2,
  Hammer,
  Home,
  Lightbulb,
  Paintbrush,
  Palette,
  Ruler,
} from "lucide-react";
import { pexelsPhoto } from "@/lib/utils";
import type { Service } from "@/types";

export const services: Service[] = [
  {
    slug: "residential-interior-design",
    title: "Residential Interior Design",
    tagline: "Homes that work as beautifully as they look",
    icon: Home,
    description:
      "Full-service interior design for houses and apartments — from first concept to the final styled room.",
    longDescription:
      "Whether you are moving into a new home or reworking the one you have, I lead the entire design journey: understanding how you live, developing the concept, specifying every finish and furnishing, and coordinating delivery and installation. You receive a considered, complete home rather than a collection of purchases.",
    image: {
      src: pexelsPhoto(2440471, { width: 1600, height: 1100 }),
      alt: "Contemporary residential living room with warm neutral furnishings",
      width: 1600,
      height: 1100,
    },
    deliverables: [
      "Discovery consultation & lifestyle brief",
      "Concept narrative, mood boards & colour direction",
      "Full furniture, finish & lighting specification",
      "Sourcing, procurement and budget tracking",
      "Delivery, installation and final styling",
    ],
    idealFor:
      "Homeowners and renters planning a full or part-furnished redesign of a primary residence.",
    process: [
      { title: "Discovery", detail: "We define how you live, your priorities and your budget." },
      { title: "Concept", detail: "Mood boards, layouts and a material palette for your sign-off." },
      { title: "Delivery", detail: "Sourcing, installation and styling down to the final cushion." },
    ],
    timeline: "Typically 8–20 weeks, depending on scope and lead times.",
    featured: true,
  },
  {
    slug: "commercial-interior-design",
    title: "Commercial Interior Design",
    tagline: "Workplaces, hospitality and retail with a point of view",
    icon: Building2,
    description:
      "Purposeful commercial interiors — offices, studios, cafés and retail — that support the people who use them every day.",
    longDescription:
      "Commercial interiors carry a brand and a function at the same time. I design spaces that improve how teams work and how customers feel, balancing durability and code requirements with a distinctive, welcoming aesthetic that reflects your identity.",
    image: {
      src: pexelsPhoto(7534224, { width: 1600, height: 1100 }),
      alt: "Modern commercial office interior with contemporary lounge seating",
      width: 1600,
      height: 1100,
    },
    deliverables: [
      "Brand & operational discovery workshop",
      "Zoning, circulation & occupancy planning",
      "Commercial-grade finish & FF&E specification",
      "Compliance-conscious layouts",
      "Contractor & supplier coordination",
    ],
    idealFor:
      "Business owners, operators and facilities teams commissioning a new or refreshed commercial space.",
    process: [
      { title: "Brief", detail: "We align design goals with operations and brand." },
      { title: "Plan", detail: "Zoning, layouts and a durable material strategy." },
      { title: "Build", detail: "Coordination through to a working, finished space." },
    ],
    timeline: "Typically 10–24 weeks, subject to permitting and build works.",
    featured: true,
  },
  {
    slug: "space-planning",
    title: "Space Planning & Layout",
    tagline: "Getting the bones of a space right",
    icon: Ruler,
    description:
      "Measured drawings and layout studies that make the best use of every square metre before anything is bought.",
    longDescription:
      "Great rooms rarely happen by accident. I survey the space, test multiple layouts and resolve the relationships between furniture, circulation and light. The result is a plan that feels generous and effortless — and avoids expensive mistakes later.",
    image: {
      src: pexelsPhoto(18033178, { width: 1600, height: 1100 }),
      alt: "Open-plan interior showing considered circulation and zoning",
      width: 1600,
      height: 1100,
    },
    deliverables: [
      "Site survey & accurate measured drawings",
      "Two to three layout options with rationale",
      "Furniture scale & circulation studies",
      "Electrical and lighting point recommendations",
    ],
    idealFor:
      "Anyone working with an awkward footprint, an open plan, or furniture that never quite fits.",
    process: [
      { title: "Survey", detail: "Detailed measurement and photo record of the space." },
      { title: "Options", detail: "Alternative layouts tested against how you use the room." },
      { title: "Resolution", detail: "A single recommended plan, fully dimensioned." },
    ],
    timeline: "Typically 1–3 weeks as a standalone service.",
    featured: true,
  },
  {
    slug: "furniture-selection-styling",
    title: "Furniture Selection & Styling",
    tagline: "Pieces chosen with intent, not by algorithm",
    icon: Armchair,
    description:
      "Curated furniture, lighting and accessories sourced to fit your space, budget and the way you live.",
    longDescription:
      "I build a furniture schedule around your priorities — comfort, durability, budget and aesthetics — mixing investment pieces with well-chosen high-street and artisan finds. Sourcing, lead times and delivery are managed for you, and I style the finished room so it feels complete from day one.",
    image: {
      src: pexelsPhoto(36363112, { width: 1600, height: 1100 }),
      alt: "Warm living room with styled sofa, cushions and floor lamp",
      width: 1600,
      height: 1100,
    },
    deliverables: [
      "Furniture & lighting schedule with pricing",
      "Sourcing from trade and retail ranges",
      "Optional accessories and art curation",
      "Order management and installation day styling",
    ],
    idealFor:
      "Clients who have the layout sorted and want expert selection, sourcing and finishing.",
    process: [
      { title: "Priorities", detail: "Budget bands, must-haves and comfort requirements." },
      { title: "Proposal", detail: "A layered schedule to review and refine." },
      { title: "Style", detail: "Delivery, placement and the finishing touches." },
    ],
    timeline: "Typically 2–8 weeks, depending on lead times.",
    featured: false,
  },
  {
    slug: "interior-decoration-finishing",
    title: "Interior Decoration & Finishing",
    tagline: "The details that make a room feel finished",
    icon: Paintbrush,
    description:
      "Wall treatments, window dressings, soft furnishings and decor — layered to bring warmth and polish.",
    longDescription:
      "Decoration is where a space gains its atmosphere. I specify paints, papers, window treatments, rugs, textiles and accessories as a single coordinated scheme, so every surface and soft element works together rather than competing for attention.",
    image: {
      src: pexelsPhoto(6207451, { width: 1600, height: 1100 }),
      alt: "Bedroom styled with coordinated bedding, lamps and soft furnishings",
      width: 1600,
      height: 1100,
    },
    deliverables: [
      "Paint, wallpaper & wall-finish scheme",
      "Window treatment specification",
      "Soft furnishings, rugs & textiles",
      "Accessory and decor curation",
    ],
    idealFor:
      "Rooms with good furniture that need warmth, texture and a sense of completion.",
    process: [
      { title: "Palette", detail: "A coordinated scheme across surfaces and textiles." },
      { title: "Specify", detail: "Exact products, finishes and quantities." },
      { title: "Install", detail: "Ordering coordination and styling." },
    ],
    timeline: "Typically 2–6 weeks depending on made-to-measure items.",
    featured: false,
  },
  {
    slug: "renovation-remodeling-consultation",
    title: "Renovation & Remodelling Consultation",
    tagline: "Design guidance before the walls come down",
    icon: Hammer,
    description:
      "Design input and coordination for renovations and remodels, so structural and finish decisions are made with confidence.",
    longDescription:
      "Renovations are where design decisions have the highest stakes. I work alongside your builder or architect to shape layouts, specify finishes, resolve detailing and keep the design intent intact through the build — helping you avoid costly revisions.",
    image: {
      src: pexelsPhoto(11209666, { width: 1600, height: 1100 }),
      alt: "Renovated kitchen with bespoke cabinetry and stone surfaces",
      width: 1600,
      height: 1100,
    },
    deliverables: [
      "Feasibility & layout review",
      "Finish and fixture specification",
      "Detailing & joinery direction",
      "On-site design coordination during the build",
    ],
    idealFor:
      "Homeowners undertaking a renovation, extension or significant remodel.",
    process: [
      { title: "Review", detail: "Assess plans, constraints and priorities." },
      { title: "Specify", detail: "Materials, fixtures and detail resolution." },
      { title: "Support", detail: "Coordination and problem-solving through the build." },
    ],
    timeline: "Scoped to the renovation programme.",
    featured: true,
  },
  {
    slug: "color-consultation",
    title: "Colour Consultation",
    tagline: "A palette that flatters light and architecture",
    icon: Palette,
    description:
      "Focused colour direction for a single room or an entire home, tested in your actual light.",
    longDescription:
      "Colour behaves differently on every wall and in every light. I develop palettes in person, testing samples against your space, furnishings and natural light so the result is harmonious and confident rather than risky.",
    image: {
      src: pexelsPhoto(6583346, { width: 1600, height: 1100 }),
      alt: "Flat lay of colour swatches and material samples on a design desk",
      width: 1600,
      height: 1100,
    },
    deliverables: [
      "In-situ colour testing",
      "Coordinated room or whole-home palette",
      "Paint, trim and accent specifications",
      "Guidance on undertones and lighting interaction",
    ],
    idealFor:
      "Clients who want confident colour choices without a full design commission.",
    process: [
      { title: "Assess", detail: "Review light, architecture and existing pieces." },
      { title: "Test", detail: "Sample paints in situ at different times of day." },
      { title: "Confirm", detail: "A final palette with product references." },
    ],
    timeline: "Typically 1–2 weeks.",
    featured: false,
  },
  {
    slug: "custom-interior-concepts",
    title: "Custom Interior Concepts",
    tagline: "Bespoke direction for unusual projects",
    icon: Lightbulb,
    description:
      "Concept-led design for projects that fall outside the standard brief — or need a distinctive creative vision.",
    longDescription:
      "Some projects call for a concept first and logistics second. I develop a distinctive creative direction — narrative, palette, form and material — to guide the whole project, whether it is a single statement room or an unconventional space with no obvious template.",
    image: {
      src: pexelsPhoto(29150446, { width: 1600, height: 1100 }),
      alt: "Bespoke bedroom concept with layered lighting and custom joinery",
      width: 1600,
      height: 1100,
    },
    deliverables: [
      "Creative concept & design narrative",
      "Mood boards and material exploration",
      "Bespoke joinery or feature direction",
      "Concept documentation for your team",
    ],
    idealFor:
      "Clients with a distinctive vision, unusual space or a project needing a fresh creative lead.",
    process: [
      { title: "Explore", detail: "Reference, form and material research." },
      { title: "Concept", detail: "A bold direction expressed in mood boards." },
      { title: "Document", detail: "Clear guidance your team can build from." },
    ],
    timeline: "Typically 2–5 weeks.",
    featured: false,
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
