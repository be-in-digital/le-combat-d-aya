/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { FadeUp, ImageReveal, Stagger, StaggerItem } from "@/components/anim";
import { VideoPlayer } from "@/components/video-player";
import { PortableProse } from "@/components/portable-text";
import { sanityFetch } from "@/sanity/fetch";
import { missionsPageQuery, fullMissionsQuery } from "@/sanity/queries";
import type { MissionsPage, Mission } from "@/sanity/types";
import { buildMetadata } from "@/lib/seo";

const FALLBACK_DESCRIPTION =
  "Soins, soutien aux familles, sensibilisation, équipement : nos quatre piliers d'action.";

// Gradient / background palettes reused from the hardcoded MISSIONS below so
// Sanity-driven cards keep the exact same styling, cycled by index.
const MISSION_GRADIENTS = [
  "from-[#4A5C7A] via-[#5B5670] to-[#6D4F60]",
  "from-secondary via-[#cf0e58] to-[#e01e62]",
  "from-[#a26369] via-[#864b51] to-[#6d363c]",
  "from-[#5B5670] via-[#6D4F60] to-[#864b51]",
];
const MISSION_BGS = [
  "bg-surface-container-low",
  "bg-surface-container-lowest",
  "bg-surface-container",
  "bg-surface-container-high",
];

const HERO_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg/v1/fill/w_1066,h_740,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg";

