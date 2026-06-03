import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Rich text (Portable Text) used for article bodies, legal pages, mission
 * details and any long-form prose. Supports inline images and videos plus
 * link annotations. Render with @portabletext/react.
 */
export default defineType({
  name: "blockContent",
  title: "Contenu",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Titre 2", value: "h2" },
        { title: "Titre 3", value: "h3" },
        { title: "Titre 4", value: "h4" },
        { title: "Citation", value: "blockquote" },
      ],
      lists: [
        { title: "Puces", value: "bullet" },
        { title: "Numérotée", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Gras", value: "strong" },
          { title: "Italique", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Lien",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (r) =>
                  r.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                    allowRelative: true,
                  }),
              }),
              defineField({
                name: "blank",
                title: "Ouvrir dans un nouvel onglet",
                type: "boolean",
                initialValue: true,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "figure" }),
    defineArrayMember({ type: "videoEmbed" }),
  ],
});
