/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { VideoPlayer } from "@/components/video-player";
import { PortableProse } from "@/components/portable-text";
import {
  FadeUp,
  ImageReveal,
  Stagger,
  StaggerItem,
} from "@/components/anim";
import { sanityFetch } from "@/sanity/fetch";
import { storyPageQuery } from "@/sanity/queries";
import type { GalleryItem, StoryPage } from "@/sanity/types";
import { buildMetadata } from "@/lib/seo";

const FALLBACK_DESCRIPTION =
  "Découvrez l'histoire de la famille d'Alya et la naissance de l'association.";

export async function generateMetadata(): Promise<Metadata> {
  const story = await sanityFetch<StoryPage | null>({
    query: storyPageQuery,
    tags: ["storyPage"],
  });

  return buildMetadata({
    seo: story?.seo,
    title: story?.hero?.title ?? "Notre histoire",
    description: story?.hero?.intro ?? FALLBACK_DESCRIPTION,
    path: "/histoire",
  });
}

const HERO_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg/v1/fill/w_1066,h_740,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg";
const PORTRAIT_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b288a16560794a2a9e6cf5122dd22d69~mv2.jpg/v1/fill/w_780,h_1124,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-07-12%20%C3%A0%2014_30_08_ba15ba8b.jpg";

const TIMELINE = [
  {
    year: "2018",
    title: "La naissance d'Alya",
    text: "Alya voit le jour en mai 2018. Une petite fille pleine de vie, de rires et de curiosité.",
  },
  {
    year: "2019",
    title: "Naissance de l'association",
    text: "En janvier 2019, Le Combat d'Alya est officiellement créé pour financer les soins d'Alya et tendre la main aux familles confrontées au même parcours.",
  },
  {
    year: "2019‑25",
    title: "Des soins sans frontières",
    text: "Rééducation intensive en Espagne au centre Aléas — d'abord à Barcelone, aujourd'hui à Blanes —, jusqu'à trois fois par an. Matériel médical pour Alya, financement d'un véhicule adapté (PMR), et envoi de matériel médical à l'étranger pour des enfants lourdement handicapés.",
  },
  {
    year: "2025",
    title: "Premier protocole au Mexique",
    text: "En décembre 2025, l'association finance un premier protocole médical innovant au Mexique pour Alya.",
  },
  {
    year: "2026",
    title: "La campagne Cytotron",
    text: "La campagne en cours finance un second protocole médical au Mexique : le Cytotron. L'aventure ne fait que commencer.",
  },
];

const VALUES = [
  {
    icon: "favorite",
    title: "Bienveillance",
    text: "Aucune famille ne devrait traverser cela seule. Notre première mission est l'écoute, sans jugement et sans condition.",
  },
  {
    icon: "lock_open",
    title: "Transparence",
    text: "Chaque euro est tracé, chaque décision est expliquée. Nous publions chaque année un rapport d'activité complet.",
  },
  {
    icon: "diversity_3",
    title: "Collectif",
    text: "Notre force vient de la communauté : parents, soignants, donateurs, bénévoles. Personne n'avance seul.",
  },
];

// Outer tile class for each bento slot, in order. Sanity gallery items are
// mapped onto these slots so the layout matches the hardcoded fallback.
const GALLERY_SLOTS = [
  "col-span-2 md:col-span-5 md:row-span-5 aspect-[4/5] md:aspect-auto",
  "col-span-2 md:col-span-4 md:row-span-2 aspect-[5/3] md:aspect-auto",
  "col-span-2 md:col-span-3 md:row-span-3 aspect-[5/4] md:aspect-auto",
  "col-span-1 md:col-span-4 md:row-span-2 aspect-square md:aspect-auto",
  "col-span-1 md:col-span-3 md:row-span-2 aspect-square md:aspect-auto",
  "col-span-2 md:col-span-4 md:row-span-1",
];

