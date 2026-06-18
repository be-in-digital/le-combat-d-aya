import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { FadeUp, Stagger, StaggerItem } from "@/components/anim";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import { contactPageQuery } from "@/sanity/queries";
import type { ContactPage } from "@/sanity/types";
import { ContactForm } from "./contact-form";

const FALLBACK_DESCRIPTION =
  "Une question, une proposition, un partenariat ? Notre équipe vous répond.";

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<ContactPage | null>({
    query: contactPageQuery,
    tags: ["contactPage"],
  });

  return buildMetadata({
    seo: page?.seo,
    title: page?.hero?.title ?? "Contact",
    description: page?.hero?.intro ?? FALLBACK_DESCRIPTION,
    path: "/contact",
  });
}

const CONTACT_BLOCKS = [
  {
    icon: "mail",
    title: "Email général",
    primary: "contact@lecombatdalya.org",
    secondary: "Réponse sous 48 h ouvrées",
  },
  {
    icon: "favorite",
    title: "Service donateurs",
    primary: "contact@lecombatdalya.org",
    secondary: "Reçus fiscaux, dons mensuels",
  },
  {
    icon: "domain",
    title: "Mécénat entreprise",
    primary: "contact@lecombatdalya.org",
    secondary: "Mariam Nassar, fondatrice",
  },
  {
    icon: "podcasts",
    title: "Presse",
    primary: "contact@lecombatdalya.org",
    secondary: "Dossier de presse sur demande",
  },
];

const QUICK_LINKS: {
  icon: string | null;
  title: string | null;
  text: string | null;
  href: string | null;
}[] = [
  {
    icon: "favorite",
    title: "Faire un don",
    text: "En ligne, en quelques clics, paiement sécurisé.",
    href: "/aider",
  },
  {
    icon: "help",
    title: "Questions fréquentes",
    text: "Les réponses aux questions les plus courantes.",
    href: "/#faq",
  },
  {
    icon: "auto_stories",
    title: "Notre histoire",
    text: "Découvrir comment l'association est née.",
    href: "/histoire",
  },
];

const SOCIAL_LINKS = [
  { platform: "Instagram", url: "#", label: "Instagram" },
  { platform: "LinkedIn", url: "#", label: "LinkedIn" },
  { platform: "Podcast", url: "#", label: "Podcast" },
  { platform: "Newsletter", url: "#", label: "Newsletter" },
];

/** Maps a social platform name to its Material Symbols icon (existing markup). */
function socialIcon(platform?: string | null): string {
  switch (platform?.toLowerCase()) {
    case "instagram":
      return "public";
    case "linkedin":
      return "share";
    case "podcast":
      return "podcasts";
    case "newsletter":
      return "mail";
    default:
      return "public";
  }
}

