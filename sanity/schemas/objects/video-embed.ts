import { defineField, defineType } from "sanity";

/**
 * Video object. Editors can either upload a video file directly to Sanity
 * assets, or point to an external video (YouTube / Vimeo / direct MP4 URL).
 * A poster image and caption are supported for both.
 */
export default defineType({
  name: "videoEmbed",
  title: "Vidéo",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
    }),
    defineField({
      name: "source",
      title: "Source de la vidéo",
      type: "string",
      options: {
        list: [
          { title: "Lien externe (YouTube, Vimeo, MP4…)", value: "url" },
          { title: "Fichier importé dans Sanity", value: "file" },
        ],
        layout: "radio",
      },
      initialValue: "url",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "url",
      title: "Lien de la vidéo",
      type: "url",
      description: "URL YouTube, Vimeo ou fichier MP4 direct.",
      hidden: ({ parent }) => parent?.source === "file",
      validation: (r) =>
        r.uri({ scheme: ["http", "https"] }).custom((value, ctx) => {
          const parent = ctx.parent as { source?: string } | undefined;
          if (parent?.source === "url" && !value) return "Lien requis.";
          return true;
        }),
    }),
    defineField({
      name: "file",
      title: "Fichier vidéo",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.source !== "file",
      validation: (r) =>
        r.custom((value, ctx) => {
          const parent = ctx.parent as { source?: string } | undefined;
          if (parent?.source === "file" && !value) return "Fichier requis.";
          return true;
        }),
    }),
    defineField({
      name: "poster",
      title: "Image d'aperçu",
      type: "image",
      description: "Affichée avant la lecture.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
      ],
    }),
    defineField({
      name: "caption",
      title: "Légende",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", source: "source", media: "poster" },
    prepare({ title, source, media }) {
      return {
        title: title || "Vidéo",
        subtitle: source === "file" ? "Fichier importé" : "Lien externe",
        media,
      };
    },
  },
});
