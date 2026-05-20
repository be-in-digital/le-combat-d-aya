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
      name: "instagramUrl",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn",
      type: "url",
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
  ],
  preview: {
    prepare: () => ({ title: "Paramètres du site" }),
  },
});
