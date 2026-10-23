# Aurelia Interiors — Interior Designer Portfolio

A production-ready, fully responsive portfolio website for an interior
design/redecoration studio, built with **Next.js (App Router)**, **TypeScript**,
**Tailwind CSS**, **shadcn/ui-style primitives**, **Motion** and a real,
validated, email-delivering contact form.

> **Demo content notice:** Brand details, portfolio projects, testimonials and
> photography are clearly-marked placeholders. Replace them with real business
> information before launch (see “Update content” below).

---

## Features

- Editorial, minimalist, luxury interior-design aesthetic (warm ivory palette,
  serif/sans typography, asymmetric editorial grids)
- **Home** — hero, studio story, services, featured projects, philosophy,
  process, testimonials, CTA
- **About** — biography, philosophy, mission/vision, expertise, values
- **Services** — 8 disciplines with detail pages (`/services/[slug]`), including
  deliverables, process, timeline and “Request a Quote” CTAs
- **Portfolio** — 10 projects, category filtering via URL search params,
  accessible animated grid with empty state
- **Project detail** — cover, brief, concept, challenges/solutions, materials,
  colour palette, outcomes, before/after (opt-in), accessible lightbox and
  related projects (`/portfolio/[slug]`)
- **Contact** — React Hook Form + Zod (client **and** server validation),
  loading/success/error states, honeypot spam protection, rate limiting and
  real email delivery via **Resend**
- **SEO** — per-page metadata, canonical URLs, Open Graph/Twitter cards,
  sitemap, robots.txt, JSON-LD structured data (`ProfessionalService`),
  semantic markup, optimised fonts and images
- **Database** — local SQLite for development and Turso/libSQL for Vercel
- **Accessibility** — skip link, keyboard-navigable menus/dialogs, focus
  indicators, ARIA throughout, reduced-motion support
- Next.js image optimisation (remote host configured), AVIF/WebP formats
- Custom 404, error and loading states

## Technology stack

| Area        | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Server Components first)    |
| Language    | TypeScript (strict)                                 |
| Styling     | Tailwind CSS v4                                     |
| Primitives  | shadcn/ui-style, built on Radix UI + CVA            |
| Icons       | lucide-react                                        |
| Animation   | Motion (motion/react)                               |
| Forms       | React Hook Form + Zod + @hookform/resolvers         |
| Notify      | sonner                                              |
| Email       | Resend (server-only)                                |
| Images      | Pexels (licensed stock, configured as remote host)  |
| Hosting     | Vercel                                              |

## Prerequisites

