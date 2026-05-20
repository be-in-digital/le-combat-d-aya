import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/site";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "NGO",
        name: SITE_NAME,
        alternateName: "Le Combat d'Aya",
        url: SITE_URL,
        logo: `${SITE_URL}/opengraph-image`,
        description: SITE_DESCRIPTION,
        email: "contact@lecombatdalya.fr",
        address: {
          "@type": "PostalAddress",
          streetAddress: "15 rue de la Solidarité",
          postalCode: "75011",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
        sameAs: [],
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: "fr-FR",
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  slug,
  imageUrl,
  publishedAt,
  modifiedAt,
  author,
}: {
  title: string;
  description?: string | null;
  slug: string;
  imageUrl?: string | null;
  publishedAt: string;
  modifiedAt?: string | null;
  author?: string | null;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: title,
        description: description ?? undefined,
        image: imageUrl ? [imageUrl] : undefined,
        datePublished: publishedAt,
        dateModified: modifiedAt ?? publishedAt,
        author: author
          ? { "@type": "Person", name: author }
          : { "@type": "Organization", name: SITE_NAME },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/opengraph-image`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/actualites/${slug}`,
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
