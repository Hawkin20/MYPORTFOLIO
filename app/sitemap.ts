import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://developerstudio.dev";

  const staticPages = [
    "",
    "/about",
    "/journey",
    "/projects",
    "/products",
    "/services",
    "/tech-stack",
    "/resume",
    "/contact",
  ];

  return staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.8,
  }));
}
