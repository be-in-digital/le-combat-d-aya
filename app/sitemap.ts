import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/fetch";
import { defineQuery } from "next-sanity";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/histoire", changeFrequency: "monthly", priority: 0.9 },
  { path: "/missions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/aider", changeFrequency: "weekly", priority: 0.95 },
  { path: "/actualites", changeFrequency: "daily", priority: 0.8 },
  { path: "/evenements", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.3 },
  { path: "/confidentialite", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cgu", changeFrequency: "yearly", priority: 0.3 },
];

const sitemapArticlesQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)] {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, publishedAt)
  }
`);

const sitemapEventsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)] {
    "slug": slug.current,
    "lastModified": coalesce(_updatedAt, startsAt)
  }
`);

type SitemapItem = { slug: string; lastModified: string };
type SitemapArticle = SitemapItem;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }),
  );

  let articles: SitemapArticle[] = [];
  let events: SitemapItem[] = [];
  try {
    [articles, events] = await Promise.all([
      sanityFetch<SitemapArticle[]>({
        query: sitemapArticlesQuery,
        revalidate: 3600,
        tags: ["article"],
      }),
      sanityFetch<SitemapItem[]>({
        query: sitemapEventsQuery,
        revalidate: 3600,
        tags: ["event"],
      }),
    ]);
  } catch {
    /* swallow — sitemap should still build */
  }

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/actualites/${a.slug}`,
    lastModified: a.lastModified ? new Date(a.lastModified) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eventEntries: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${SITE_URL}/evenements/${e.slug}`,
    lastModified: e.lastModified ? new Date(e.lastModified) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...base, ...articleEntries, ...eventEntries];
}
