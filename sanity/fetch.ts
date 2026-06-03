import { draftMode } from "next/headers";
import { sanityClient, sanityServerClient } from "./client";

/** Path where the Studio is mounted — used for stega click-to-edit links. */
const STUDIO_URL = "/studio";

/**
 * Draft-aware fetch used across the site.
 *
 * - Normal requests: reads published content from the CDN with tag-based ISR.
 * - Draft Mode (Sanity Presentation / preview): reads drafts with a token,
 *   uncached, and embeds stega metadata so the Visual Editing overlay can map
 *   rendered text back to Studio fields (click-to-edit).
 *
 * `draftMode()` is wrapped in try/catch so this is also safe to call from
 * `generateStaticParams`, `sitemap.ts` and other non-request scopes.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  let isDraft = false;
  try {
    isDraft = (await draftMode()).isEnabled;
  } catch {
    isDraft = false;
  }

  if (isDraft) {
    return sanityServerClient
      .withConfig({
        perspective: "drafts",
        useCdn: false,
        stega: { enabled: true, studioUrl: STUDIO_URL },
      })
      .fetch<T>(query, params, { cache: "no-store" });
  }

  return sanityClient.fetch<T>(query, params, {
    next: { revalidate: revalidate === false ? 0 : revalidate, tags },
  });
}
