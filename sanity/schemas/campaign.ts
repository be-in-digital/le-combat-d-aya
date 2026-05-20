import { defineField, defineType } from "sanity";

export default defineType({
  name: "campaign",
  title: "Campagne",
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
      name: "tagline",
      title: "Accroche",
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
      name: "goalAmount",
      title: "Objectif (€)",
      type: "number",
      validation: (r) => r.required().positive(),
    }),
    defineField({
      name: "raisedAmount",
      title: "Collecté (€)",
      type: "number",
      initialValue: 0,
      description: "Mis à jour manuellement (ou plus tard via webhook HelloAsso)",
    }),
    defineField({
      name: "supporters",
      title: "Nombre de soutiens",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "deadline",
      title: "Date de fin",
      type: "date",
    }),
    defineField({
      name: "helloAssoUrl",
      title: "URL HelloAsso",
      type: "url",
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "À venir", value: "upcoming" },
          { title: "En cours", value: "active" },
          { title: "Terminée", value: "completed" },
        ],
      },
      initialValue: "active",
    }),
    defineField({
      name: "featured",
      title: "Campagne phare",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "status", media: "cover" },
  },
});
