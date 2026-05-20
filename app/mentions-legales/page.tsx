import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { LegalLayout, LegalSection, LegalDl } from "@/components/legal-layout";
import { ORG } from "@/components/site-data";

export const metadata: Metadata = {
  title: "Mentions légales · Le Combat d'Alya",
  description: "Mentions légales du site Le Combat d'Alya.",
  robots: { index: true, follow: false },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Mentions légales" },
          ]}
          eyebrow="Informations légales"
          title={
            <>
              Mentions <span className="italic">légales</span>.
            </>
          }
          intro="Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique."
          meta="Dernière mise à jour : 19 mai 2026"
        />

        <LegalLayout>
          <LegalSection title="Éditeur du site" id="editeur">
            <LegalDl
              entries={[
                { term: "Association", value: ORG.name },
                {
                  term: "Forme juridique",
                  value: "Association loi 1901, à but non lucratif",
                },
                { term: "Siège social", value: ORG.address },
                {
                  term: "N° RNA",
                  value: ORG.rna,
                },
                {
                  term: "SIRET",
                  value: ORG.siret,
                },
                {
                  term: "Directeur de publication",
                  value: ORG.publicationDirector,
                },
                {
                  term: "Contact",
                  value: (
                    <a
                      href={`mailto:${ORG.email}`}
                      className="hover:text-secondary transition-colors"
                    >
                      {ORG.email}
                    </a>
                  ),
                },
              ]}
            />
            <p>
              L&apos;association est reconnue d&apos;intérêt général. À ce
              titre, les dons consentis ouvrent droit à une réduction
              d&apos;impôt de 66 % de leur montant dans la limite de 20 % du
              revenu imposable (article 200 du Code général des impôts).
            </p>
          </LegalSection>

          <LegalSection title="Hébergement" id="hebergement">
            <LegalDl
              entries={[
                { term: "Hébergeur", value: "Vercel Inc." },
                {
                  term: "Adresse",
                  value: "440 N Barranca Ave #4133, Covina, CA 91723, USA",
                },
                {
                  term: "Site web",
                  value: (
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-secondary transition-colors"
                    >
                      vercel.com
                    </a>
                  ),
                },
              ]}
            />
          </LegalSection>

          <LegalSection title="Propriété intellectuelle" id="propriete">
            <p>
              L&apos;ensemble de ce site relève de la législation française et
              internationale sur le droit d&apos;auteur et la propriété
              intellectuelle. Tous les droits de reproduction sont réservés, y
              compris pour les documents téléchargeables et les
              représentations iconographiques et photographiques.
            </p>
            <p>
              La reproduction de tout ou partie de ce site sur un support
              électronique quel qu&apos;il soit est formellement interdite
              sauf autorisation expresse du directeur de publication.
            </p>
          </LegalSection>

          <LegalSection title="Liens hypertextes" id="liens">
            <p>
              Le site peut contenir des liens vers d&apos;autres sites
              internet ou ressources disponibles sur internet. Le Combat
              d&apos;Alya ne dispose d&apos;aucun moyen pour contrôler ces
              sites externes et ne peut être tenu responsable de leur contenu.
            </p>
            <p>
              La création de liens vers le site lecombatdalya.fr est
              autorisée, à condition qu&apos;ils ne portent pas atteinte aux
              intérêts de l&apos;association et qu&apos;ils précisent la
              source.
            </p>
          </LegalSection>

          <LegalSection title="Paiement et dons" id="dons">
            <p>
              Les dons effectués via ce site sont collectés par{" "}
              <strong className="text-on-surface">HelloAsso</strong>,
              partenaire de paiement de l&apos;association. HelloAsso est
              édité par la société HelloAsso, société par actions simplifiée
              au capital de 32 350 €, immatriculée au RCS de Bordeaux sous le
              numéro 521 788 308.
            </p>
            <p>
              Les reçus fiscaux (CERFA n° 11580*04) sont émis et envoyés
              automatiquement par HelloAsso à l&apos;adresse email indiquée
              lors du don.
            </p>
          </LegalSection>

          <LegalSection title="Données personnelles" id="donnees">
            <p>
              Pour toute information sur la collecte et le traitement de vos
              données personnelles, consultez notre{" "}
              <Link
                href="/confidentialite"
                className="text-secondary hover:underline underline-offset-4"
              >
                politique de confidentialité
              </Link>
              .
            </p>
          </LegalSection>

          <LegalSection title="Crédits" id="credits">
            <p>
              Design &amp; développement : équipe bénévole du Combat
              d&apos;Alya. Typographies : Newsreader &amp; Manrope (Google
              Fonts).
            </p>
          </LegalSection>
        </LegalLayout>
      </main>
      <Footer />
    </>
  );
}
