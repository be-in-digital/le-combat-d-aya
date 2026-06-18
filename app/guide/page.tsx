import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { FadeUp, Stagger, StaggerItem } from "@/components/anim";

export const metadata: Metadata = {
  title: "Guide d'utilisation · Le Combat d'Alya",
  description:
    "Tutoriels pour gérer le contenu du site dans Sanity et contacter Be In Digital.",
  // Editor-facing page — keep it out of search engines.
  robots: { index: false, follow: false },
};

type Tutorial = {
  id: string;
  n: string;
  title: string;
  desc: string;
  steps: string[];
};

const TUTORIALS: Tutorial[] = [
  {
    id: "bienvenue",
    n: "00",
    title: "Bienvenue — comment ça marche",
    desc: "Votre site est piloté par un CMS (Sanity). Vous modifiez le contenu, le site se met à jour tout seul.",
    steps: [
      "Le contenu (textes, images, vidéos) vit dans Sanity — pas besoin de toucher au code.",
      "L'éditeur est accessible à l'adresse votre-site.fr/studio.",
      "Connectez-vous avec votre compte (Google ou e-mail).",
      "Le menu de gauche regroupe les Pages et les contenus (Articles, Campagnes, Témoignages…).",
    ],
  },
  {
    id: "modifier-texte",
    n: "01",
    title: "Modifier un texte",
    desc: "Changer un titre, une introduction ou n'importe quel texte d'une page.",
    steps: [
      "Dans /studio, cliquez sur la page à modifier (ex. Accueil).",
      "Cliquez dans le champ à changer (ex. Titre).",
      "Saisissez votre nouveau texte.",
      "Cliquez sur « Publier » en haut à droite pour mettre en ligne.",
    ],
  },
  {
    id: "images-videos",
    n: "02",
    title: "Ajouter une image ou une vidéo",
    desc: "Importer une photo, renseigner son texte alternatif, et insérer une vidéo.",
    steps: [
      "Repérez le champ Image, cliquez puis « Importer » votre fichier.",
      "Ajoutez un texte alternatif (description) — important pour l'accessibilité et le SEO.",
      "Pour une vidéo : choisissez la source — lien YouTube/Vimeo ou fichier importé.",
      "Collez le lien (ou importez le fichier), puis publiez.",
    ],
  },
  {
    id: "publier-preview",
    n: "03",
    title: "Publier & prévisualiser",
    desc: "Comprendre les brouillons, prévisualiser le rendu réel, puis mettre en ligne.",
    steps: [
      "Vos modifications sont d'abord enregistrées en « Brouillon » — rien n'est public.",
      "Cliquez sur « Aperçu » (Presentation) pour voir le rendu réel avant publication.",
      "Quand tout est bon, cliquez sur « Publier ».",
      "Le site se met à jour automatiquement en quelques instants.",
    ],
  },
  {
    id: "ajouter-article",
    n: "04",
    title: "Ajouter une actualité",
    desc: "Créer un article qui apparaîtra sur la page Actualités.",
    steps: [
      "Dans le menu, ouvrez « Articles » puis cliquez sur le bouton +.",
      "Renseignez le titre et le chapeau.",
      "Ajoutez une image de couverture (avec son texte alternatif).",
      "Rédigez le contenu ; cochez « À la une » pour le mettre en avant.",
      "Publiez : l'article apparaît sur /actualités, le plus récent en premier.",
    ],
  },
];

