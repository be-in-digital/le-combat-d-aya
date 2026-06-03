import { defineField, defineType } from "sanity";

/**
 * Reusable SEO / social-sharing object. Attach to any document via a `seo`
 * field. Values here override the site-wide defaults (siteSettings.defaultSeo)
 * and the page's own title/description when resolving <head> metadata.
 */
export default defineType({
  name: "seo",
  title: "SEO & partage",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "metaTitle",
      title: "Titre SEO",
      type: "string",
      description:
        "Titre affiché dans Google et les onglets (~60 caractères). À défaut, le titre de la page est utilisé.",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Description SEO",
      type: "text",
      rows: 3,
      description:
        "Résumé affiché sous le titre dans les résultats de recherche (~155 caractères).",
      validation: (r) => r.max(180),
    }),
    defineField({
      name: "ogImage",
      title: "Image de partage (Open Graph)",
      type: "image",
      description:
        "Image affichée lors du partage sur les réseaux sociaux. Format recommandé : 1200 × 630 px.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "keywords",
      title: "Mots-clés",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "noIndex",
      title: "Masquer des moteurs de recherche",
      description: "Empêche l'indexation de cette page (noindex).",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
