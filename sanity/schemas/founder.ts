import { defineField, defineType } from "sanity";

export default defineType({
  name: "founder",
  title: "Fondateur / Équipe",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "role",
      title: "Rôle",
      type: "string",
    }),
    defineField({
      name: "portrait",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "quote",
      title: "Citation personnelle",
      type: "text",
      rows: 3,
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
    select: { title: "name", subtitle: "role", media: "portrait" },
  },
});
