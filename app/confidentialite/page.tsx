import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { LegalLayout, LegalSection, LegalDl } from "@/components/legal-layout";
import { ORG } from "@/components/site-data";

export const metadata: Metadata = {
  title: "Politique de confidentialité · Le Combat d'Alya",
  description:
    "Comment Le Combat d'Alya collecte et protège vos données personnelles.",
  robots: { index: true, follow: false },
};

export default function ConfidentialitePage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Confidentialité" },
          ]}
          eyebrow="RGPD · Vos données"
          title={
            <>
              Politique de <span className="italic">confidentialité</span>.
            </>
          }
          intro="Conforme au Règlement (UE) 2016/679 (RGPD) et à la loi française Informatique et Libertés modifiée."
          meta="Dernière mise à jour : 19 mai 2026"
        />

        <LegalLayout>
          <LegalSection title="Responsable du traitement" id="responsable">
            <LegalDl
              entries={[
                { term: "Responsable", value: ORG.name },
                { term: "Siège social", value: ORG.address },
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
              L&apos;association {ORG.name} s&apos;engage à protéger vos
              données personnelles. Cette politique décrit quelles données
              sont collectées, pour quelles raisons, combien de temps elles
              sont conservées et quels sont vos droits.
            </p>
          </LegalSection>

          <LegalSection title="Données collectées" id="donnees">
            <p>Nous collectons uniquement les données strictement nécessaires :</p>
            <ul className="list-none space-y-3 pl-0">
              {[
                {
                  k: "Formulaire de contact",
                  v: "Prénom, nom, email, sujet, message — pour vous répondre.",
                },
                {
                  k: "Newsletter",
                  v: "Adresse email — pour vous envoyer notre lettre mensuelle.",
                },
                {
                  k: "Dons (via HelloAsso)",
                  v: "Identité, email, adresse, coordonnées de paiement — collectées et traitées directement par HelloAsso. Nous ne stockons aucune donnée bancaire.",
                },
                {
                  k: "Données techniques",
                  v: "Aucune. Pas de cookie de traçage. Pas d'analytics.",
                },
              ].map((d) => (
                <li
                  key={d.k}
                  className="flex flex-col sm:flex-row gap-1 sm:gap-4 bg-surface-container-low rounded-2xl p-5"
                >
                  <span className="text-xs uppercase tracking-[0.25em] text-on-surface-variant font-semibold sm:w-48 flex-shrink-0 pt-1">
                    {d.k}
                  </span>
                  <span className="text-on-surface">{d.v}</span>
                </li>
              ))}
            </ul>
          </LegalSection>

          <LegalSection title="Finalités &amp; bases légales" id="finalites">
            <ul className="space-y-3 list-disc pl-6">
              <li>
                <strong className="text-on-surface">
                  Répondre à votre demande
                </strong>{" "}
                (formulaire de contact) — base légale : exécution d&apos;une
                mesure à votre demande.
              </li>
              <li>
                <strong className="text-on-surface">
                  Vous tenir informé(e)
                </strong>{" "}
                (newsletter) — base légale : votre consentement libre et
                explicite, révocable à tout moment.
              </li>
              <li>
                <strong className="text-on-surface">Émettre un reçu fiscal</strong>{" "}
                (dons) — base légale : obligation légale (article 200 du CGI).
              </li>
            </ul>
          </LegalSection>

          <LegalSection title="Durée de conservation" id="duree">
            <LegalDl
              entries={[
                { term: "Contact form", value: "3 ans après le dernier échange" },
                {
                  term: "Newsletter",
                  value: "Jusqu'à votre désinscription",
                },
                {
                  term: "Dons",
                  value: "10 ans (obligation comptable)",
                },
              ]}
            />
          </LegalSection>

          <LegalSection title="Destinataires &amp; sous-traitants" id="destinataires">
            <p>
              Vos données ne sont jamais cédées ni vendues à des tiers. Elles
              peuvent être traitées par les sous-traitants techniques
              suivants :
            </p>
            <LegalDl
              entries={[
                {
                  term: "Resend",
                  value:
                    "Envoi des emails (contact, newsletter). Hébergé en Union européenne.",
                },
                {
                  term: "HelloAsso",
                  value:
                    "Collecte des dons et émission des reçus fiscaux. Société française, données hébergées en UE.",
                },
                {
                  term: "Vercel",
                  value:
                    "Hébergement du site. Transferts vers les États-Unis encadrés par les clauses contractuelles types (CCT).",
                },
                {
                  term: "Sentry",
                  value:
                    "Monitoring d'erreurs techniques. Aucune donnée personnelle identifiable n'est transmise.",
                },
              ]}
            />
          </LegalSection>

          <LegalSection title="Vos droits" id="droits">
            <p>
              Conformément au RGPD, vous disposez à tout moment des droits
              suivants :
            </p>
            <ul className="space-y-2 list-disc pl-6">
              <li>Droit d&apos;accès à vos données</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l&apos;effacement (« droit à l&apos;oubli »)</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité de vos données</li>
              <li>Droit d&apos;opposition</li>
              <li>Droit de retirer votre consentement à tout moment</li>
              <li>
                Droit d&apos;introduire une réclamation auprès de la CNIL{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline underline-offset-4"
                >
                  (cnil.fr)
                </a>
              </li>
            </ul>
            <p>
              Pour exercer vos droits, écrivez-nous à{" "}
              <a
                href={`mailto:${ORG.email}`}
                className="text-secondary hover:underline underline-offset-4"
              >
                {ORG.email}
              </a>{" "}
              en précisant votre demande. Nous répondons sous 30 jours
              maximum.
            </p>
          </LegalSection>

          <LegalSection title="Cookies" id="cookies">
            <p>
              Ce site ne dépose <strong className="text-on-surface">aucun cookie</strong>{" "}
              de traçage ni d&apos;analyse. Seuls les cookies strictement
              nécessaires au fonctionnement de l&apos;iframe HelloAsso (lors
              d&apos;un don) sont déposés par HelloAsso directement, sous sa
              propre responsabilité.
            </p>
          </LegalSection>

          <LegalSection title="Modifications" id="modifications">
            <p>
              Cette politique peut être mise à jour. La date de dernière
              modification est indiquée en haut de cette page. Pour toute
              question, contactez-nous à{" "}
              <a
                href={`mailto:${ORG.email}`}
                className="text-secondary hover:underline underline-offset-4"
              >
                {ORG.email}
              </a>
              .
            </p>
            <p>
              Voir aussi les{" "}
              <Link
                href="/mentions-legales"
                className="text-secondary hover:underline underline-offset-4"
              >
                mentions légales
              </Link>
              .
            </p>
          </LegalSection>
        </LegalLayout>
      </main>
      <Footer />
    </>
  );
}
