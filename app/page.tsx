/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import {
  FadeUp,
  FadeIn,
  Float,
  ImageReveal,
  Magnetic,
  ProgressFill,
  RevealText,
  Stagger,
  StaggerItem,
} from "@/components/anim";
import { NewsletterForm } from "@/components/newsletter-form";
import { ShareButton } from "@/components/share-button";
import { sanityFetch } from "@/sanity/fetch";
import { getFormStats, isHelloAssoConfigured } from "@/lib/helloasso";
import {
  testimonialsQuery,
  partnersQuery,
  featuredCampaignQuery,
} from "@/sanity/queries";
import type {
  Testimonial,
  Partner,
  FeaturedCampaign as CampaignDoc,
} from "@/sanity/types";

const HERO_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg/v1/fill/w_1066,h_740,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg";

const CAMPAIGN_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b288a16560794a2a9e6cf5122dd22d69~mv2.jpg/v1/fill/w_780,h_1124,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-07-12%20%C3%A0%2014_30_08_ba15ba8b.jpg";

const STATS = [
  { value: "45k€", label: "Fonds récoltés", caption: "depuis 2023" },
  { value: "1 247", label: "Donateurs", caption: "et donatrices" },
  { value: "15", label: "Partenaires", caption: "engagés" },
  { value: "850", label: "Vies impactées", caption: "à ce jour" },
];

const PARTNERS = [
  "Fondation de France",
  "Hôpital Necker",
  "Croix-Rouge",
  "APF France Handicap",
  "Le Monde",
  "Mediapart",
];

const FEATURED_TESTIMONIAL = {
  quote:
    "Grâce au soutien de l'association, ma fille a pu accéder à des soins qu'on n'imaginait pas possibles. Au-delà du financement, c'est une famille élargie que nous avons trouvée — une communauté qui comprend ce qu'on traverse, sans jugement et avec une bienveillance rare.",
  name: "Jean-Marc Tessier",
  role: "Parent bénéficiaire",
  location: "Lyon",
  date: "Mars 2026",
  initials: "JM",
  gradient: "from-secondary to-[#e01e62]",
  rating: 5,
};

const TESTIMONIALS = [
  {
    quote:
      "L'engagement de cette association est admirable. On sent une réelle chaleur humaine derrière chaque initiative.",
    name: "Marie Lefèvre",
    role: "Donatrice régulière",
    location: "Paris",
    date: "Février 2026",
    initials: "ML",
    gradient: "from-primary to-primary-container",
    rating: 5,
  },
  {
    quote:
      "Chaque euro donné est utilisé avec une transparence exemplaire. C'est rassurant et profondément motivant.",
    name: "Sophie Dubois",
    role: "Bénévole depuis 2024",
    location: "Bordeaux",
    date: "Janvier 2026",
    initials: "SD",
    gradient: "from-[#a26369] to-[#864b51]",
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    q: "Comment sont utilisés mes dons ?",
    a: "85 % de chaque don finance directement les soins, l'équipement et les programmes de soutien aux familles. Le reste couvre le fonctionnement et la communication transparente sur nos actions.",
  },
  {
    q: "Puis-je devenir bénévole ?",
    a: "Absolument. Nous accueillons des bénévoles pour l'événementiel, la communication, le soutien aux familles et bien plus. Contactez-nous via le formulaire de contact.",
  },
  {
    q: "Les dons sont-ils déductibles d'impôts ?",
    a: "Oui. En tant qu'association reconnue d'intérêt général, 66 % de votre don est déductible de votre impôt sur le revenu, dans la limite de 20 % de votre revenu imposable.",
  },
  {
    q: "Puis-je faire un don ponctuel ou mensuel ?",
    a: "Les deux sont possibles. Le don mensuel — même modeste — nous permet de planifier les soins d'Alya sur la durée et a un impact considérable.",
  },
];