function GalleryTile({
  item,
  slotClass,
  index,
}: {
  item: GalleryItem;
  slotClass: string;
  index: number;
}) {
  if (item._type === "quoteCard") {
    return (
      <StaggerItem
        className={`${slotClass} bg-secondary text-on-secondary p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between relative overflow-hidden`}
      >
        <Icon
          name="format_quote"
          filled
          className="text-white text-5xl md:text-6xl opacity-80 -ml-1"
        />
        <div>
          <p className="font-serif italic text-white text-lg md:text-2xl leading-snug">
            &ldquo;{item.quote}&rdquo;
          </p>
          {item.author && (
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-semibold mt-3 md:mt-4">
              — {item.author}
            </p>
          )}
        </div>
      </StaggerItem>
    );
  }

  if (item._type === "videoEmbed") {
    return (
      <StaggerItem className={slotClass}>
        <VideoPlayer video={item} className="w-full h-full" />
      </StaggerItem>
    );
  }

  // figure
  return (
    <StaggerItem
      className={`${slotClass} overflow-hidden rounded-[1.5rem] md:rounded-[2rem] relative group`}
    >
      {item.url && (
        <img
          src={item.url}
          alt={item.alt ?? ""}
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
      <span className="absolute top-3 right-3 md:top-4 md:right-4 bg-background/85 backdrop-blur-sm text-primary text-[10px] uppercase tracking-[0.3em] font-semibold px-2.5 py-1 rounded-full">
        Cliché · {String(index + 1).padStart(2, "0")}
      </span>
      {item.caption && (
        <p className="absolute bottom-3 left-3 md:bottom-5 md:left-5 font-serif italic text-white text-sm md:text-lg leading-snug pr-12">
          {item.caption}
        </p>
      )}
    </StaggerItem>
  );
}

export default async function HistoirePage() {
  const story = await sanityFetch<StoryPage | null>({
    query: storyPageQuery,
    tags: ["storyPage"],
  });

  const hero = story?.hero;
  const parents = story?.parentsWord;
  const timeline = story?.timeline?.length ? story.timeline : TIMELINE;
  const values = story?.values?.length ? story.values : VALUES;
  const gallery = story?.gallery?.length ? story.gallery : null;
  const cta = story?.cta;

  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Notre histoire" },
          ]}
          eyebrow={hero?.eyebrow ?? "Notre histoire"}
          title={
            hero?.title ? (
              <>
                {hero.title}
                {hero.titleAccent && (
                  <>
                    {" "}
                    <span className="italic">{hero.titleAccent}</span>
                  </>
                )}
              </>
            ) : (
              <>
                Un combat qui a commencé
                <br />
                par <span className="italic">un sourire</span>.
              </>
            )
          }
          intro={
            hero?.intro ??
            "Une famille, un diagnostic, une décision : transformer l'épreuve en mouvement. Voici comment l'aventure du Combat d'Alya a commencé."
          }
          meta={hero?.meta ?? "Édition Printemps · No. 03"}
        />

        {/* Photo + introduction */}
        <section className="py-16 md:py-24 px-6 md:px-10 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <FadeUp className="lg:col-span-7 order-2 lg:order-1">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-6">
                {parents?.eyebrow ?? "Le mot des parents"}
              </p>
              <p className="font-serif italic text-primary text-2xl md:text-4xl lg:text-5xl leading-snug mb-8 md:mb-10">
                <span className="text-secondary text-5xl md:text-6xl mr-1">
                  &ldquo;
                </span>
                {parents?.quote ?? (
                  <>
                    Quand le diagnostic est tombé, le monde s&apos;est arrêté.
                    Puis nous avons décidé que ce serait le début d&apos;autre
                    chose.
                  </>
                )}
                &rdquo;
              </p>
              {parents?.body?.length ? (
                <PortableProse
                  value={parents.body}
                  className="space-y-5 md:space-y-6 text-base md:text-lg text-on-surface-variant leading-relaxed"
                />
              ) : (
                <div className="space-y-5 md:space-y-6 text-base md:text-lg text-on-surface-variant leading-relaxed">
                  <p>
                    Alya est née en mai 2018. Une petite fille pleine de vie, de
                    rires, d&apos;observation. Très tôt, le diagnostic tombe :
                    une maladie rare, peu connue, mal financée par la recherche
                    publique.
                  </p>
                  <p>
                    Face à l&apos;impasse, nous avons cherché ailleurs. Des
                    protocoles innovants à l&apos;étranger, des équipements
                    adaptés, des programmes de stimulation cognitive. Tout coûte
                    cher, tout demande du temps.
                  </p>
                  <p>
                    Nous avons rapidement compris que d&apos;autres familles
                    vivaient le même parcours du combattant, le même isolement.
                    L&apos;association est née de cette évidence : ce que nous
                    apprenons doit servir à toutes les Alyas du pays.
                  </p>
                </div>
              )}
              <div className="mt-10 flex items-center gap-4 md:gap-6 flex-wrap">
                <div className="font-serif italic text-2xl md:text-3xl text-primary">
                  — {parents?.signature ?? "Mariam Nassar"}
                </div>
                <div className="flex-1 h-px bg-outline-variant/40 min-w-[40px]" />
                <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                  {parents?.role ?? "Fondatrice"}
                </span>
              </div>
            </FadeUp>
            <div className="lg:col-span-5 order-1 lg:order-2 relative">
              <ImageReveal direction="right">
                <div className="aspect-[4/5] rounded-tl-[2rem] md:rounded-tl-[5rem] rounded-tr-[1rem] md:rounded-tr-[2rem] rounded-bl-[1rem] md:rounded-bl-[2rem] rounded-br-[2rem] md:rounded-br-[5rem] overflow-hidden -rotate-2">
                  <img
                    alt={parents?.image?.alt ?? "Famille d'Alya"}
                    src={parents?.image?.url ?? HERO_IMAGE}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </ImageReveal>
              <FadeUp
                delay={0.5}
                className="absolute -top-4 -right-2 md:-top-6 md:-right-6 rotate-3"
              >
                <div className="bg-secondary-fixed text-on-secondary-fixed font-serif italic text-xs md:text-sm px-4 md:px-5 py-2 md:py-3 rounded-full">
                  {parents?.imageBadge ?? "Famille d'Alya · 2026"}
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 md:py-36 px-6 md:px-10 bg-background">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 md:mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                {story?.timelineHeading?.eyebrow ?? "Chronologie"}
              </p>
              <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.02]">
                {story?.timelineHeading?.title ?? (
                  <>
                    <span className="italic">De 2018</span> à aujourd&apos;hui.
                  </>
                )}
              </h2>
            </div>

            <Stagger
              staggerDelay={0.15}
              className="relative space-y-10 md:space-y-16 md:pl-12 md:before:absolute md:before:left-[7px] md:before:top-2 md:before:bottom-2 md:before:w-px md:before:bg-outline-variant/40"
            >
              {timeline.map((item, idx) => (
                <StaggerItem
                  key={`${item.year}-${idx}`}
                  className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start"
                >
                  <span className="hidden md:block absolute -left-[48px] top-2 w-4 h-4 rounded-full bg-secondary ring-4 ring-background" />
                  <div className="md:col-span-3">
                    <div className="font-serif italic text-secondary text-5xl md:text-7xl leading-none">
                      {item.year}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-semibold mt-2 block">
                      Étape {String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="md:col-span-9 md:pt-3">
                    <h3 className="font-serif text-primary text-2xl md:text-3xl mb-3 md:mb-4">
                      {item.title}
                    </h3>
                    <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 md:py-36 px-6 md:px-10 bg-surface-container">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                {story?.valuesHeading?.eyebrow ?? "Nos valeurs"}
              </p>
              <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.05]">
                {story?.valuesHeading?.title ?? (
                  <>
                    Ce qui nous <span className="italic">guide</span>.
                  </>
                )}
              </h2>
            </div>

            <Stagger
              staggerDelay={0.12}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8"
            >
              {values.map((v, idx) => (
                <StaggerItem
                  key={`${v.title ?? "value"}-${idx}`}
                  className="bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center">
                      <Icon
                        name={v.icon ?? "favorite"}
                        filled
                        className="text-2xl md:text-3xl"
                      />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-semibold">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-primary text-2xl md:text-3xl mb-4">
                    {v.title}
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed">
                    {v.text}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Photo gallery */}
        <section className="py-20 md:py-36 px-6 md:px-10 bg-background">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3 md:mb-4">
                  {story?.galleryHeading?.eyebrow ?? "Album de famille"}
                </p>
                <h2 className="font-serif text-primary text-3xl md:text-5xl leading-tight">
                  {story?.galleryHeading?.title ?? (
                    <>
                      Moments <span className="italic">choisis</span>.
                    </>
                  )}
                </h2>
              </div>
              <p className="text-on-surface-variant font-serif italic text-base md:text-lg max-w-sm">
                {story?.galleryHeading?.note ??
                  "Quelques instants de l'aventure, partagés avec ceux qui la portent."}
              </p>
            </div>

            <Stagger
              staggerDelay={0.08}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-5 md:auto-rows-[130px] lg:auto-rows-[160px]"
            >
              {gallery ? (
                gallery
                  .slice(0, GALLERY_SLOTS.length)
                  .map((item, idx) => (
                    <GalleryTile
                      key={item._key}
                      item={item}
                      slotClass={GALLERY_SLOTS[idx]}
                      index={idx}
                    />
                  ))
              ) : (
                <>
              {/* 1 — Feature portrait */}
              <StaggerItem className="col-span-2 md:col-span-5 md:row-span-5 aspect-[4/5] md:aspect-auto overflow-hidden rounded-tl-[2rem] rounded-tr-[1.25rem] rounded-bl-[1.25rem] rounded-br-[2rem] md:rounded-tl-[3rem] md:rounded-tr-[1.25rem] md:rounded-bl-[1.25rem] md:rounded-br-[5rem] relative group">
                <img
                  src={PORTRAIT_IMAGE}
                  alt="Portrait d'Alya"
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                  <span className="bg-background/85 backdrop-blur-sm text-primary text-[10px] uppercase tracking-[0.3em] font-semibold px-3 py-1.5 rounded-full">
                    Cliché · 01
                  </span>
                </div>
                <div className="absolute bottom-5 left-5 right-5 md:bottom-7 md:left-7 md:right-7 text-white">
                  <p className="font-serif italic text-xl md:text-3xl leading-tight">
                    Alya, l&apos;éclat du quotidien.
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-80 mt-2 md:mt-3">
                    Montevideo · Printemps 2026
                  </p>
                </div>
              </StaggerItem>

              {/* 2 — Pink quote */}
              <StaggerItem className="col-span-2 md:col-span-4 md:row-span-2 bg-secondary text-on-secondary p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between aspect-[5/3] md:aspect-auto relative overflow-hidden">
                <Icon
                  name="format_quote"
                  filled
                  className="text-white text-5xl md:text-6xl opacity-80 -ml-1"
                />
                <div>
                  <p className="font-serif italic text-white text-lg md:text-2xl leading-snug">
                    &ldquo;Le sourire d&apos;Alya, c&apos;est notre
                    boussole.&rdquo;
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-semibold mt-3 md:mt-4">
                    — Mariam Nassar
                  </p>
                </div>
              </StaggerItem>

              {/* 3 — Edition card */}
              <StaggerItem className="col-span-2 md:col-span-3 md:row-span-3 bg-secondary-fixed text-secondary p-6 md:p-7 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-between aspect-[5/4] md:aspect-auto">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-80">
                    Album
                  </span>
                  <p className="font-serif text-5xl md:text-7xl leading-none mt-2 md:mt-3">
                    N°<span className="italic">03</span>
                  </p>
                </div>
                <div>
                  <div className="h-px bg-secondary/30 mb-4 md:mb-5" />
                  <p className="font-serif italic text-base md:text-xl leading-tight">
                    Printemps 2026 — douze instants captés au vol.
                  </p>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-semibold opacity-70 mt-3 md:mt-4">
                    <Icon name="photo_camera" filled className="text-base" />
                    Édition limitée
                  </div>
                </div>
              </StaggerItem>

              {/* 4 — Wide photo */}
              <StaggerItem className="col-span-1 md:col-span-4 md:row-span-2 aspect-square md:aspect-auto overflow-hidden rounded-[1.5rem] md:rounded-[2rem] relative group">
                <img
                  src={HERO_IMAGE}
                  alt="Famille d'Alya"
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" />
                <span className="absolute top-3 right-3 md:top-4 md:right-4 bg-background/85 backdrop-blur-sm text-primary text-[10px] uppercase tracking-[0.3em] font-semibold px-2.5 py-1 rounded-full">
                  Cliché · 02
                </span>
                <p className="absolute bottom-3 left-3 md:bottom-5 md:left-5 font-serif italic text-white text-sm md:text-lg leading-snug pr-12">
                  En famille, le combat devient un horizon.
                </p>
              </StaggerItem>

              {/* 5 — Small photo */}
              <StaggerItem className="col-span-1 md:col-span-3 md:row-span-2 aspect-square md:aspect-auto overflow-hidden rounded-[1.5rem] md:rounded-[2rem] relative group">
                <img
                  src={PORTRAIT_IMAGE}
                  alt="Alya, regard complice"
                  className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-background/85 backdrop-blur-sm text-primary text-[10px] uppercase tracking-[0.3em] font-semibold px-2.5 py-1 rounded-full">
                  Cliché · 03
                </span>
              </StaggerItem>

              {/* 6 — Caption strip */}
              <StaggerItem className="col-span-2 md:col-span-4 md:row-span-1 bg-surface-container-lowest p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center gap-4 md:gap-5">
                <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                  <Icon name="favorite" filled className="text-xl" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-semibold">
                    Note de l&apos;album
                  </span>
                  <p className="font-serif italic text-primary text-sm md:text-base leading-tight mt-1">
                    Chaque cliché raconte un combat — et chaque combat, une
                    victoire.
                  </p>
                </div>
              </StaggerItem>
                </>
              )}
            </Stagger>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 px-6 md:px-10 bg-surface-container-low">
          <FadeUp className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-6">
              {cta?.eyebrow ?? "Rejoindre l'aventure"}
            </p>
            <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.05] mb-6 md:mb-8">
              {cta?.title ?? (
                <>
                  <span className="italic">Vous aussi</span>, écrivez la suite.
                </>
              )}
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant mb-10 md:mb-12 max-w-xl mx-auto">
              {cta?.text ??
                "Cette histoire est encore en cours d'écriture. Vous pouvez en être les prochains auteurs."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={cta?.primaryCta?.href ?? "/aider"}
                className="bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-8 md:px-10 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 shadow-[0_12px_32px_-8px_rgba(184,0,75,0.4)] hover:scale-[1.03] transition-transform"
              >
                <Icon name="favorite" filled />
                {cta?.primaryCta?.label ?? "Faire un don"}
              </Link>
              <Link
                href={cta?.secondaryCta?.href ?? "/contact"}
                className="bg-transparent text-primary px-8 md:px-10 py-4 rounded-full font-semibold text-base border border-primary/20 hover:bg-surface-container-high transition-colors text-center"
              >
                {cta?.secondaryCta?.label ?? "Nous contacter"}
              </Link>
            </div>
          </FadeUp>
        </section>
      </main>
      <Footer />
    </>
  );
}