const MISSIONS = [
  {
    number: "01",
    eyebrow: "Mission principale",
    title: "Soins & Thérapies",
    italicWord: "thérapies",
    tagline:
      "Financer les meilleurs traitements, sans frontière géographique ni financière.",
    description:
      "Nous prenons en charge les protocoles innovants, les thérapies de pointe et les programmes de rééducation à l'international. Notre rôle : permettre à Alya — et aux familles que nous accompagnons — d'accéder aux soins que la couverture publique ne couvre pas encore.",
    programs: [
      "Rééducation neuromotrice — centre Aléas (Blanes, Espagne)",
      "Thérapies par stimulation sensorielle",
      "Suivi médical pluridisciplinaire",
      "Bourses de soins pour familles bénéficiaires",
    ],
    stats: [
      { value: "32k€", label: "Investis en 2025" },
      { value: "12", label: "Programmes financés" },
      { value: "3", label: "Pays partenaires" },
    ],
    icon: "medical_services",
    gradient: "from-[#4A5C7A] via-[#5B5670] to-[#6D4F60]",
    bg: "bg-surface-container-low",
    cover: null,
    video: null,
  },
  {
    number: "02",
    eyebrow: "Communauté",
    title: "Soutien aux Familles",
    italicWord: "Familles",
    tagline:
      "Une famille élargie pour traverser ce que personne ne devrait traverser seul.",
    description:
      "Au-delà du financement, nous tissons un réseau de soutien : groupes de parole, accompagnement administratif, mise en relation avec des spécialistes, week-ends de répit pour les aidants. L'humain d'abord.",
    programs: [
      "Groupes de parole mensuels (Paris, Lyon, en ligne)",
      "Cellule d'écoute psychologique gratuite",
      "Accompagnement administratif MDPH",
      "Week-ends répit pour aidants familiaux",
    ],
    stats: [
      { value: "850", label: "Familles accompagnées" },
      { value: "24h", label: "Délai d'écoute moyen" },
      { value: "4", label: "Antennes en France" },
    ],
    icon: "diversity_1",
    gradient: "from-secondary via-[#cf0e58] to-[#e01e62]",
    bg: "bg-surface-container-lowest",
    cover: null,
    video: null,
  },
  {
    number: "03",
    eyebrow: "Sensibilisation",
    title: "Changer les Regards",
    italicWord: "regards",
    tagline:
      "L'éducation comme antidote à l'ignorance et à l'isolement social.",
    description:
      "Nous menons des actions de sensibilisation dans les écoles, en entreprise et auprès du grand public. Notre conviction : c'est en racontant ces histoires qu'on déconstruit les préjugés et qu'on rend la société plus accueillante.",
    programs: [
      "Interventions en milieu scolaire (CM1 à Terminale)",
      "Conférences en entreprise sur le handicap invisible",
      "Campagnes presse et réseaux sociaux",
      "Festival annuel « Voix d'Alya »",
    ],
    stats: [
      { value: "47", label: "Écoles touchées" },
      { value: "12k", label: "Personnes sensibilisées" },
      { value: "8", label: "Médias partenaires" },
    ],
    icon: "visibility",
    gradient: "from-[#a26369] via-[#864b51] to-[#6d363c]",
    bg: "bg-surface-container",
    cover: null,
    video: null,
  },
  {
    number: "04",
    eyebrow: "Innovation",
    title: "Équipement & Autonomie",
    italicWord: "autonomie",
    tagline:
      "Accès aux technologies d'assistance qui transforment le quotidien.",
    description:
      "Matériel médical, véhicules adaptés et dispositifs de mobilité : nous finançons les équipements de pointe qui repoussent les limites du possible et redonnent de l'autonomie à chacun.",
    programs: [
      "Véhicule adapté (PMR)",
      "Matériel médical pour Alya",
      "Aménagement de domicile",
      "Aides à la mobilité personnalisées",
    ],
    stats: [
      { value: "27k€", label: "Équipement financé" },
      { value: "18", label: "Bénéficiaires" },
      { value: "100%", label: "Sur prescription" },
    ],
    icon: "settings_accessibility",
    gradient: "from-[#5B5670] via-[#6D4F60] to-[#864b51]",
    bg: "bg-surface-container-high",
    cover: null,
    video: null,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<MissionsPage | null>({
    query: missionsPageQuery,
    tags: ["missionsPage"],
  });
  return buildMetadata({
    seo: page?.seo,
    title: page?.hero?.title ?? "Nos missions",
    description: page?.hero?.intro ?? FALLBACK_DESCRIPTION,
    path: "/missions",
  });
}

export default async function MissionsPage() {
  const [page, sanityMissions] = await Promise.all([
    sanityFetch<MissionsPage | null>({
      query: missionsPageQuery,
      tags: ["missionsPage"],
    }),
    sanityFetch<Mission[]>({ query: fullMissionsQuery, tags: ["mission"] }),
  ]);

  // Adapt Sanity missions to the existing card shape, deriving the fields the
  // schema doesn't carry (number/gradient/bg) so styling stays identical.
  const missions = sanityMissions?.length
    ? sanityMissions.map((m, i) => ({
        number: String(i + 1).padStart(2, "0"),
        eyebrow: m.eyebrow ?? "",
        title: m.title,
        italicWord: m.italicWord ?? "",
        tagline: m.tagline ?? "",
        description: m.description ?? m.summary ?? "",
        programs: m.programs ?? [],
        stats: m.stats ?? [],
        icon: m.icon,
        gradient: MISSION_GRADIENTS[i % MISSION_GRADIENTS.length],
        bg: MISSION_BGS[i % MISSION_BGS.length],
        cover: m.cover ?? null,
        video: m.video ?? null,
      }))
    : MISSIONS;

  const hero = page?.hero;

  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Nos missions" },
          ]}
          eyebrow={hero?.eyebrow ?? "Ce que nous faisons"}
          title={
            hero?.title ?? (
              <>
                Quatre piliers,
                <br />
                une <span className="italic">raison d&apos;être</span>.
              </>
            )
          }
          intro={
            hero?.intro ??
            "Soins, soutien, sensibilisation, équipement. Chaque mission est pensée comme un levier complémentaire pour transformer le quotidien d'Alya et celui des familles que nous accompagnons."
          }
        />

        {page?.intro && page.intro.length > 0 && (
          <section className="px-6 md:px-10 pb-4 md:pb-8">
            <PortableProse
              value={page.intro}
              className="max-w-3xl mx-auto"
            />
          </section>
        )}

        {/* Summary nav */}
        <section className="px-6 md:px-10 pb-12 md:pb-20">
          <Stagger
            staggerDelay={0.08}
            className="max-w-screen-2xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5"
          >
            {missions.map((m) => (
              <StaggerItem key={m.number}>
                <a
                  href={`#mission-${m.number}`}
                  className="group p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-surface-container-low hover:bg-surface-container-high transition-colors flex flex-col gap-3 md:gap-4 h-full"
                >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-secondary font-semibold">
                    {m.number}
                  </span>
                  <Icon
                    name={m.icon}
                    className="text-primary text-2xl md:text-3xl opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                  <h3 className="font-serif text-primary text-lg md:text-xl leading-tight">
                    {m.title}
                  </h3>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* Detailed missions */}
        {missions.map((m, idx) => (
          <section
            key={m.number}
            id={`mission-${m.number}`}
            className={`py-16 md:py-32 px-6 md:px-10 ${idx % 2 === 0 ? "bg-background" : "bg-surface-container-low"} scroll-mt-32`}
          >
            <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Visual side */}
              <ImageReveal
                direction={idx % 2 === 0 ? "right" : "left"}
                className={`lg:col-span-5 ${idx % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
              >
                <div
                  className={`relative aspect-[4/5] rounded-[2rem] md:rounded-[3rem] overflow-hidden p-8 md:p-12 flex flex-col justify-between`}
                >
                  {m.cover?.url && (
                    <img
                      src={m.cover.url}
                      alt={m.cover.alt ?? ""}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${m.gradient}`}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />

                  <div className="relative z-10 flex items-start justify-between">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white">
                      <Icon name={m.icon} filled className="text-2xl md:text-3xl" />
                    </div>
                    <span className="font-serif italic text-white/80 text-5xl md:text-7xl leading-none">
                      {m.number}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-semibold mb-3 md:mb-4">
                      {m.eyebrow}
                    </p>
                    <p className="font-serif italic text-white text-xl md:text-3xl leading-snug">
                      &ldquo;{m.tagline}&rdquo;
                    </p>
                  </div>
                </div>
              </ImageReveal>

              {/* Content side */}
              <FadeUp
                delay={0.2}
                className={`lg:col-span-7 ${idx % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                  Mission · {m.number}
                </p>
                <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.02] mb-6 md:mb-8">
                  {m.title.split(m.italicWord)[0]}
                  <span className="italic">{m.italicWord}</span>
                  {m.title.split(m.italicWord)[1]}
                </h2>
                <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-8 md:mb-10">
                  {m.description}
                </p>

                {/* Programs list */}
                <div className="mb-8 md:mb-10">
                  <p className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-5 md:mb-6">
                    Programmes phares
                  </p>
                  <ul className="space-y-4">
                    {m.programs.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-4 pb-4 border-b border-outline-variant/30 last:border-0 last:pb-0"
                      >
                        <span className="w-6 h-6 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon name="check" className="text-[14px]" />
                        </span>
                        <span className="text-base md:text-lg text-on-surface font-serif italic">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 md:gap-6 py-6 md:py-8 border-y border-outline-variant/30">
                  {m.stats.map((s) => (
                    <div key={s.label}>
                      <div className="font-serif text-secondary text-3xl md:text-5xl leading-none mb-2">
                        {s.value}
                      </div>
                      <p className="text-[11px] md:text-xs uppercase tracking-widest text-on-surface-variant">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/aider"
                  className="inline-flex items-center gap-3 mt-8 md:mt-10 text-secondary font-semibold text-sm uppercase tracking-widest group"
                >
                  Soutenir cette mission
                  <Icon
                    name="arrow_forward"
                    className="text-base group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                {m.video && (
                  <VideoPlayer video={m.video} className="mt-8 md:mt-10" />
                )}
              </FadeUp>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="relative py-20 md:py-36 px-6 md:px-10 bg-primary text-on-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src={HERO_IMAGE}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <FadeUp className="relative max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-on-primary/70 font-semibold mb-4 md:mb-6">
              Soutenir nos missions
            </p>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 md:mb-8">
              Votre don finance <span className="italic">chacune</span> de
              ces missions.
            </h2>
            <p className="text-base md:text-lg text-on-primary/85 mb-10 md:mb-12 max-w-xl mx-auto">
              85 % de chaque don va directement aux programmes. La
              transparence est notre engagement quotidien.
            </p>
            <Link
              href="/aider"
              className="inline-flex items-center gap-3 bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-10 py-5 rounded-full font-bold text-base shadow-[0_16px_40px_-10px_rgba(184,0,75,0.5)] hover:scale-[1.03] transition-transform"
            >
              <Icon name="favorite" filled />
              Faire un don
              <Icon name="arrow_forward" />
            </Link>
          </FadeUp>
        </section>
      </main>
      <Footer />
    </>
  );
}
