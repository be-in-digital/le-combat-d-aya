import { defineField, defineType } from "sanity";

/**
 * Legal pages (mentions légales, confidentialité, CGU). One document per page,
 * keyed by a fixed slug, with rich-text body and a "last updated" date.
 */
export default defineType({
  name: "legalPage",
  title: "Page légale",
  type: "document",
  groups: [
    { name: "content", title: "Contenu", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      group: "content",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      description: "mentions-legales · confidentialite · cgu",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 2,
      group: "content",
    }),
    defineField({
      name: "lastUpdated",
      title: "Dernière mise à jour",
      type: "date",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "blockContent",
      group: "content",
    }),
    defineField({ name: "seo", title: "SEO & partage", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
