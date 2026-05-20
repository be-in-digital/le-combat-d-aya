import { defineField, defineType } from "sanity";

export default defineType({
  name: "partner",
  title: "Partenaire",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "url",
      title: "Site web",
      type: "url",
    }),
    defineField({
      name: "tier",
      title: "Niveau",
      type: "string",
      options: {
        list: [
          { title: "Grand mécène", value: "platinum" },
          { title: "Mécène", value: "gold" },
          { title: "Partenaire", value: "silver" },
          { title: "Soutien", value: "bronze" },
        ],
      },
      initialValue: "silver",
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
    select: { title: "name", subtitle: "tier", media: "logo" },
  },
});