function Hero() {
  return (
    <section className="relative px-6 md:px-10 pt-12 md:pt-20 pb-24 md:pb-40 overflow-hidden">
      <Float
        duration={18}
        amplitude={30}
        className="absolute -top-20 -right-32 w-[600px] h-[600px] bg-primary-fixed-dim/25 blur-[120px] -z-10 rounded-full"
      />
      <Float
        duration={22}
        amplitude={40}
        delay={1.5}
        className="absolute -bottom-32 -left-32 w-[700px] h-[700px] bg-secondary-fixed/30 blur-[140px] -z-10 rounded-full"
      />

      <div className="max-w-screen-2xl mx-auto">
        <FadeIn className="flex items-center gap-4 md:gap-6 mb-10 md:mb-16">
          <span className="text-secondary font-semibold tracking-[0.3em] uppercase text-[10px] md:text-[11px]">
            Solidarité &amp; Espoir
          </span>
          <div className="flex-1 h-px bg-outline-variant/40" />
          <span className="hidden md:inline-block text-on-surface-variant font-serif italic text-sm">
            Histoire d&apos;une famille — Témoignage du combat
          </span>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-7 z-10">
            <h1 className="font-serif text-primary leading-[0.95] mb-8 md:mb-10 text-[44px] sm:text-[72px] md:text-[96px] lg:text-[128px] tracking-[-0.02em] pb-[0.08em]">
              <RevealText delay={0.1} eager>
                <span className="italic">Ensemble</span>
              </RevealText>
              <RevealText delay={0.28} eager>
                <span className="font-light">pour </span>
                <span className="italic text-secondary">Alya.</span>
              </RevealText>
            </h1>

            <FadeUp delay={0.55} className="grid grid-cols-12 gap-4 md:gap-6 items-start">
              <div className="hidden md:block col-span-1">
                <span className="font-serif text-secondary text-7xl leading-none italic">
                  &ldquo;
                </span>
              </div>
              <p className="col-span-12 md:col-span-7 text-base md:text-xl font-light text-on-surface-variant leading-relaxed">
                Chaque geste compte pour soutenir le parcours d&apos;Alya vers
                la guérison. Une histoire de famille, une mission collective,
                un combat porté par la bienveillance.
              </p>
              <div className="col-span-12 md:col-span-4 md:pl-6 md:border-l md:border-outline-variant/40 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-2">
                  Notre engagement
                </p>
                <p className="text-sm text-on-surface-variant font-serif italic leading-relaxed">
                  Financer les meilleurs soins, soutenir les familles,
                  sensibiliser le grand public.
                </p>
              </div>
            </FadeUp>

            <FadeUp delay={0.75} className="flex flex-col sm:flex-row gap-4 mt-10 md:mt-12">
              <Magnetic>
                <Link
                  href="/aider"
                  className="bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-8 md:px-10 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.03] active:scale-95 shadow-[0_12px_32px_-8px_rgba(184,0,75,0.4)] flex items-center justify-center gap-3"
                >
                  Soutenir Alya
                  <Icon name="arrow_forward" className="text-base" />
                </Link>
              </Magnetic>
              <Link
                href="/histoire"
                className="bg-transparent text-primary px-8 md:px-10 py-4 rounded-full text-base font-semibold transition-all hover:bg-surface-container-high border border-primary/20 text-center"
              >
                Découvrir son histoire
              </Link>
            </FadeUp>
          </div>

          <div className="lg:col-span-5 relative mt-10 lg:mt-0">
            <ImageReveal delay={0.35} direction="up">
              <div className="relative aspect-[4/5] rounded-tl-[3rem] md:rounded-tl-[5rem] rounded-tr-[1.5rem] md:rounded-tr-[2rem] rounded-bl-[1.5rem] md:rounded-bl-[2rem] rounded-br-[3rem] md:rounded-br-[5rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-[800ms] ease-out">
                <img
                  alt="Portrait d'Alya"
                  className="w-full h-full object-cover"
                  src={HERO_IMAGE}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                <span className="absolute top-4 md:top-6 left-4 md:left-6 text-[10px] uppercase tracking-[0.3em] text-white/90 font-semibold bg-black/20 backdrop-blur-md rounded-full px-3 md:px-4 py-1.5 md:py-2">
                  Portrait d&apos;Alya
                </span>
              </div>
            </ImageReveal>

            <FadeUp
              delay={1}
              distance={20}
              className="absolute -bottom-10 -left-2 md:-left-12 -rotate-6"
            >
              <Float duration={9} amplitude={6} rotate={1}>
                <div className="bg-surface-container-lowest p-5 md:p-7 rounded-3xl max-w-[260px] md:max-w-[300px] shadow-[0_20px_80px_-15px_rgba(55,12,19,0.12)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-secondary font-bold">
                      En direct · Dernier don
                    </span>
                  </div>
                  <p className="text-on-surface-variant italic font-serif text-xs md:text-sm leading-relaxed mb-3">
                    &ldquo;Pour qu&apos;Alya garde toujours son sourire
                    éclatant.&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-outline-variant/30">
                    <span className="text-xs text-on-surface-variant">
                      Camille B.
                    </span>
                    <span className="text-base font-bold text-primary">
                      50 €
                    </span>
                  </div>
                </div>
              </Float>
            </FadeUp>

            <FadeUp
              delay={1.15}
              distance={-20}
              className="absolute -top-4 md:-top-6 -right-1 md:-right-8 rotate-6"
            >
              <Float duration={7} amplitude={5} rotate={2} delay={0.5}>
                <div className="bg-secondary text-on-secondary px-3 md:px-5 py-2 md:py-3 rounded-full shadow-[0_12px_32px_-8px_rgba(184,0,75,0.4)] flex items-center gap-2">
                  <Icon name="trending_up" className="text-sm md:text-base" />
                  <span className="text-[10px] md:text-xs font-bold tracking-wide uppercase">
                    +12 dons cette semaine
                  </span>
                </div>
              </Float>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStrip({ partners }: { partners: Partner[] }) {
  const names = partners.length > 0 ? partners.map((p) => p.name) : PARTNERS;
  return (
    <section className="bg-surface-container-low py-10 md:py-12 border-y border-outline-variant/20">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant font-semibold whitespace-nowrap">
            Ils nous soutiennent
          </span>
          <div className="hidden md:block w-px h-8 bg-outline-variant/40" />
          <Stagger
            staggerDelay={0.06}
            className="flex-1 flex flex-wrap items-center justify-center md:justify-start gap-x-6 md:gap-x-10 gap-y-3 md:gap-y-4"
          >
            {names.map((partner) => (
              <StaggerItem key={partner}>
                <span className="font-serif italic text-on-surface-variant text-sm md:text-lg opacity-60 hover:opacity-100 transition-opacity">
                  {partner}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="py-20 md:py-36 bg-background">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <FadeUp className="max-w-2xl mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
            Notre impact en chiffres
          </p>
          <h2 className="font-serif text-primary text-3xl md:text-5xl leading-tight">
            <span className="italic">Trois années</span> d&apos;engagement,
            une communauté qui grandit.
          </h2>
        </FadeUp>
        <Stagger
          staggerDelay={0.12}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-outline-variant/30"
        >
          {STATS.map((stat, idx) => (
            <StaggerItem
              key={stat.label}
              className={`${idx > 0 ? "md:pl-6 lg:pl-10" : ""} ${idx < STATS.length - 1 ? "md:pr-6 lg:pr-10" : ""}`}
            >
              <div className="font-serif text-secondary text-4xl md:text-6xl lg:text-7xl mb-2 md:mb-3 leading-none">
                {stat.value}
              </div>
              <p className="text-sm md:text-base font-semibold text-primary mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-on-surface-variant font-serif italic">
                {stat.caption}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Missions() {
  return (
    <section className="py-20 md:py-36 px-6 md:px-10 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto">
        <FadeUp className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6 md:gap-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-5">
              Ce que nous faisons
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-primary leading-[0.95]">
              Nos missions <span className="italic">de cœur</span>
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant font-light leading-relaxed mt-6 max-w-xl">
              Nous œuvrons chaque jour pour transformer le quotidien
              d&apos;Alya et sensibiliser à la beauté de la différence.
            </p>
          </div>
          <Link
            href="/missions"
            className="flex items-center gap-3 text-secondary font-bold hover:gap-5 transition-all group whitespace-nowrap"
          >
            <span className="text-sm md:text-base">Découvrir tous nos projets</span>
            <span className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center group-hover:rotate-45 transition-transform">
              <Icon name="arrow_outward" className="text-base" />
            </span>
          </Link>
        </FadeUp>

        <Stagger
          staggerDelay={0.14}
          className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[260px] gap-4 md:gap-6"
        >
          <StaggerItem className="md:col-span-7 md:row-span-2 group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] flex flex-col p-8 md:p-14 min-h-[460px] md:min-h-[560px] transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A5C7A] via-[#5B5670] to-[#6D4F60]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 md:mb-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-semibold">
                    Mission principale · 01
                  </span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>
                <div className="w-12 md:w-14 h-12 md:h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-8 md:mb-10 text-white">
                  <Icon name="medical_services" filled className="text-2xl md:text-3xl" />
                </div>
                <p className="font-serif italic text-xl md:text-3xl text-white/95 leading-snug max-w-lg">
                  &ldquo;Nous finançons des traitements innovants et des
                  programmes de rééducation de pointe à
                  l&apos;international.&rdquo;
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl md:text-4xl font-serif text-white mb-3 md:mb-4">
                  Soins &amp; Thérapies
                </h3>
                <p className="text-white/75 text-sm md:text-base max-w-md leading-relaxed mb-6">
                  Un engagement quotidien pour repousser les limites du possible
                  grâce à l&apos;accès aux meilleures technologies médicales
                  mondiales.
                </p>
                <Link
                  href="/missions"
                  className="inline-flex items-center gap-2 text-white font-semibold text-sm tracking-wide group/btn"
                >
                  Voir les programmes financés
                  <Icon
                    name="arrow_forward"
                    className="text-sm group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-5 md:row-span-1 group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-secondary to-[#e01e62] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 min-h-[220px] md:min-h-[260px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/8 rounded-full -mr-28 -mt-28 blur-3xl" />
            <div className="relative z-10 flex items-start justify-between">
              <Icon name="diversity_1" className="text-white/40 text-4xl md:text-5xl" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-semibold">
                02
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-serif text-white mb-3 italic">
                Soutien aux Familles
              </h3>
              <p className="text-white/85 text-sm leading-relaxed">
                Créer une communauté de bienveillance où chaque parent trouve
                écoute et solidarité.
              </p>
            </div>
          </StaggerItem>

          <StaggerItem className="md:col-span-2 md:row-span-1 group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-surface-container-highest p-7 flex flex-col justify-between transition-all duration-500 hover:bg-primary-fixed-dim/40 min-h-[180px] md:min-h-[260px]">
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-semibold">
                03
              </span>
              <h3 className="text-xl font-serif text-primary font-semibold mt-3 md:mt-4 mb-2">
                Sensibilisation
              </h3>
              <p className="text-on-surface-variant text-xs leading-snug">
                Changer les regards par l&apos;éducation.
              </p>
            </div>
            <Icon
              name="visibility"
              className="text-primary text-3xl opacity-50 group-hover:opacity-100 transition-opacity self-end"
            />
          </StaggerItem>

          <StaggerItem className="md:col-span-3 md:row-span-1 group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-surface-container-lowest p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-1 min-h-[180px] md:min-h-[260px]">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-semibold">
                04
              </span>
              <h3 className="text-xl md:text-2xl font-serif text-primary mt-3 md:mt-4 mb-3">
                Équipement
              </h3>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Mobilité augmentée via des technologies d&apos;assistance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest pt-4 border-t border-outline-variant/30">
              <span>En savoir plus</span>
              <Icon name="north_east" className="text-sm" />
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function FounderNote() {
  return (
    <section className="py-20 md:py-36 bg-background">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <ImageReveal direction="left">
              <div className="aspect-[3/4] rounded-tl-[1.5rem] md:rounded-tl-[2rem] rounded-tr-[3rem] md:rounded-tr-[5rem] rounded-bl-[3rem] md:rounded-bl-[5rem] rounded-br-[1.5rem] md:rounded-br-[2rem] overflow-hidden -rotate-2">
                <img
                  alt="Famille d'Alya"
                  src={HERO_IMAGE}
                  className="w-full h-full object-cover scale-110"
                />
              </div>
            </ImageReveal>
            <FadeUp
              delay={0.6}
              className="absolute -top-4 md:-top-6 -left-2 md:-left-6 rotate-3"
            >
              <Float duration={8} amplitude={5} rotate={1}>
                <div className="bg-secondary-fixed text-on-secondary-fixed font-serif italic text-xs md:text-sm px-4 md:px-5 py-2 md:py-3 rounded-full">
                  Le mot des parents
                </div>
              </Float>
            </FadeUp>
          </div>

          <Stagger
            staggerDelay={0.12}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <StaggerItem>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-6">
                Notre histoire
              </p>
            </StaggerItem>
            <StaggerItem>
              <h2 className="font-serif text-primary text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-8 md:mb-10">
                <span className="italic">Un combat</span> qui a commencé par
                un sourire.
              </h2>
            </StaggerItem>
            <StaggerItem>
              <div className="space-y-5 md:space-y-6 text-base md:text-lg text-on-surface-variant leading-relaxed">
                <p className="font-serif italic text-xl md:text-2xl text-on-surface leading-snug">
                  <span className="text-secondary text-3xl md:text-4xl font-serif italic mr-1">
                    &ldquo;
                  </span>
                  Quand le diagnostic est tombé, le monde s&apos;est arrêté.
                  Puis nous avons décidé que ce serait le début d&apos;autre
                  chose.&rdquo;
                </p>
                <p>
                  Le Combat d&apos;Alya est né en 2023 d&apos;un besoin urgent
                  de financer les soins de notre fille. Mais très vite, nous
                  avons compris que d&apos;autres familles vivaient le même
                  isolement, la même incertitude.
                </p>
                <p>
                  Aujourd&apos;hui, nous transformons cette épreuve en un
                  mouvement : pour Alya, et pour toutes les Alyas que nous
                  n&apos;avons pas encore rencontrées.
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-10 md:mt-12 flex items-center gap-4 md:gap-6 flex-wrap">
                <div className="font-serif italic text-2xl md:text-3xl text-primary">
                  — Marion &amp; Karim
                </div>
                <div className="flex-1 h-px bg-outline-variant/40 min-w-[40px]" />
                <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">
                  Fondateurs
                </span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <Link
                href="/histoire"
                className="inline-flex items-center gap-3 text-secondary font-semibold text-sm uppercase tracking-widest group mt-8"
              >
                Lire notre histoire complète
                <Icon
                  name="arrow_forward"
                  className="text-base group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}

const EUR_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function daysRemaining(deadline: string | null | undefined): number | null {
  if (!deadline) return null;
  const ms = new Date(deadline).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
}

function FeaturedCampaign({ campaign }: { campaign: CampaignDoc | null }) {
  const fallback = {
    title: "Un nouveau fauteuil multisensoriel pour Alya",
    description:
      "Aidez-nous à offrir à Alya l'autonomie qu'elle mérite. Ce fauteuil permettra une stimulation cognitive sans précédent.",
    goal: 20000,
    raised: 12450,
    supporters: 847,
    daysLeft: 45,
    image: CAMPAIGN_IMAGE,
    coverAlt: "Campagne fauteuil multisensoriel",
    helloAssoUrl: "/aider",
  };

  const goal = campaign?.goalAmount ?? fallback.goal;
  const raised = campaign?.raisedAmount ?? fallback.raised;
  const supporters = campaign?.supporters ?? fallback.supporters;
  const remaining = Math.max(goal - raised, 0);
  const percent = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  const daysLeft = campaign ? daysRemaining(campaign.deadline) : fallback.daysLeft;
  const title = campaign?.title ?? fallback.title;
  const description = campaign?.description ?? campaign?.tagline ?? fallback.description;
  const cover = campaign?.cover?.url ?? fallback.image;
  const coverAlt = campaign?.cover?.alt ?? campaign?.title ?? fallback.coverAlt;
  const donateHref = campaign?.helloAssoUrl ?? "/aider";

  return (
    <section className="py-20 md:py-36 bg-surface-container-low">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <div className="relative bg-surface-container-lowest rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-16 lg:p-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-fixed/40 blur-[100px] rounded-full -mr-32 -mt-32" />

          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
            <div className="md:col-span-5 relative">
              <div className="absolute -inset-3 bg-secondary/10 -rotate-3 rounded-[2.5rem]" />
              <ImageReveal direction="up">
                <img
                  alt={coverAlt}
                  className="relative w-full aspect-square object-cover rounded-[1.5rem] md:rounded-[2rem]"
                  src={cover}
                />
              </ImageReveal>
              {daysLeft !== null && daysLeft > 0 && (
                <FadeUp
                  delay={0.7}
                  distance={-12}
                  className="absolute -bottom-4 -right-2 md:-right-4"
                >
                  <Float duration={7} amplitude={4} rotate={2}>
                    <div className="bg-primary text-on-primary font-serif italic text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-full">
                      {daysLeft <= 60 ? "Urgent · " : ""}
                      {daysLeft} jours
                    </div>
                  </Float>
                </FadeUp>
              )}
            </div>

            <Stagger staggerDelay={0.1} className="md:col-span-7">
              <StaggerItem className="flex items-center gap-4 mb-5 md:mb-6">
                <span className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-secondary animate-pulse" />
                <span className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-secondary font-bold">
                  Campagne active
                </span>
              </StaggerItem>

              <StaggerItem>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-primary mb-6 md:mb-8 leading-[1.05]">
                  {title}
                </h2>
              </StaggerItem>

              <StaggerItem>
                <p className="text-base md:text-lg text-on-surface-variant mb-8 md:mb-10 leading-relaxed font-serif italic">
                  {description}
                </p>
              </StaggerItem>

              <StaggerItem className="mb-8 md:mb-10">
                <div className="flex justify-between items-end mb-4 gap-4 flex-wrap">
                  <div>
                    <div className="font-serif text-secondary text-2xl md:text-4xl leading-none">
                      {EUR_FORMATTER.format(raised)}
                    </div>
                    <span className="text-[10px] md:text-xs text-on-surface-variant uppercase tracking-widest">
                      récoltés sur {EUR_FORMATTER.format(goal)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl md:text-4xl font-serif text-primary leading-none">
                      {percent}%
                    </div>
                    <span className="text-[10px] md:text-xs text-on-surface-variant uppercase tracking-widest">
                      complétés
                    </span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-secondary-fixed rounded-full overflow-hidden">
                  <ProgressFill
                    percent={percent}
                    delay={0.4}
                    duration={2}
                    className="h-full bg-gradient-to-r from-secondary to-[#e01e62] rounded-full relative"
                  />
                </div>
                <div className="flex justify-between mt-4 text-xs text-on-surface-variant gap-2 flex-wrap">
                  <span className="font-semibold">
                    {supporters.toLocaleString("fr-FR")} contributeurs
                  </span>
                  <span className="italic font-serif">
                    Plus que {EUR_FORMATTER.format(remaining)} à récolter
                  </span>
                </div>
              </StaggerItem>

              <StaggerItem className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Magnetic className="flex-1">
                  <Link
                    href={donateHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary py-4 md:py-5 rounded-full text-sm md:text-base font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-[0_12px_32px_-8px_rgba(184,0,75,0.35)] flex items-center justify-center gap-3"
                  >
                    <Icon name="favorite" filled className="text-base" />
                    Contribuer à cette campagne
                  </Link>
                </Magnetic>
                <ShareButton
                  url={donateHref}
                  title={title}
                  text={description ?? undefined}
                  className="sm:w-auto bg-surface-container-high text-primary px-8 py-4 md:py-5 rounded-full text-sm md:text-base font-semibold transition-all hover:bg-surface-container-highest"
                />
              </StaggerItem>
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}

function Avatar({
  initials,
  gradient,
  photoUrl,
  size = "md",
}: {
  initials: string;
  gradient: string;
  photoUrl?: string | null;
  size?: "md" | "lg";
}) {
  const dims =
    size === "lg" ? "w-14 h-14 md:w-16 md:h-16 text-base md:text-lg" : "w-12 h-12 text-sm";
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={initials}
        className={`${dims} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${dims} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-semibold text-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5 text-secondary">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          filled={i < value}
          className="text-[14px] opacity-90"
        />
      ))}
    </div>
  );
}

type TestimonialCard = {
  quote: string;
  name: string;
  role?: string | null;
  location?: string | null;
  date?: string | null;
  initials: string;
  gradient: string;
  photoUrl?: string | null;
  rating?: number;
};

const GRADIENTS = [
  "from-primary to-primary-container",
  "from-[#a26369] to-[#864b51]",
  "from-secondary to-[#e01e62]",
  "from-[#7a5a5e] to-primary",
];

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("");
}

function gradientFor(seed: string) {
  const i = Math.abs(
    seed.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0),
  );
  return GRADIENTS[i % GRADIENTS.length];
}

function buildTestimonials(items: Testimonial[]): {
  featured: TestimonialCard;
  rest: TestimonialCard[];
} {
  if (items.length === 0) {
    return {
      featured: {
        ...FEATURED_TESTIMONIAL,
        location: FEATURED_TESTIMONIAL.location,
      },
      rest: TESTIMONIALS,
    };
  }
  const sorted = [...items].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
  );
  const [first, ...rest] = sorted;
  const toCard = (t: Testimonial): TestimonialCard => ({
    quote: t.quote,
    name: t.authorName,
    role: t.authorRole,
    initials: initialsFor(t.authorName),
    gradient: gradientFor(t.authorName),
    photoUrl: t.authorPhoto?.url,
    rating: 5,
  });
  return {
    featured: toCard(first),
    rest: rest.slice(0, 2).map(toCard),
  };
}

function Testimonials({ items }: { items: Testimonial[] }) {
  const { featured, rest } = buildTestimonials(items);
  return (
    <section className="py-20 md:py-36 bg-background relative overflow-hidden">
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-secondary-fixed/20 blur-[140px] -z-10 rounded-full" />

      <div className="max-w-screen-2xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end mb-12 md:mb-20">
          <FadeUp className="md:col-span-7">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-5">
              Témoignages · Voix de la communauté
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif text-primary leading-[1.02] pb-[0.08em]">
              <RevealText delay={0.1}>
                <span className="italic">Ils</span> portent ce combat
              </RevealText>
              <RevealText delay={0.25}>
                <span className="italic">avec</span> nous.
              </RevealText>
            </h2>
          </FadeUp>
          <FadeUp delay={0.4} className="md:col-span-5 md:pl-10 md:border-l border-outline-variant/40">
            <p className="text-on-surface-variant font-serif italic text-base md:text-lg leading-relaxed mb-5 md:mb-6">
              Chaque don, chaque mot, chaque heure offerte tissent la
              communauté qui rend cette mission possible.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-3 text-secondary font-semibold text-sm uppercase tracking-widest group"
            >
              Tous les témoignages
              <Icon
                name="arrow_forward"
                className="text-base group-hover:translate-x-1 transition-transform"
              />
            </a>
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <FadeUp className="lg:col-span-7">
            <article className="relative bg-surface-container-lowest rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-14 lg:p-16 overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-72 h-72 bg-primary-fixed-dim/20 blur-[80px] rounded-full -mr-20 -mt-20" />

            <div className="relative">
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <span className="text-[10px] uppercase tracking-[0.35em] text-secondary font-bold">
                  Témoignage à la une
                </span>
                <Rating value={featured.rating ?? 5} />
              </div>

              <span
                aria-hidden
                className="block font-serif italic text-secondary/90 text-[120px] md:text-[200px] leading-[0.7] mb-2"
              >
                &ldquo;
              </span>

              <blockquote className="font-serif italic text-primary text-xl md:text-3xl lg:text-[34px] leading-[1.25] mb-10 md:mb-12 max-w-[42rem]">
                {featured.quote}
              </blockquote>

              <div className="flex items-center justify-between pt-6 md:pt-8 border-t border-outline-variant/30 gap-4 flex-wrap">
                <div className="flex items-center gap-3 md:gap-4">
                  <Avatar
                    initials={featured.initials}
                    gradient={featured.gradient}
                    photoUrl={featured.photoUrl}
                    size="lg"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-primary text-base">
                        {featured.name}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-secondary font-semibold">
                        <Icon name="verified" filled className="text-[14px]" />
                        Vérifié
                      </span>
                    </div>
                    {(featured.role || featured.location) && (
                      <p className="text-xs md:text-sm text-on-surface-variant mt-1">
                        {[featured.role, featured.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
                {featured.date && (
                  <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-serif italic">
                    {featured.date}
                  </span>
                )}
              </div>
            </div>
            </article>
          </FadeUp>

          <Stagger
            staggerDelay={0.15}
            initialDelay={0.2}
            className="lg:col-span-5 grid grid-cols-1 gap-6 lg:gap-8"
          >
            {rest.map((t, idx) => (
              <StaggerItem
                key={t.name}
                className={`group relative rounded-[1.5rem] md:rounded-[2rem] p-7 md:p-10 transition-all duration-500 hover:-translate-y-1 ${
                  idx === 0
                    ? "bg-surface-container-low"
                    : "bg-surface-container"
                }`}
              >
                <div className="flex items-start justify-between mb-5 md:mb-6">
                  <span
                    aria-hidden
                    className="font-serif italic text-secondary text-5xl md:text-6xl leading-none opacity-70"
                  >
                    &ldquo;
                  </span>
                  <Rating value={t.rating ?? 5} />
                </div>

                <blockquote className="font-serif italic text-primary text-base md:text-xl leading-snug mb-6 md:mb-8">
                  {t.quote}
                </blockquote>

                <div className="flex items-center justify-between pt-4 md:pt-5 border-t border-outline-variant/30 gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Avatar
                      initials={t.initials}
                      gradient={t.gradient}
                      photoUrl={t.photoUrl}
                    />
                    <div>
                      <p className="font-bold text-primary text-sm">{t.name}</p>
                      {t.role && (
                        <p className="text-[10px] md:text-[11px] text-on-surface-variant uppercase tracking-wider mt-0.5">
                          {t.role}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant font-serif italic">
                    N° {String(idx + 2).padStart(2, "0")}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <FadeUp className="mt-10 md:mt-16 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-6 px-6 md:px-10 py-6 md:py-8 bg-surface-container-low rounded-[2rem] md:rounded-full">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="flex gap-0.5 text-secondary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon key={i} name="star" filled className="text-lg md:text-xl" />
              ))}
            </div>
            <div className="font-serif text-primary text-xl md:text-2xl">
              4,9<span className="text-on-surface-variant text-sm md:text-base">/5</span>
            </div>
            <span className="hidden md:block w-px h-6 bg-outline-variant/40" />
            <span className="text-xs md:text-sm text-on-surface-variant text-center">
              <span className="font-semibold text-primary">1 247</span>{" "}
              donateurs et bénévoles satisfaits
            </span>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-3 text-secondary font-semibold text-sm uppercase tracking-widest group whitespace-nowrap"
          >
            Laisser un témoignage
            <Icon name="arrow_outward" className="text-base group-hover:rotate-45 transition-transform" />
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="py-20 md:py-36 bg-surface-container">
      <div className="max-w-4xl mx-auto px-6">
        <FadeUp className="text-center mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
            Vos questions
          </p>
          <h2 className="text-4xl md:text-6xl font-serif text-primary pb-[0.08em]">
            <RevealText delay={0.1}>
              <span className="italic">Tout</span> ce qu&apos;il faut savoir.
            </RevealText>
          </h2>
        </FadeUp>
        <Stagger staggerDelay={0.08} className="space-y-3 md:space-y-4">
          {FAQ_ITEMS.map((item, idx) => (
            <StaggerItem key={item.q}>
              <details
                className="group bg-surface-container-lowest p-6 md:p-8 rounded-2xl md:rounded-3xl transition-colors hover:bg-surface-bright cursor-pointer"
                open={idx === 0}
              >
              <summary className="flex justify-between items-center list-none cursor-pointer gap-4">
                <h4 className="text-base md:text-xl font-serif text-primary">
                  {item.q}
                </h4>
                <span className="w-8 md:w-9 h-8 md:h-9 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0 group-open:rotate-45 transition-transform">
                  <Icon name="add" />
                </span>
              </summary>
                <p className="mt-4 md:mt-5 text-on-surface-variant leading-relaxed pr-2 md:pr-12 text-sm md:text-base">
                  {item.a}
                </p>
              </details>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function NewsletterCta() {
  return (
    <section className="relative py-20 md:py-36 bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Float
          duration={18}
          amplitude={35}
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-fixed-dim/25 blur-[120px] rounded-full"
        />
        <Float
          duration={22}
          amplitude={40}
          delay={2}
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary-fixed/30 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 text-center">
        <FadeUp>
          <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-5 md:mb-6">
            Rejoignez le mouvement
          </p>
          <h2 className="font-serif text-primary text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 md:mb-8 pb-[0.08em]">
            <RevealText delay={0.2}>
              <span className="italic">Restez</span> proches
            </RevealText>
            <RevealText delay={0.4}>de notre combat.</RevealText>
          </h2>
        </FadeUp>
        <Stagger staggerDelay={0.12}>
          <StaggerItem>
            <p className="text-base md:text-lg text-on-surface-variant leading-relaxed mb-10 md:mb-12 max-w-xl mx-auto">
              Une lettre mensuelle, sans bruit. Les avancées d&apos;Alya, les
              campagnes en cours, et les histoires qui nous portent.
            </p>
          </StaggerItem>

          <StaggerItem>
            <NewsletterForm source="site-cta" className="max-w-md mx-auto" />
          </StaggerItem>
          <StaggerItem>
            <p className="text-xs text-on-surface-variant mt-5 md:mt-6 italic font-serif">
              En vous inscrivant, vous acceptez notre politique de
              confidentialité.
            </p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

export default async function Home() {
  const [testimonials, partners, sanityCampaign, helloAssoStats] =
    await Promise.all([
      sanityFetch<Testimonial[]>({
        query: testimonialsQuery,
        tags: ["testimonial"],
      }),
      sanityFetch<Partner[]>({ query: partnersQuery, tags: ["partner"] }),
      sanityFetch<CampaignDoc | null>({
        query: featuredCampaignQuery,
        tags: ["campaign"],
      }),
      isHelloAssoConfigured() ? getFormStats() : Promise.resolve(null),
    ]);

  // Merge live HelloAsso stats over Sanity content when available.
  // Priority: Sanity (manual override) → HelloAsso (auto) → hardcoded fallback.
  const campaign: CampaignDoc | null = helloAssoStats
    ? {
        ...(sanityCampaign ?? ({} as CampaignDoc)),
        _id: sanityCampaign?._id ?? "live-campaign",
        title:
          sanityCampaign?.title ??
          helloAssoStats.title ??
          "En route vers le neurocytotron",
        description:
          sanityCampaign?.description ?? helloAssoStats.description ?? null,
        cover: sanityCampaign?.cover ?? (helloAssoStats.coverUrl
          ? { url: helloAssoStats.coverUrl, alt: helloAssoStats.coverAlt ?? null }
          : null),
        helloAssoUrl:
          sanityCampaign?.helloAssoUrl ?? helloAssoStats.helloAssoUrl ?? null,
        deadline: sanityCampaign?.deadline ?? helloAssoStats.endDate ?? null,
        goalAmount: helloAssoStats.goalAmount ?? sanityCampaign?.goalAmount ?? 20000,
        raisedAmount: helloAssoStats.raisedAmount,
        supporters: helloAssoStats.supporters,
      }
    : sanityCampaign;

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustStrip partners={partners} />
        <Stats />
        <Missions />
        <FounderNote />
        <FeaturedCampaign campaign={campaign} />
        <Testimonials items={testimonials} />
        <Faq />
        <NewsletterCta />
      </main>
      <Footer />
    </>
  );
}
