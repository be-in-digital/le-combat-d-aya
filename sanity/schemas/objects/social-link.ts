import { defineField, defineType } from "sanity";

/**
 * A social-media / external profile link. Reused in site settings and the
 * contact page.
 */
export default defineType({
  name: "socialLink",
  title: "Réseau social",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Plateforme",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "Facebook", value: "facebook" },
          { title: "YouTube", value: "youtube" },
          { title: "TikTok", value: "tiktok" },
          { title: "X / Twitter", value: "x" },
          { title: "Autre", value: "other" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "url",
      title: "Lien",
      type: "url",
      validation: (r) => r.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "label",
      title: "Libellé (optionnel)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
