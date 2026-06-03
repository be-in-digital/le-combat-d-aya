import { defineField, defineType } from "sanity";

/**
 * Singleton: page header + SEO for "Nos missions" (/missions). The mission
 * cards themselves are individual `mission` documents.
 */
export default defineType({
  name: "missionsPage",
  title: "Page Missions",
  type: "document",
  groups: [
    { name: "content", title: "Contenu", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "En-tête",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string", validation: (r) => r.required() }),
        defineField({ name: "titleAccent", title: "Mot en italique", type: "string" }),
        defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
        defineField({ name: "meta", title: "Mention", type: "string" }),
      ],
    }),
    defineField({
      name: "intro",
      title: "Texte d'introduction",
      type: "blockContent",
      group: "content",
    }),
    defineField({ name: "seo", title: "SEO & partage", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Page Missions" }) },
});
