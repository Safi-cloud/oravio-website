import { MetadataRoute } from "next";

const SITE_URL = "https://oravio.nl";
const PAGES = ["", "/platform", "/branches", "/faq", "/over-ons", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
