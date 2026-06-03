import { defineField, defineType } from "sanity";

/**
 * Factory for simple index-page singletons that only need a hero + SEO
 * (e.g. Actualités, Événements). Produces a distinct named document type.
 */
export function defineSimplePage(name: string, title: string) {
  return defineType({
    name,
    title,
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
      defineField({ name: "seo", title: "SEO & partage", type: "seo", group: "seo" }),
    ],
    preview: { prepare: () => ({ title }) },
  });
}

export const newsPage = defineSimplePage("newsPage", "Page Actualités");
export const eventsPage = defineSimplePage("eventsPage", "Page Événements");
