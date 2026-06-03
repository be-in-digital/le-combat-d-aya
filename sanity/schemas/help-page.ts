import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton: "Comment aider" (/aider). Ways to help, the 3-step process and
 * the tax-deduction section.
 */
export default defineType({
  name: "helpPage",
  title: "Comment aider",
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
      ],
    }),
    defineField({
      name: "ways",
      title: "Façons d'aider",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icône (Material Symbol)", type: "string" }),
            defineField({ name: "title", title: "Titre", type: "string", validation: (r) => r.required() }),
            defineField({ name: "text", title: "Texte", type: "text", rows: 3 }),
            defineField({ name: "ctaLabel", title: "Texte du bouton", type: "string" }),
            defineField({ name: "ctaHref", title: "Lien", type: "string" }),
            defineField({ name: "highlighted", title: "Mise en avant", type: "boolean", initialValue: false }),
          ],
          preview: { select: { title: "title", subtitle: "icon" } },
        }),
      ],
    }),
    defineField({
      name: "stepsHeading",
      title: "Processus — titre",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "eyebrow", title: "Sur-titre", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string" }),
      ],
    }),
    defineField({
      name: "steps",
      title: "Étapes",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "number", title: "Numéro", type: "string" }),
            defineField({ name: "title", title: "Titre", type: "string" }),
            defineField({ name: "text", title: "Texte", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "number" } },
        }),
      ],
    }),
    defineField({
      name: "taxSection",
      title: "Section défiscalisation",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "title", title: "Titre", type: "string" }),
        defineField({ name: "text", title: "Texte", type: "text", rows: 3 }),
        defineField({ name: "note", title: "Note", type: "string" }),
      ],
    }),
    defineField({ name: "seo", title: "SEO & partage", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Comment aider" }) },
});
