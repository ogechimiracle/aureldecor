import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { services } from "@/lib/data/services";
import { listPublishedProjects } from "@/server/services/projects";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/portfolio",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${siteConfig.url}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const published = await listPublishedProjects({ pageSize: 500 });
    projectRoutes = published.items.map((project) => ({
      url: `${siteConfig.url}/portfolio/${project.slug}`,
      lastModified: project.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    console.error("[sitemap] Could not load published projects.");
  }

  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}
