import { defineField, defineType } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Recherche", value: "recherche" },
          { title: "Événement", value: "evenement" },
          { title: "Annonce", value: "annonce" },
          { title: "Témoignage", value: "temoignage" },
          { title: "Presse", value: "presse" },
        ],
      },
    }),
    defineField({
      name: "excerpt",
      title: "Chapeau",
      type: "text",
      rows: 3,
      validation: (r) => r.max(280),
    }),
    defineField({
      name: "cover",
      title: "Image de couverture",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "author",
      title: "Auteur",
      type: "string",
    }),
    defineField({
      name: "readingTime",
      title: "Temps de lecture (min.)",
      type: "number",
    }),
    defineField({
      name: "featured",
      title: "À la une",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
            defineField({ name: "caption", title: "Légende", type: "string" }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Plus récent",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "cover", date: "publishedAt" },
    prepare({ title, media, date }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString("fr-FR") : "",
        media,
      };
    },
  },
});
