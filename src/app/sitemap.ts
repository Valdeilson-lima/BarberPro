import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const barbers = await prisma.user.findMany({
    where: { status: true },
    select: { id: true, updatedAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const barberRoutes: MetadataRoute.Sitemap = barbers.map((barber) => ({
    url: `${siteUrl}/barber/${barber.id}`,
    lastModified: barber.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...barberRoutes];
}
