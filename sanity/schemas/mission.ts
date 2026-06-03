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
      name: "eyebrow",
      title: "Sur-titre",
      type: "string",
    }),
    defineField({
      name: "italicWord",
      title: "Mot en italique (dans le titre)",
      type: "string",
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
      name: "description",
      title: "Description longue",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "programs",
      title: "Programmes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "stats",
      title: "Chiffres",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Valeur", type: "string" }),
            defineField({ name: "label", title: "Libellé", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "cover",
      title: "Image",
      type: "figure",
    }),
    defineField({
      name: "video",
      title: "Vidéo",
      type: "videoEmbed",
    }),
    defineField({
      name: "details",
      title: "Détails",
      type: "blockContent",
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
