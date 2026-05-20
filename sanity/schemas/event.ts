import { defineField, defineType } from "sanity";

export default defineType({
  name: "event",
  title: "Événement",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "startsAt",
      title: "Date / heure de début",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Date / heure de fin",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "Lieu",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Adresse complète",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "cover",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "registrationUrl",
      title: "URL d'inscription",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "À la une",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Date (prochains)",
      name: "startsAtAsc",
      by: [{ field: "startsAt", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", date: "startsAt", media: "cover" },
    prepare({ title, date, media }) {
      return {
        title,
        subtitle: date
          ? new Date(date).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })
          : "",
        media,
      };
    },
  },
});
