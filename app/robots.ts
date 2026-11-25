import { MetadataRoute } from "next";

const SITE_URL = "https://oravio.nl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/voorstel/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