export default async function ContactPage() {
  const page = await sanityFetch<ContactPage | null>({
    query: contactPageQuery,
    tags: ["contactPage"],
  });

  const channels = page?.channels?.length ? page.channels : CONTACT_BLOCKS;
  const quickLinks = page?.quickLinks?.length
    ? page.quickLinks.map((q) => ({
        icon: q.icon,
        title: q.label,
        text: null as string | null,
        href: q.href,
      }))
    : QUICK_LINKS;
  const socialLinks = page?.socialLinks?.length
    ? page.socialLinks
    : SOCIAL_LINKS;
  const hero = page?.hero;

  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Contact" },
          ]}
          eyebrow={hero?.eyebrow ?? "Parlons-en"}
          title={
            hero?.title ? (
              <>
                {hero.title}
                {hero.titleAccent ? (
                  <>
                    {" "}
                    <span className="italic">{hero.titleAccent}</span>
                  </>
                ) : null}
              </>
            ) : (
              <>
                Une question,
                <br />
                une <span className="italic">conversation</span>.
              </>
            )
          }
          intro={
            hero?.intro ??
            "Nous lisons chaque message. Que vous soyez donateur, bénévole, parent ou partenaire potentiel, notre équipe vous répond avec attention."
          }
        />

        {/* Form + sidebar */}
        <section className="px-6 md:px-10 pb-20 md:pb-28">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Form */}
            <FadeUp className="lg:col-span-7">
              <div className="bg-surface-container-lowest rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 lg:p-14">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                  Formulaire
                </p>
                <h2 className="font-serif text-primary text-3xl md:text-4xl leading-tight mb-8 md:mb-10">
                  Écrivez-nous, on s&apos;<span className="italic">occupe</span>{" "}
                  du reste.
                </h2>

                <ContactForm />
              </div>
            </FadeUp>

            {/* Sidebar */}
            <Stagger
              staggerDelay={0.12}
              initialDelay={0.2}
              className="lg:col-span-5 space-y-5 md:space-y-6"
            >
              {/* Contact channels */}
              <StaggerItem className="bg-surface-container-low rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3 md:mb-4">
                  Contacts directs
                </p>
                <h3 className="font-serif text-primary text-2xl md:text-3xl mb-8">
                  Selon votre <span className="italic">besoin</span>.
                </h3>
                <ul className="space-y-5 md:space-y-6">
                  {channels.map((c, i) => (
                    <li
                      key={c.title ?? i}
                      className="flex items-start gap-4 pb-5 md:pb-6 border-b border-outline-variant/30 last:border-0 last:pb-0"
                    >
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center flex-shrink-0">
                        <Icon name={c.icon ?? "mail"} filled className="text-lg md:text-xl" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-on-surface-variant font-semibold mb-1">
                          {c.title}
                        </p>
                        <a
                          href={`mailto:${c.primary}`}
                          className="font-serif italic text-primary text-base md:text-lg hover:text-secondary transition-colors break-words"
                        >
                          {c.primary}
                        </a>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {c.secondary}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </StaggerItem>

              {/* Address card */}
              <StaggerItem className="relative bg-primary text-on-primary rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-secondary/30 blur-[80px] rounded-full" />
                <div className="relative">
                  <Icon
                    name="location_on"
                    filled
                    className="text-secondary-fixed-dim text-3xl mb-5"
                  />
                  <p className="text-xs uppercase tracking-[0.3em] text-on-primary/70 mb-3">
                    Bureau
                  </p>
                  <p className="font-serif italic text-2xl md:text-3xl leading-snug mb-6 md:mb-8">
                    Le Combat d&apos;Alya
                    <br />
                    15 rue de la Solidarité
                    <br />
                    75011 Paris
                  </p>
                  <p className="text-sm text-on-primary/80 mb-4 md:mb-6">
                    Du lundi au vendredi · 9 h — 18 h
                    <br />
                    Sur rendez-vous uniquement
                  </p>
                  <a
                    href="https://www.openstreetmap.org/?mlat=48.8566&mlon=2.3522#map=15/48.8566/2.3522"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary-fixed-dim font-semibold text-sm uppercase tracking-widest hover:gap-3 transition-all"
                  >
                    Voir sur la carte
                    <Icon name="arrow_outward" className="text-base" />
                  </a>
                </div>
              </StaggerItem>

              {/* Social */}
              <StaggerItem className="bg-surface-container-lowest rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3 md:mb-4">
                  Réseaux
                </p>
                <h3 className="font-serif text-primary text-xl md:text-2xl mb-6">
                  Suivre l&apos;association
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((s, i) => (
                    <a
                      key={s.label ?? s.platform ?? i}
                      href={s.url || "#"}
                      className="w-11 h-11 rounded-full border border-outline-variant/40 flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary hover:border-primary transition-all"
                      aria-label={s.label ?? s.platform}
                    >
                      <Icon name={socialIcon(s.platform)} className="text-lg" />
                    </a>
                  ))}
                </div>
              </StaggerItem>
            </Stagger>
          </div>
        </section>

        {/* Quick links */}
        <section className="py-20 md:py-28 px-6 md:px-10 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto">
            <FadeUp className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                Pour aller plus vite
              </p>
              <h2 className="font-serif text-primary text-3xl md:text-5xl leading-[1.05]">
                <span className="italic">Réponses</span> immédiates.
              </h2>
            </FadeUp>
            <Stagger
              staggerDelay={0.1}
              className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
            >
              {quickLinks.map((q, i) => (
                <StaggerItem key={q.title ?? i}>
                  <Link
                    href={q.href ?? "#"}
                    className="group bg-surface-container-lowest rounded-[1.5rem] md:rounded-[2rem] p-7 md:p-8 transition-all hover:-translate-y-1 block h-full"
                  >
                  <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center mb-5">
                    <Icon name={q.icon ?? "arrow_forward"} filled />
                  </div>
                  <h3 className="font-serif text-primary text-xl md:text-2xl mb-3">
                    {q.title}
                  </h3>
                  {q.text ? (
                    <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-5">
                      {q.text}
                    </p>
                  ) : null}
                    <div className="flex items-center gap-2 text-secondary font-semibold text-xs uppercase tracking-widest">
                      Continuer
                      <Icon
                        name="arrow_forward"
                        className="text-sm group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
