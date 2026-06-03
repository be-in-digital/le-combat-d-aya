import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityServerClient } from "@/sanity/client";

/**
 * Enables Next.js Draft Mode. Called by the Sanity Presentation tool
 * (configured via `previewUrl.previewMode.enable`). The handler validates the
 * preview secret using the authenticated client before setting the cookie.
 */
export const { GET } = defineEnableDraftMode({
  client: sanityServerClient,
});
