import { defineField, defineType } from "sanity";

/**
 * Reusable image with alt text + optional caption. Use everywhere an image is
 * meaningful (heroes, covers, portraits, gallery). Alt text is required for
 * accessibility and SEO.
 */
export default defineType({
  name: "figure",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texte alternatif",
      type: "string",
      description: "Décrit l'image pour l'accessibilité et le référencement.",
      validation: (r) =>
        r.required().warning("Ajoutez un texte alternatif pour l'accessibilité."),
    }),
    defineField({
      name: "caption",
      title: "Légende",
      type: "string",
    }),
  ],
  preview: {
    select: { media: "asset", title: "alt", subtitle: "caption" },
  },
});
