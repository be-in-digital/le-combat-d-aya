/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import {
  FadeUp,
  ImageReveal,
  Stagger,
  StaggerItem,
} from "@/components/anim";

export const metadata: Metadata = {
  title: "Notre histoire · Le Combat d'Alya",
  description:
    "Découvrez l'histoire de la famille d'Alya et la naissance de l'association.",
};

const HERO_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg/v1/fill/w_1066,h_740,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg";
const PORTRAIT_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b288a16560794a2a9e6cf5122dd22d69~mv2.jpg/v1/fill/w_780,h_1124,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-07-12%20%C3%A0%2014_30_08_ba15ba8b.jpg";

const TIMELINE = [
  {
    year: "2023",
    title: "Le diagnostic",
    text: "Tout commence par un diagnostic inattendu. La famille d'Alya cherche désespérément des soins adaptés et découvre l'isolement des maladies rares.",
  },
  {
    year: "2024",
    title: "Naissance de l'association",
    text: "Le Combat d'Alya est officiellement créé. Première campagne de financement lancée auprès des proches, qui mobilise 15 000 € en six semaines.",
  },
  {
    year: "2025",
    title: "Reconnaissance d'intérêt général",
    text: "L'association obtient le statut d'intérêt général. Le réseau s'élargit : premiers partenaires hospitaliers, premiers bénévoles, premiers programmes financés.",
  },
  {
    year: "2026",
    title: "Un mouvement collectif",
    text: "850 familles accompagnées, 15 partenaires engagés, des soins de pointe rendus accessibles. L'aventure ne fait que commencer.",
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

export default function HistoirePage() {
  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Notre histoire" },
          ]}
          eyebrow="Notre histoire"
          title={
            <>
              Un combat qui a commencé
              <br />
              par <span className="italic">un sourire</span>.
            </>
          }
          intro="Une famille, un diagnostic, une décision : transformer l'épreuve en mouvement. Voici comment l'aventure du Combat d'Alya a commencé."
          meta="Édition Printemps · No. 03"
        />

        {/* Photo + introduction */}
        <section className="py-16 md:py-24 px-6 md:px-10 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <FadeUp className="lg:col-span-7 order-2 lg:order-1">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-6">
                Le mot des parents
              </p>
              <p className="font-serif italic text-primary text-2xl md:text-4xl lg:text-5xl leading-snug mb-8 md:mb-10">
                <span className="text-secondary text-5xl md:text-6xl mr-1">
                  &ldquo;
                </span>
                Quand le diagnostic est tombé, le monde s&apos;est arrêté. Puis
                nous avons décidé que ce serait le début d&apos;autre
                chose.&rdquo;
              </p>
              <div className="space-y-5 md:space-y-6 text-base md:text-lg text-on-surface-variant leading-relaxed">
                <p>
                  Alya est née en 2019. Une petite fille pleine de vie, de
                  rires, d&apos;observation. À ses trois ans, le diagnostic
                  tombe : une maladie rare, peu connue, mal financée par la
                  recherche publique.
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
              <div className="mt-10 flex items-center gap-4 md:gap-6 flex-wrap">
                <div className="font-serif italic text-2xl md:text-3xl text-primary">
                  — Marion &amp; Karim
                </div>
                <div className="flex-1 h-px bg-outline-variant/40 min-w-[40px]" />
                <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                  Fondateurs
                </span>
              </div>
            </FadeUp>
            <div className="lg:col-span-5 order-1 lg:order-2 relative">
              <ImageReveal direction="right">
                <div className="aspect-[4/5] rounded-tl-[2rem] md:rounded-tl-[5rem] rounded-tr-[1rem] md:rounded-tr-[2rem] rounded-bl-[1rem] md:rounded-bl-[2rem] rounded-br-[2rem] md:rounded-br-[5rem] overflow-hidden -rotate-2">
                  <img
                    alt="Famille d'Alya"
                    src={HERO_IMAGE}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
              </ImageReveal>
              <FadeUp
                delay={0.5}
                className="absolute -top-4 -right-2 md:-top-6 md:-right-6 rotate-3"
              >
                <div className="bg-secondary-fixed text-on-secondary-fixed font-serif italic text-xs md:text-sm px-4 md:px-5 py-2 md:py-3 rounded-full">
                  Famille d&apos;Alya · 2026
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
                Chronologie
              </p>
              <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.02]">
                <span className="italic">Trois ans</span>, quatre étapes
                clés.
              </h2>
            </div>

            <Stagger
              staggerDelay={0.15}
              className="relative space-y-10 md:space-y-16 md:pl-12 md:before:absolute md:before:left-[7px] md:before:top-2 md:before:bottom-2 md:before:w-px md:before:bg-outline-variant/40"
            >
              {TIMELINE.map((item, idx) => (
                <StaggerItem
                  key={item.year}
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
                Nos valeurs
              </p>
              <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.05]">
                Ce qui nous <span className="italic">guide</span>.
              </h2>
            </div>

            <Stagger
              staggerDelay={0.12}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8"
            >
              {VALUES.map((v, idx) => (
                <StaggerItem
                  key={v.title}
                  className="bg-surface-container-lowest p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center">
                      <Icon name={v.icon} filled className="text-2xl md:text-3xl" />
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
                  Album de famille
                </p>
                <h2 className="font-serif text-primary text-3xl md:text-5xl leading-tight">
                  Moments <span className="italic">choisis</span>.
                </h2>
              </div>
              <p className="text-on-surface-variant font-serif italic text-base md:text-lg max-w-sm">
                Quelques instants de l&apos;aventure, partagés avec ceux qui
                la portent.
              </p>
            </div>

            <Stagger
              staggerDelay={0.1}
              className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-5"
            >
              <StaggerItem className="md:col-span-5 md:row-span-2 aspect-[3/4] md:aspect-auto overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
              </StaggerItem>
              <StaggerItem className="md:col-span-4 aspect-square overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                <img src={PORTRAIT_IMAGE} alt="" className="w-full h-full object-cover" />
              </StaggerItem>
              <StaggerItem className="md:col-span-3 aspect-square overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-secondary p-6 md:p-8 flex flex-col justify-between">
                <Icon name="format_quote" filled className="text-white text-4xl md:text-5xl opacity-70" />
                <p className="font-serif italic text-white text-base md:text-xl leading-snug">
                  &ldquo;Le sourire d&apos;Alya, c&apos;est notre boussole.&rdquo;
                </p>
              </StaggerItem>
              <StaggerItem className="md:col-span-3 aspect-square overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
              </StaggerItem>
              <StaggerItem className="md:col-span-4 aspect-square overflow-hidden rounded-[1.5rem] md:rounded-[2rem]">
                <img src={PORTRAIT_IMAGE} alt="" className="w-full h-full object-cover" />
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-32 px-6 md:px-10 bg-surface-container-low">
          <FadeUp className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-6">
              Rejoindre l&apos;aventure
            </p>
            <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.05] mb-6 md:mb-8">
              <span className="italic">Vous aussi</span>, écrivez la suite.
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant mb-10 md:mb-12 max-w-xl mx-auto">
              Cette histoire est encore en cours d&apos;écriture. Vous pouvez
              en être les prochains auteurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/aider"
                className="bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-8 md:px-10 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 shadow-[0_12px_32px_-8px_rgba(184,0,75,0.4)] hover:scale-[1.03] transition-transform"
              >
                <Icon name="favorite" filled />
                Faire un don
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-primary px-8 md:px-10 py-4 rounded-full font-semibold text-base border border-primary/20 hover:bg-surface-container-high transition-colors text-center"
              >
                Nous contacter
              </Link>
            </div>
          </FadeUp>
        </section>
      </main>
      <Footer />
    </>
  );
}