export default function GuidePage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[{ label: "Accueil", href: "/" }, { label: "Guide" }]}
          eyebrow="Espace éditeur"
          title={
            <>
              Gérer votre site,
              <br />
              en <span className="italic">autonomie</span>.
            </>
          }
          intro="Des tutoriels vidéo, pas à pas, pour modifier le contenu de votre site dans Sanity — et nous joindre en cas de besoin."
          meta="Guide d'utilisation"
        />

        {/* Quick start */}
        <section className="px-6 md:px-10 pb-8 md:pb-12">
          <FadeUp className="max-w-screen-2xl mx-auto">
            <div className="bg-surface-container-low rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3">
                  Pour commencer
                </p>
                <h2 className="font-serif text-primary text-2xl md:text-4xl leading-tight">
                  Tout se passe dans l&apos;éditeur, sur{" "}
                  <span className="italic">/studio</span>.
                </h2>
                <p className="text-on-surface-variant mt-4 leading-relaxed">
                  Connectez-vous, modifiez, cliquez sur « Publier ». Les vidéos
                  ci-dessous détaillent chaque geste.
                </p>
              </div>
              <a
                href="/studio"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-8 py-4 rounded-full font-bold text-base inline-flex items-center justify-center gap-3 shadow-[0_12px_32px_-8px_rgba(184,0,75,0.4)] hover:scale-[1.03] transition-transform"
              >
                <Icon name="edit_square" filled />
                Ouvrir l&apos;éditeur
              </a>
            </div>
          </FadeUp>
        </section>

        {/* Tutorials */}
        <section className="px-6 md:px-10 py-12 md:py-20">
          <div className="max-w-screen-2xl mx-auto space-y-16 md:space-y-24">
            {TUTORIALS.map((t, idx) => (
              <FadeUp key={t.id}>
                <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
                  <div
                    className={`lg:col-span-7 ${idx % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <div className="rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-outline-variant/30 shadow-[0_24px_60px_-30px_rgba(184,0,75,0.4)] bg-black">
                      <video
                        controls
                        preload="metadata"
                        playsInline
                        className="w-full h-auto block"
                      >
                        <source src={`/tutorials/${t.id}.mp4`} type="video/mp4" />
                        Votre navigateur ne peut pas lire cette vidéo.
                      </video>
                    </div>
                  </div>
                  <div
                    className={`lg:col-span-5 ${idx % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <div className="font-serif italic text-secondary text-4xl md:text-5xl leading-none mb-4">
                      {t.n}
                    </div>
                    <h3 className="font-serif text-primary text-2xl md:text-3xl leading-tight mb-3">
                      {t.title}
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed mb-6">
                      {t.desc}
                    </p>
                    <Stagger staggerDelay={0.06} className="space-y-3">
                      {t.steps.map((s, i) => (
                        <StaggerItem key={i} className="flex items-start gap-3">
                          <span className="shrink-0 w-6 h-6 rounded-full bg-secondary-fixed text-secondary text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-on-surface leading-relaxed">
                            {s}
                          </span>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* Contact Be In Digital */}
        <section className="px-6 md:px-10 pb-20 md:pb-28">
          <FadeUp className="max-w-screen-2xl mx-auto">
            <div className="bg-primary text-on-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center overflow-hidden">
              <div className="lg:col-span-7">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary-fixed font-semibold mb-4">
                  Besoin d&apos;aide ?
                </p>
                <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-5">
                  Une question ? Contactez{" "}
                  <span className="italic">Be In Digital</span>.
                </h2>
                <p className="text-on-primary/80 leading-relaxed max-w-xl">
                  Nous avons conçu votre site et restons à vos côtés : évolution,
                  question technique, accompagnement. Décrivez votre besoin, on
                  s&apos;occupe du reste.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href="https://beindigital.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-on-primary hover:text-secondary-fixed transition-colors"
                  >
                    <span className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center">
                      <Icon name="public" className="text-lg" />
                    </span>
                    <span className="font-semibold tracking-wide">beindigital.fr</span>
                  </a>
                  {/* TODO Be In Digital : renseigner l'email et le téléphone à afficher */}
                  <div className="inline-flex items-center gap-3 text-on-primary/60">
                    <span className="w-10 h-10 rounded-full bg-on-primary/10 flex items-center justify-center">
                      <Icon name="mail" className="text-lg" />
                    </span>
                    <span className="italic font-serif">
                      Email &amp; téléphone : à renseigner
                    </span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5 flex lg:justify-end">
                <a
                  href="https://beindigital.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary-fixed text-secondary px-8 py-4 rounded-full font-bold text-base inline-flex items-center justify-center gap-3 hover:scale-[1.03] transition-transform"
                >
                  <Icon name="favorite" filled />
                  Nous contacter
                </a>
              </div>
            </div>
          </FadeUp>
        </section>
      </main>
      <Footer />
    </>
  );
}
