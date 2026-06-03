import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton: "Notre histoire" (/histoire). Origin story, timeline, values and
 * a mixed image/video gallery.
 */
export default defineType({
  name: "storyPage",
  title: "Notre histoire",
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
        defineField({ name: "meta", title: "Mention (ex. Édition Printemps · No. 03)", type: "string" }),
      ],
    }),
    defineField({
      name: "parentsWord",
      title: "Le mot des parents",
      type: "object",
      group: "content",
      options: { collapsible: true },
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "quote", title: "Citation", type: "text", rows: 2 }),
        defineField({ name: "body", title: "Texte", type: "blockContent" }),
        defineField({ name: "signature", title: "Signature", type: "string" }),
        defineField({ name: "role", title: "Rôle", type: "string" }),
        defineField({ name: "image", title: "Photo", type: "figure" }),
        defineField({ name: "imageBadge", title: "Badge sur la photo", type: "string" }),
      ],
    }),
    defineField({
      name: "timelineHeading",
      title: "Chronologie — titre",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string" }),
      ],
    }),
    defineField({
      name: "timeline",
      title: "Chronologie",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "year", title: "Année", type: "string", validation: (r) => r.required() }),
            defineField({ name: "title", title: "Titre", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Texte", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "year", subtitle: "title" } },
        }),
      ],
    }),
    defineField({
      name: "valuesHeading",
      title: "Valeurs — titre",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string" }),
      ],
    }),
    defineField({
      name: "values",
      title: "Valeurs",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icône (Material Symbol)",
              type: "string",
              description: "Ex. favorite, lock_open, diversity_3",
            }),
            defineField({ name: "title", title: "Titre", type: "string" }),
            defineField({ name: "text", title: "Texte", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "icon" } },
        }),
      ],
    }),
    defineField({
      name: "galleryHeading",
      title: "Galerie — titre",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string" }),
        defineField({ name: "note", title: "Note", type: "string" }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Galerie (images, vidéos, citations)",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "figure" }),
        defineArrayMember({ type: "videoEmbed" }),
        defineArrayMember({
          type: "object",
          name: "quoteCard",
          title: "Citation",
          fields: [
            defineField({ name: "quote", title: "Citation", type: "text", rows: 2 }),
            defineField({ name: "author", title: "Auteur", type: "string" }),
          ],
          preview: { select: { title: "quote", subtitle: "author" } },
        }),
      ],
    }),
    defineField({
      name: "cta",
      title: "Appel à l'action (bas de page)",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string" }),
        defineField({ name: "text", title: "Texte", type: "text", rows: 2 }),
        defineField({ name: "primaryCta", title: "Bouton principal", type: "ctaLink" }),
        defineField({ name: "secondaryCta", title: "Bouton secondaire", type: "ctaLink" }),
      ],
    }),
    defineField({ name: "seo", title: "SEO & partage", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Notre histoire" }) },
});
