import { defineField, defineType } from "sanity";

export default defineType({
  name: "mission",
  title: "Mission",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: "icon",
      title: "Icône (Material Symbol)",
      description: "Nom d'icône Material Symbols Outlined, ex. favorite, school, science",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tagline",
      title: "Sous-titre",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Résumé",
      type: "text",
      rows: 4,
      validation: (r) => r.max(400),
    }),
    defineField({
      name: "details",
      title: "Détails",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: "Ordre", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "tagline" },
  },
});
