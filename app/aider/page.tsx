import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { FadeUp, Magnetic, Stagger, StaggerItem } from "@/components/anim";
import {
  HELLOASSO_URL,
  HELLOASSO_WIDGET_URL,
  HELLOASSO_GENERAL_FORM,
} from "@/components/site-data";
import {
  getRecentDonations,
  isHelloAssoConfigured,
  type RecentDonation,
} from "@/lib/helloasso";
import { sanityFetch } from "@/sanity/fetch";
import { helpPageQuery } from "@/sanity/queries";
import type { HelpPage } from "@/sanity/types";
import { buildMetadata } from "@/lib/seo";

const FALLBACK_DESCRIPTION =
  "Faire un don, devenir bénévole, soutenir en nature ou en tant qu'entreprise — toutes les façons de rejoindre le combat.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<HelpPage | null>({
    query: helpPageQuery,
    tags: ["helpPage"],
  });

  return buildMetadata({
    seo: page?.seo,
    title: page?.hero?.title ?? "Comment aider",
    description: page?.hero?.intro ?? FALLBACK_DESCRIPTION,
    path: "/aider",
  });
}

const WAYS = [
  {
    icon: "favorite",
    eyebrow: "01 · Le plus simple",
    title: "Faire un don",
    italic: "don",
    text: "Un don ponctuel ou mensuel. 66 % déductible de vos impôts. Chaque euro est tracé et publié dans notre rapport annuel.",
    cta: "Donner maintenant",
    href: "#don",
    bg: "bg-gradient-to-br from-secondary to-[#e01e62]",
    text_color: "text-white",
    on_bg: "text-white/85",
    pill: "bg-white/15 text-white",
  },
  {
    icon: "volunteer_activism",
    eyebrow: "02 · Donner du temps",
    title: "Devenir bénévole",
    italic: "bénévole",
    text: "Événementiel, communication, écoute, accompagnement administratif. Quelques heures par mois suffisent pour faire la différence.",
    cta: "Postuler",
    href: "/contact?sujet=benevolat",
    bg: "bg-surface-container-lowest",
    text_color: "text-primary",
    on_bg: "text-on-surface-variant",
    pill: "bg-secondary-fixed text-secondary",
  },
  {
    icon: "redeem",
    eyebrow: "03 · Don en nature",
    title: "Soutien matériel",
    italic: "matériel",
    text: "Équipement médical neuf ou récent, matériel pédagogique, fournitures pour nos événements. Tous les dons en nature sont reçus avec gratitude.",
    cta: "Voir les besoins",
    href: "/contact?sujet=don-materiel",
    bg: "bg-surface-container-low",
    text_color: "text-primary",
    on_bg: "text-on-surface-variant",
    pill: "bg-primary-fixed text-primary",
  },
  {
    icon: "domain",
    eyebrow: "04 · Mécénat",
    title: "Entreprise mécène",
    italic: "mécène",
    text: "Mécénat financier, de compétences ou en nature : votre entreprise peut s'engager à nos côtés et bénéficier de 60 % de déduction fiscale.",
    cta: "Nous écrire",
    href: "/contact?sujet=mecenat",
    bg: "bg-surface-container",
    text_color: "text-primary",
    on_bg: "text-on-surface-variant",
    pill: "bg-surface-container-highest text-primary",
  },
];

// Style palette cycled by index when mapping Sanity `ways` (which carry only
// content). Mirrors the styling fields baked into the hardcoded WAYS above.
const WAY_STYLES = WAYS.map((w) => ({
  eyebrow: w.eyebrow,
  italic: w.italic,
  bg: w.bg,
  text_color: w.text_color,
  on_bg: w.on_bg,
  pill: w.pill,
}));

function adaptWay(
  way: NonNullable<HelpPage["ways"]>[number],
  index: number,
): (typeof WAYS)[number] {
  const style = WAY_STYLES[index % WAY_STYLES.length];
  return {
    icon: way.icon ?? "favorite",
    eyebrow: style.eyebrow,
    title: way.title ?? "",
    italic: "",
    text: way.text ?? "",
    cta: way.ctaLabel ?? "",
    href: way.ctaHref ?? "#",
    bg: style.bg,
    text_color: style.text_color,
    on_bg: style.on_bg,
    pill: style.pill,
  };
}

