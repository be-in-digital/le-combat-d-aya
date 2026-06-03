import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Singleton: "Contact" (/contact). Contact channels, quick links and optional
 * social override. The postal address falls back to siteSettings.
 */
export default defineType({
  name: "contactPage",
  title: "Contact",
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
      name: "channels",
      title: "Canaux de contact",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icône (Material Symbol)", type: "string" }),
            defineField({ name: "title", title: "Intitulé", type: "string", validation: (r) => r.required() }),
            defineField({ name: "primary", title: "Coordonnée (email/téléphone)", type: "string" }),
            defineField({ name: "secondary", title: "Précision", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "primary" } },
        }),
      ],
    }),
    defineField({
      name: "quickLinks",
      title: "Liens rapides",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icône (Material Symbol)", type: "string" }),
            defineField({ name: "label", title: "Libellé", type: "string" }),
            defineField({ name: "href", title: "Lien", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Réseaux sociaux (sinon ceux des paramètres)",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
    defineField({ name: "seo", title: "SEO & partage", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Contact" }) },
});
