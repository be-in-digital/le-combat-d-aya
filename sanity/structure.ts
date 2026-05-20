import type { StructureResolver } from "sanity/structure";

const SINGLETONS = ["siteSettings"];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Le Combat d'Alya")
    .items([
      S.listItem()
        .title("Paramètres du site")
        .id("siteSettings")
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
      S.divider(),
      S.documentTypeListItem("article").title("Articles"),
      S.documentTypeListItem("campaign").title("Campagnes"),
      S.documentTypeListItem("mission").title("Missions"),
      S.documentTypeListItem("testimonial").title("Témoignages"),
      S.documentTypeListItem("founder").title("Équipe / Fondateurs"),
      S.documentTypeListItem("partner").title("Partenaires"),
      S.documentTypeListItem("event").title("Événements"),
      S.divider(),
      S.listItem()
        .title("Newsletter")
        .child(
          S.list()
            .title("Newsletter")
            .items([
              S.documentTypeListItem("newsletterIssue").title("Éditions"),
              S.documentTypeListItem("subscriber").title("Abonnés"),
            ]),
        ),
    ]);

export const singletonActions = new Set(["publish", "discardChanges", "restore"]);
export const singletonTypes = new Set(SINGLETONS);