const STEPS = [
  {
    step: "01",
    title: "Vous donnez",
    text: "En ligne, par virement ou par chèque. Reçu fiscal envoyé sous 48 h.",
  },
  {
    step: "02",
    title: "Nous priorisons",
    text: "Le conseil d'administration alloue les fonds aux campagnes les plus urgentes et aux programmes en cours.",
  },
  {
    step: "03",
    title: "Vous suivez l'impact",
    text: "Newsletter mensuelle, rapport annuel, photos et témoignages. Vous voyez chaque euro à l'œuvre.",
  },
];

const EUR_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `il y a ${diffD} j`;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function DonorAvatar({ name }: { name: string }) {
  const initials = name === "Donateur anonyme"
    ? "—"
    : name
        .split(/\s+/)
        .map((p) => p.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");
  const seed = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const gradients = [
    "from-secondary to-[#e01e62]",
    "from-primary to-primary-container",
    "from-[#a26369] to-[#864b51]",
    "from-[#7a5a5e] to-primary",
  ];
  const gradient = gradients[seed % gradients.length];
  return (
    <div
      className={`w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

function DonationCard({ donation }: { donation: RecentDonation }) {
  return (
    <article className="bg-surface-container-lowest rounded-2xl md:rounded-3xl p-5 md:p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <DonorAvatar name={donation.donorName} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-primary text-sm truncate">
            {donation.donorName}
          </p>
          <p className="text-[11px] text-on-surface-variant uppercase tracking-[0.15em] mt-0.5">
            {formatRelativeDate(donation.date)}
          </p>
        </div>
        {donation.amount !== null && (
          <span className="font-serif text-secondary text-xl md:text-2xl leading-none whitespace-nowrap">
            {EUR_FORMATTER.format(donation.amount)}
          </span>
        )}
      </div>
      {donation.message ? (
        <p className="text-on-surface-variant italic font-serif text-sm md:text-base leading-relaxed flex-1">
          &ldquo;{donation.message}&rdquo;
        </p>
      ) : (
        <p className="text-on-surface-variant/60 italic font-serif text-sm leading-relaxed flex-1">
          Un soutien chaleureux pour Alya.
        </p>
      )}
    </article>
  );
}

function RecentDonations({ donations }: { donations: RecentDonation[] }) {
  if (donations.length === 0) return null;
  return (
    <section className="px-6 md:px-10 pb-16 md:pb-24">
      <div className="max-w-screen-2xl mx-auto">
        <FadeUp className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold">
                En direct · Mur des soutiens
              </p>
            </div>
            <h2 className="font-serif text-primary text-3xl md:text-5xl leading-[1.05]">
              Les <span className="italic">derniers gestes</span> qui font la
              différence.
            </h2>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant font-serif italic max-w-sm">
            Chaque don, chaque mot, chaque main tendue construit le combat
            d&apos;Alya.
          </p>
        </FadeUp>

        <Stagger
          staggerDelay={0.07}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
        >
          {donations.map((d) => (
            <StaggerItem key={d.id}>
              <DonationCard donation={d} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export default async function AiderPage() {
  const [page, donations] = await Promise.all([
    sanityFetch<HelpPage | null>({
      query: helpPageQuery,
      tags: ["helpPage"],
    }),
    isHelloAssoConfigured()
      ? getRecentDonations({ ...HELLOASSO_GENERAL_FORM, limit: 8 })
      : Promise.resolve([] as RecentDonation[]),
  ]);

  const hero = page?.hero;
  const stepsHeading = page?.stepsHeading;
  const taxSection = page?.taxSection;
  const ways = page?.ways?.length ? page.ways.map(adaptWay) : WAYS;
  const steps = page?.steps?.length
    ? page.steps.map((s, idx) => ({
        step: s.number ?? String(idx + 1).padStart(2, "0"),
        title: s.title ?? "",
        text: s.text ?? "",
      }))
    : STEPS;

  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Comment aider" },
          ]}
          eyebrow={hero?.eyebrow ?? "Rejoindre le combat"}
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
                Plus d&apos;une façon
                <br />
                de <span className="italic">soutenir Alya</span>.
              </>
            )
          }
          intro={
            hero?.intro ??
            "Don, bénévolat, soutien matériel, mécénat d'entreprise : chaque forme de soutien compte. Choisissez la façon qui vous ressemble."
          }
        />

        {/* HelloAsso donation widget */}
        <section
          id="don"
          className="px-6 md:px-10 pb-16 md:pb-24 scroll-mt-32"
        >
          <FadeUp className="max-w-screen-2xl mx-auto">
            <div className="bg-surface-container-low rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-12 lg:p-14">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-10">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3 md:mb-4">
                    Faire un don sécurisé
                  </p>
                  <h2 className="font-serif text-primary text-3xl md:text-5xl leading-tight">
                    Donner, <span className="italic">simplement</span>.
                  </h2>
                  <p className="text-on-surface-variant mt-4 md:mt-5 text-sm md:text-base font-serif italic max-w-lg">
                    Paiement sécurisé HelloAsso · Reçu fiscal automatique · 66 %
                    déductible
                  </p>
                </div>
                <a
                  href={HELLOASSO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-secondary font-semibold text-sm uppercase tracking-widest group whitespace-nowrap"
                >
                  Ouvrir sur HelloAsso
                  <Icon
                    name="arrow_outward"
                    className="text-base group-hover:rotate-45 transition-transform"
                  />
                </a>
              </div>

              <div className="bg-surface-container-lowest rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                <iframe
                  id="haWidget"
                  src={HELLOASSO_WIDGET_URL}
                  title="Faire un don à Le Combat d'Alya"
                  loading="lazy"
                  allow="payment"
                  className="w-full h-[720px] md:h-[760px] border-0 bg-transparent"
                />
              </div>

              <div className="mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
                {[
                  {
                    icon: "lock",
                    title: "Paiement sécurisé",
                    text: "Stripe · 3D Secure",
                  },
                  {
                    icon: "receipt_long",
                    title: "Reçu fiscal automatique",
                    text: "CERFA envoyé sous 48 h",
                  },
                  {
                    icon: "verified_user",
                    title: "Aucuns frais cachés",
                    text: "HelloAsso est gratuit pour l'association",
                  },
                ].map((b) => (
                  <div
                    key={b.title}
                    className="flex items-start gap-3 sm:gap-4 bg-surface-container-lowest rounded-2xl p-4 md:p-5"
                  >
                    <span className="w-9 h-9 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0">
                      <Icon name={b.icon} filled className="text-lg" />
                    </span>
                    <div>
                      <p className="font-semibold text-primary text-sm">
                        {b.title}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {b.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Live wall of recent donations */}
        <RecentDonations donations={donations} />

        {/* Ways to help */}
        <section className="py-16 md:py-24 px-6 md:px-10 bg-background">
          <div className="max-w-screen-2xl mx-auto">
            <div className="max-w-2xl mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                Quatre façons d&apos;agir
              </p>
              <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.02]">
                Le don n&apos;est pas la <span className="italic">seule</span>{" "}
                façon.
              </h2>
            </div>

            <Stagger
              staggerDelay={0.1}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8"
            >
              {ways.map((w) => (
                <StaggerItem
                  key={w.title}
                  className={`relative ${w.bg} rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 flex flex-col overflow-hidden transition-all hover:-translate-y-1`}
                >
                  <div className="flex items-start justify-between mb-6 md:mb-8">
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${w.pill} flex items-center justify-center`}
                    >
                      <Icon name={w.icon} filled className="text-2xl md:text-3xl" />
                    </div>
                    <span
                      className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${w.text_color} opacity-70`}
                    >
                      {w.eyebrow}
                    </span>
                  </div>
                  <h3
                    className={`font-serif text-3xl md:text-4xl ${w.text_color} mb-4 md:mb-5 leading-tight`}
                  >
                    {w.title.split(w.italic)[0]}
                    <span className="italic">{w.italic}</span>
                    {w.title.split(w.italic)[1]}
                  </h3>
                  <p className={`${w.on_bg} text-base md:text-lg leading-relaxed mb-8 md:mb-10 flex-1`}>
                    {w.text}
                  </p>
                  <Link
                    href={w.href}
                    className={`inline-flex items-center gap-2 ${w.text_color} font-semibold text-sm uppercase tracking-widest group self-start`}
                  >
                    {w.cta}
                    <Icon
                      name="arrow_forward"
                      className="text-base group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-36 px-6 md:px-10 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                {stepsHeading?.eyebrow ?? "Comment ça marche"}
              </p>
              <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.02]">
                {stepsHeading?.title ?? (
                  <>
                    <span className="italic">Trois étapes</span>, zéro mystère.
                  </>
                )}
              </h2>
            </div>

            <Stagger
              staggerDelay={0.18}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative"
            >
              <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-px bg-outline-variant/40 -z-10" />
              {steps.map((s) => (
                <StaggerItem key={s.step} className="text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-container-lowest border-4 border-surface-container-low mx-auto mb-6 flex items-center justify-center">
                    <span className="font-serif italic text-secondary text-3xl md:text-4xl">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-primary text-2xl md:text-3xl mb-3 md:mb-4">
                    {s.title}
                  </h3>
                  <p className="text-on-surface-variant leading-relaxed text-base md:text-lg max-w-xs mx-auto">
                    {s.text}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Tax info */}
        <section className="py-16 md:py-24 px-6 md:px-10 bg-background">
          <FadeUp className="max-w-5xl mx-auto bg-primary text-on-primary rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 lg:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-secondary/30 blur-[100px] rounded-full" />

            <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-7">
                <p className="text-xs uppercase tracking-[0.3em] text-on-primary/70 font-semibold mb-4">
                  Avantage fiscal
                </p>
                <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-5 md:mb-6">
                  {taxSection?.title ?? (
                    <>
                      <span className="italic">66 %</span> de votre don
                      déductible.
                    </>
                  )}
                </h2>
                <p className="text-on-primary/85 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                  {taxSection?.text ??
                    "Le Combat d'Alya est une association reconnue d'intérêt général. Vos dons donnent droit à une réduction d'impôt sur le revenu de 66 %, dans la limite de 20 % du revenu imposable."}
                </p>
                <p className="text-on-primary/70 text-sm italic font-serif">
                  {taxSection?.note ??
                    "Pour les entreprises : 60 % de réduction d'impôt sur les sociétés."}
                </p>
              </div>
              <div className="md:col-span-5">
                <div className="bg-on-primary/10 backdrop-blur-md rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.3em] text-on-primary/70 mb-3">
                    Exemple
                  </p>
                  <div className="flex items-end gap-4 mb-3">
                    <span className="font-serif text-4xl md:text-5xl">100 €</span>
                    <span className="text-sm text-on-primary/70 pb-1">de don</span>
                  </div>
                  <div className="h-px bg-on-primary/20 my-4" />
                  <div className="flex items-end gap-4">
                    <span className="font-serif italic text-3xl md:text-4xl text-secondary-fixed-dim">
                      34 €
                    </span>
                    <span className="text-sm text-on-primary/70 pb-1">
                      coût réel après déduction
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32 px-6 md:px-10 bg-surface-container-low">
          <FadeUp className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-6">
              Prêt à agir ?
            </p>
            <h2 className="font-serif text-primary text-4xl md:text-6xl leading-[1.05] mb-6 md:mb-8">
              <span className="italic">Chaque geste</span> compte.
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant mb-10 md:mb-12 max-w-xl mx-auto">
              Une question avant de vous engager ? Notre équipe est à votre
              écoute.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Magnetic>
                <Link
                  href="#don"
                  className="bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-8 md:px-10 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 shadow-[0_12px_32px_-8px_rgba(184,0,75,0.4)] hover:scale-[1.03] transition-transform w-full sm:w-auto"
                >
                  <Icon name="favorite" filled />
                  Faire un don
                </Link>
              </Magnetic>
              <Link
                href="/contact"
                className="bg-transparent text-primary px-8 md:px-10 py-4 rounded-full font-semibold text-base border border-primary/20 hover:bg-surface-container-high transition-colors text-center"
              >
                Poser une question
              </Link>
            </div>
          </FadeUp>
        </section>
      </main>
      <Footer />
    </>
  );
}
