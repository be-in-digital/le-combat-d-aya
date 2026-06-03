import type { StructureResolver } from "sanity/structure";

/** Document types that should exist only once (edited as a single document). */
const SINGLETONS: { id: string; title: string; icon?: string }[] = [
  { id: "siteSettings", title: "Paramètres du site" },
  { id: "homePage", title: "Accueil" },
  { id: "storyPage", title: "Notre histoire" },
  { id: "missionsPage", title: "Page Missions" },
  { id: "helpPage", title: "Comment aider" },
  { id: "contactPage", title: "Contact" },
  { id: "newsPage", title: "Page Actualités" },
  { id: "eventsPage", title: "Page Événements" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Le Combat d'Alya")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(
              SINGLETONS.map((s) =>
                S.listItem()
                  .title(s.title)
                  .id(s.id)
                  .child(
                    S.editor().id(s.id).schemaType(s.id).documentId(s.id),
                  ),
              ),
            ),
        ),
      S.documentTypeListItem("legalPage").title("Pages légales"),
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
export const singletonTypes = new Set(SINGLETONS.map((s) => s.id));
