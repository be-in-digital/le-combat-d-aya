import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton: the home page (/). Holds the hero, key figures, founder note,
 * FAQ and newsletter copy. Mission cards, testimonials, partners and the
 * featured campaign are pulled from their own document types.
 */
export default defineType({
  name: "homePage",
  title: "Accueil",
  type: "document",
  groups: [
    { name: "content", title: "Contenu", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "hero",
      title: "En-tête (hero)",
      type: "object",
      group: "content",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({
          name: "title",
          title: "Titre",
          type: "string",
          validation: (r) => r.required(),
        }),
        defineField({
          name: "titleAccent",
          title: "Mot mis en valeur (italique)",
          type: "string",
        }),
        defineField({ name: "intro", title: "Introduction", type: "text", rows: 3 }),
        defineField({ name: "image", title: "Image", type: "figure" }),
        defineField({ name: "video", title: "Vidéo", type: "videoEmbed" }),
        defineField({ name: "primaryCta", title: "Bouton principal", type: "ctaLink" }),
        defineField({ name: "secondaryCta", title: "Bouton secondaire", type: "ctaLink" }),
      ],
    }),
    defineField({
      name: "stats",
      title: "Chiffres clés",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Valeur", type: "string" }),
            defineField({ name: "label", title: "Libellé", type: "string" }),
            defineField({ name: "caption", title: "Précision", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
    }),
    defineField({
      name: "missionsHeading",
      title: "Section missions — titre",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string" }),
        defineField({ name: "intro", title: "Introduction", type: "text", rows: 2 }),
      ],
    }),
    defineField({
      name: "founderNote",
      title: "Le mot de la fondatrice",
      type: "object",
      group: "content",
      options: { collapsible: true },
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "quote", title: "Citation", type: "text", rows: 2 }),
        defineField({ name: "body", title: "Texte", type: "blockContent" }),
        defineField({ name: "name", title: "Signature", type: "string" }),
        defineField({ name: "role", title: "Rôle", type: "string" }),
        defineField({ name: "portrait", title: "Portrait", type: "figure" }),
        defineField({ name: "ctaLabel", title: "Texte du lien", type: "string" }),
        defineField({ name: "ctaHref", title: "Lien", type: "string" }),
      ],
    }),
    defineField({
      name: "faqHeading",
      title: "Section FAQ — titre",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string" }),
      ],
    }),
    defineField({
      name: "faq",
      title: "Questions fréquentes",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "answer",
              title: "Réponse",
              type: "text",
              rows: 3,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    defineField({
      name: "newsletter",
      title: "Encart newsletter",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "heading", title: "Titre", type: "string" }),
        defineField({ name: "text", title: "Texte", type: "text", rows: 2 }),
      ],
    }),
    defineField({ name: "seo", title: "SEO & partage", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Accueil" }) },
});
