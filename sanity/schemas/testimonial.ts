import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Témoignage",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Citation",
      type: "text",
      rows: 6,
      validation: (r) => r.required().max(1200),
    }),
    defineField({
      name: "authorName",
      title: "Nom",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Rôle",
      type: "string",
    }),
    defineField({
      name: "authorPhoto",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "featured",
      title: "À la une",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Ordre",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: "Ordre", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "authorName", subtitle: "authorRole", media: "authorPhoto" },
  },
});
