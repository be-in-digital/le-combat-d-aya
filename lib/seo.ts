import type { Metadata } from "next";
import type { Seo } from "@/sanity/types";

/**
 * Builds Next.js <head> metadata from an optional Sanity `seo` object, with
 * sensible fallbacks. Title/description fall back to the page's own values;
 * the OG image falls back to the route-level opengraph-image when none is set
 * in Sanity (we simply omit `images` so Next uses the file convention).
 *
 * `title` is returned as a plain string so the root layout's
 * `%s · Le Combat d'Alya` template applies. Pass `absoluteTitle` to opt out.
 */
export function buildMetadata({
  seo,
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  seo?: Seo | null;
  title?: string | null;
  description?: string | null;
  path?: string;
  absoluteTitle?: boolean;
}): Metadata {
  const metaTitle = seo?.metaTitle ?? title ?? undefined;
  const metaDescription = seo?.metaDescription ?? description ?? undefined;
  const ogImageUrl = seo?.ogImage?.url ?? undefined;
  const ogImageAlt = seo?.ogImage?.alt ?? metaTitle ?? undefined;
  const noIndex = seo?.noIndex ?? false;

  const images = ogImageUrl
    ? [{ url: ogImageUrl, alt: ogImageAlt }]
    : undefined;

  return {
    title: metaTitle
      ? absoluteTitle
        ? { absolute: metaTitle }
        : metaTitle
      : undefined,
    description: metaDescription,
    keywords: seo?.keywords ?? undefined,
    alternates: path ? { canonical: path } : undefined,
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      ...(images ? { images } : {}),
    },
    twitter: {
      title: metaTitle,
      description: metaDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}