- Node.js **20.9+** (built and tested on Node 22)
- npm 10+
- A [Turso](https://turso.tech) database for production deployments
- A [Resend](https://resend.com) account for contact-form delivery

## Installation

```bash
git clone <your-repo-url> your-project
cd your-project
npm install
```

## Local development

```bash
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build (must pass before deploy)
npm run start   # serve the production build
npm run lint    # ESLint
```

## Environment variables

| Variable               | Required | Purpose                                          |
| ---------------------- | -------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Yes      | Canonical site URL for SEO, sitemap, OG, robots  |
| `TURSO_DATABASE_URL`   | Production | Turso/libSQL database URL                       |
| `TURSO_AUTH_TOKEN`     | Production | Server-only Turso authentication token           |
| `DATABASE_FILE`        | No       | Local SQLite path; defaults to `data/app.db`      |
| `RESEND_API_KEY`       | For email| Resend API key (never exposed to the browser)    |
| `CONTACT_FROM_EMAIL`   | For email| Verified sender address in Resend               |
| `CONTACT_TO_EMAIL`     | For email| Studio inbox that receives enquiries            |

> When email variables are missing, the `/api/contact` route returns a clear
> `503 EMAIL_NOT_CONFIGURED` response and the form tells visitors to email the
> studio directly — no fake success message is ever shown.

Local development uses SQLite. Production requires both Turso variables;
the app intentionally fails with a configuration error rather than silently
creating an empty, non-persistent SQLite database on Vercel.

## Setting up the production database

1. Create a Turso database and generate an auth token.
2. Put `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env.local` for the
   one-time import, and add the same values to the Vercel project’s Production
   environment variables.
3. Run `npm run db:setup:turso` once. It applies the committed migrations and
   copies the current local SQLite content into an empty Turso database. It
   refuses to copy into a database that already contains content.
4. Redeploy after setting the Vercel variables.

The setup command requires the local `data/app.db` file and `better-sqlite3`,
which is kept as a development dependency for local database maintenance only.

## Configuring email delivery

1. Create a Resend account and add your domain (verify the domain / DNS).
2. Create an API key in Resend.
3. Set the three variables above in `.env.local` (or Vercel project settings).
4. Ensure `CONTACT_FROM_EMAIL` uses your verified domain.
5. Restart the dev server. Submissions are now delivered to `CONTACT_TO_EMAIL`,
   with the visitor’s address set as `reply-to`.

## Updating content

All editable business content is centralised:

| What                        | Where                                  |
| --------------------------- | -------------------------------------- |
| Brand, contact, nav, social | `lib/config.ts`                        |
| Designer profile            | `lib/data/profile.ts`                  |
| Services                    | `lib/data/services.ts` (8 entries)     |
| Portfolio projects          | `lib/data/projects.ts` (10 entries)    |
| Process steps               | `lib/data/process.ts`                  |
| Testimonials                | `lib/data/testimonials.ts` (placeholders) |
| Validation (form)           | `lib/schemas/contact.ts`               |

To add a project: copy an entry in `lib/data/projects.ts`, change the `slug`,
and add one cover image + several gallery images. Gallery/lightbox data comes
from the `gallery` array — add valid `pexelsPhoto(id)` IDs or your own URLs
(via `src`).

Images are built with `pexelsPhoto(id, { width, height })` in `lib/utils.ts`.
To use your own photography, add your host to `images.remotePatterns` in
`next.config.ts` and reference full URLs in each ImageAsset.

## Business info to replace before launch

- [ ] Real studio name, email, phone, WhatsApp, address and service area
- [ ] Real social profile URLs (currently platform roots)
- [ ] Real portfolio content + licensed client photography
- [ ] Verified, attributed client testimonials (with permission)
- [ ] `NEXT_PUBLIC_SITE_URL` set to the real production domain
- [ ] Privacy/Terms reviewed by your advisor
- [ ] JSON-LD address/geo reviewed in `lib/seo/json-ld.ts`

## Deploying on Vercel

1. Push the repository to GitHub.
2. In Vercel: **New Project → Import** the repo. The framework is detected
   automatically (Next.js).
3. Add the environment variables from `.env.example` in **Settings → Environment
   Variables**.
4. Deploy. Build runs `npm run build` by default.

### Connecting a custom domain

1. In Vercel, open the project **Settings → Domains**.
2. Add your domain (e.g. `aurelia-interiors.com`) and optionally `www`.
3. Follow Vercel’s DNS instructions at your registrar (CNAME or A record).
4. Update `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy.

## Troubleshooting

- **Build fails with font error** — `next/font/google` downloads fonts at build
  time; ensure the build machine has network access.
- **Images not loading** — the remote host must be inside `images.remotePatterns`
  in `next.config.ts` (Pexels is pre-configured).
- **Contact form returns “not connected to an email service”** — `RESEND_API_KEY`,
  `CONTACT_FROM_EMAIL` or `CONTACT_TO_EMAIL` are unset/invalid.
- **Resend rejected the sender** — your `CONTACT_FROM_EMAIL` domain isn’t
  verified in Resend yet.
- **Rate-limit false positives** — the limiter is per-Vercel-instance; if your
  studio receives very high traffic, back it with a shared store (Upstash
  Redis) as noted in `lib/rate-limit.ts`.
- **404 on direct navigation to `/portfolio/…`** — ensure the slug exists in
  `lib/data/projects.ts`; on Vercel dynamic routes work out of the box.