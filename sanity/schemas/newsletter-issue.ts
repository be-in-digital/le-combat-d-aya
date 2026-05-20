import { defineField, defineType } from "sanity";

export default defineType({
  name: "newsletterIssue",
  title: "Newsletter",
  type: "document",
  fields: [
    defineField({
      name: "subject",
      title: "Objet de l'email",
      type: "string",
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: "preheader",
      title: "Pré-en-tête",
      description: "Texte court visible en aperçu dans l'inbox",
      type: "string",
      validation: (r) => r.max(150),
    }),
    defineField({
      name: "heading",
      title: "Titre principal",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Texte alternatif", type: "string" }),
          ],
        },
      ],
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "Brouillon", value: "draft" },
          { title: "Programmée", value: "scheduled" },
          { title: "Envoyée", value: "sent" },
        ],
      },
      initialValue: "draft",
      readOnly: ({ document }) => document?.status === "sent",
    }),
    defineField({
      name: "scheduledFor",
      title: "Date d'envoi programmée",
      type: "datetime",
    }),
    defineField({
      name: "sentAt",
      title: "Date d'envoi",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "resendBroadcastId",
      title: "ID broadcast Resend",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "recipientCount",
      title: "Nombre de destinataires",
      type: "number",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Plus récent",
      name: "sentAtDesc",
      by: [
        { field: "sentAt", direction: "desc" },
        { field: "_updatedAt", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: { title: "subject", status: "status", date: "sentAt" },
    prepare({ title, status, date }) {
      const map: Record<string, string> = {
        draft: "Brouillon",
        scheduled: "Programmée",
        sent: "Envoyée",
      };
      return {
        title: title || "Sans objet",
        subtitle:
          (map[status as string] ?? "—") +
          (date ? ` · ${new Date(date).toLocaleDateString("fr-FR")}` : ""),
      };
    },
  },
});
