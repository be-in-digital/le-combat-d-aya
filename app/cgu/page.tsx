import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { LegalLayout, LegalSection } from "@/components/legal-layout";
import { ORG } from "@/components/site-data";
import { sanityFetch } from "@/sanity/fetch";
import { legalPageBySlugQuery } from "@/sanity/queries";
import type { LegalPage } from "@/sanity/types";
import { buildMetadata } from "@/lib/seo";
import { PortableProse } from "@/components/portable-text";

const SLUG = "cgu";
const FALLBACK_TITLE = "Conditions générales d'utilisation · Le Combat d'Alya";
const FALLBACK_DESCRIPTION =
  "Conditions générales d'utilisation du site Le Combat d'Alya.";

function getLegalPage() {
  return sanityFetch<LegalPage | null>({
    query: legalPageBySlugQuery,
    params: { slug: SLUG },
    tags: ["legalPage", `legalPage:${SLUG}`],
  });
}

function formatLastUpdated(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage();
  return {
    ...buildMetadata({
      seo: doc?.seo,
      title: doc?.title ?? FALLBACK_TITLE,
      description: doc?.intro ?? FALLBACK_DESCRIPTION,
      path: `/${SLUG}`,
    }),
    robots: { index: true, follow: false },
  };
}

export default async function CguPage() {
  const doc = await getLegalPage();

  if (doc?.body?.length) {
    const lastUpdated = formatLastUpdated(doc.lastUpdated);
    return (
      <>
        <Nav />
        <main>
          <PageHero
            breadcrumbs={[
              { label: "Accueil", href: "/" },
              { label: "CGU" },
            ]}
            eyebrow="Conditions générales"
            title={doc.title}
            intro={doc.intro ?? undefined}
            meta={
              lastUpdated ? `Dernière mise à jour : ${lastUpdated}` : undefined
            }
          />
          <LegalLayout>
            <PortableProse value={doc.body} />
          </LegalLayout>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "CGU" },
          ]}
          eyebrow="Conditions générales"
          title={
            <>
              Conditions <span className="italic">d&apos;utilisation</span>.
            </>
          }
          intro={
            <>
              Les présentes conditions régissent l&apos;utilisation du site{" "}
              <span className="font-serif italic text-on-surface">
                lecombatdalya.org
              </span>{" "}
              édité par l&apos;association {ORG.name}.
            </>
          }
          meta="Dernière mise à jour : 19 mai 2026"
        />

        <LegalLayout>
          <LegalSection title="Objet" id="objet">
            <p>
              Le site lecombatdalya.org a pour objet de présenter
              l&apos;association {ORG.name}, ses missions, ses campagnes en
              cours et de permettre la collecte de dons via la plateforme
              partenaire HelloAsso.
            </p>
            <p>
              L&apos;accès au site est libre et gratuit. Toute consultation du
              site implique l&apos;acceptation pleine et entière des
              présentes conditions.
            </p>
          </LegalSection>

          <LegalSection title="Accès au site" id="acces">
            <p>
              Le site est accessible 7 jours sur 7, 24 heures sur 24, sauf en
              cas de force majeure ou d&apos;événement hors du contrôle de
              l&apos;association, et sous réserve des éventuelles opérations
              de maintenance.
            </p>
            <p>
              L&apos;association se réserve la possibilité d&apos;interrompre,
              de suspendre ou de limiter l&apos;accès au site, sans préavis,
              à tout moment.
            </p>
          </LegalSection>

          <LegalSection title="Dons et paiement" id="dons">
            <p>
              Les dons sont collectés via la plateforme HelloAsso. Les
              conditions générales de HelloAsso s&apos;appliquent à toute
              transaction effectuée via leur interface.
            </p>
            <p>
              Les reçus fiscaux (CERFA n° 11580*04) sont émis automatiquement
              par HelloAsso et envoyés à l&apos;adresse email indiquée. En
              cas de problème, contactez{" "}
              <a
                href={`mailto:${ORG.email}`}
                className="text-secondary hover:underline underline-offset-4"
              >
                {ORG.email}
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection title="Propriété intellectuelle" id="propriete">
            <p>
              Les textes, photographies, illustrations, vidéos, logos,
              marques et tout autre contenu présent sur ce site sont la
              propriété exclusive de l&apos;association ou de ses partenaires
              et sont protégés par le droit d&apos;auteur.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication
              ou adaptation, totale ou partielle, est interdite sans
              autorisation préalable et écrite.
            </p>
          </LegalSection>

          <LegalSection title="Données personnelles" id="donnees">
            <p>
              La collecte et le traitement des données personnelles sont
              décrits dans notre{" "}
              <Link
                href="/confidentialite"
                className="text-secondary hover:underline underline-offset-4"
              >
                politique de confidentialité
              </Link>
              . En naviguant sur ce site, vous reconnaissez en avoir pris
              connaissance.
            </p>
          </LegalSection>

          <LegalSection title="Liens hypertextes" id="liens">
            <p>
              Le site peut contenir des liens vers des sites tiers (HelloAsso,
              partenaires, médias). L&apos;association n&apos;exerce aucun
              contrôle sur ces sites et décline toute responsabilité quant à
              leur contenu, leur disponibilité ou les conséquences de leur
              utilisation.
            </p>
          </LegalSection>

          <LegalSection title="Responsabilité" id="responsabilite">
            <p>
              L&apos;association s&apos;efforce de fournir des informations
              aussi précises que possible. Toutefois, elle ne saurait être
              tenue responsable des omissions, des inexactitudes ou des
              carences dans la mise à jour, qu&apos;elles soient de son fait
              ou du fait de tiers partenaires.
            </p>
            <p>
              L&apos;utilisateur reconnaît utiliser le site sous sa
              responsabilité exclusive et garantit l&apos;association contre
              toute action dirigée contre elle du fait d&apos;un usage
              inapproprié du site.
            </p>
          </LegalSection>

          <LegalSection title="Modification des CGU" id="modification">
            <p>
              L&apos;association se réserve le droit de modifier les
              présentes conditions à tout moment. Les modifications entrent
              en vigueur dès leur publication sur le site. Il est conseillé
              de les consulter régulièrement.
            </p>
          </LegalSection>

          <LegalSection title="Loi applicable et juridiction" id="loi">
            <p>
              Les présentes conditions sont régies par le droit français. En
              cas de litige et à défaut de résolution amiable, les tribunaux
              français seront seuls compétents.
            </p>
          </LegalSection>

          <LegalSection title="Contact" id="contact">
            <p>
              Pour toute question relative aux présentes conditions :{" "}
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
              </Link>{" "}
              et la{" "}
              <Link
                href="/confidentialite"
                className="text-secondary hover:underline underline-offset-4"
              >
                politique de confidentialité
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
