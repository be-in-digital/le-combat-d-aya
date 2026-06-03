import { defineField, defineType } from "sanity";

/**
 * A call-to-action button: label + destination + visual style.
 * `href` accepts internal paths (e.g. /aider) or full external URLs.
 */
export default defineType({
  name: "ctaLink",
  title: "Bouton d'action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texte du bouton",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "href",
      title: "Lien",
      type: "string",
      description: "Chemin interne (ex. /aider) ou URL complète.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Principal (plein)", value: "primary" },
          { title: "Secondaire (contour)", value: "secondary" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
