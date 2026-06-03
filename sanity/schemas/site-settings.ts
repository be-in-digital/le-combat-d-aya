import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Nom du site",
      type: "string",
    }),
    defineField({
      name: "tagline",
      title: "Slogan",
      type: "string",
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
      name: "rna",
      title: "Numéro RNA",
      type: "string",
    }),
    defineField({
      name: "siret",
      title: "SIRET",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Adresse du siège",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "email",
      title: "Email de contact",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Téléphone",
      type: "string",
    }),
    defineField({
      name: "publicationDirector",
      title: "Directeur de la publication",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Réseaux sociaux",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram (obsolète — utilisez Réseaux sociaux)",
      type: "url",
      hidden: true,
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn (obsolète — utilisez Réseaux sociaux)",
      type: "url",
      hidden: true,
    }),
    defineField({
      name: "footerNote",
      title: "Mention de bas de page",
      type: "string",
      description: "Ex. Association reconnue d'intérêt général · 66 % déductible",
    }),
    defineField({
      name: "stats",
      title: "Chiffres clés",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Valeur", type: "string" }),
            defineField({ name: "label", title: "Libellé", type: "string" }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),
    defineField({
      name: "defaultSeo",
      title: "SEO par défaut",
      description:
        "Titre, description et image de partage utilisés quand une page n'en définit pas.",
      type: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Paramètres du site" }),
  },
});
