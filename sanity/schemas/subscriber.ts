import { defineField, defineType } from "sanity";

export default defineType({
  name: "subscriber",
  title: "Abonné newsletter",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (r) => r.required().email(),
    }),
    defineField({
      name: "firstName",
      title: "Prénom",
      type: "string",
    }),
    defineField({
      name: "subscribedAt",
      title: "Date d'inscription",
      type: "datetime",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Site (footer)", value: "site-footer" },
          { title: "Site (CTA)", value: "site-cta" },
          { title: "Don", value: "donation" },
          { title: "Manuel", value: "manual" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "Actif", value: "active" },
          { title: "Désinscrit", value: "unsubscribed" },
          { title: "Bounce", value: "bounced" },
        ],
      },
      initialValue: "active",
    }),
    defineField({
      name: "resendContactId",
      title: "ID contact Resend",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "status" },
  },
});
