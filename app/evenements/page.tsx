import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { FadeUp, Stagger, StaggerItem } from "@/components/anim";
import { ArticleCover } from "@/components/article-cover";
import { sanityFetch } from "@/sanity/fetch";
import { upcomingEventsQuery, pastEventsQuery } from "@/sanity/queries";
import type { EventDoc } from "@/sanity/types";
import { formatEventRange } from "@/lib/events";

export const metadata: Metadata = {
  title: "Événements · Le Combat d'Alya",
  description:
    "Les rendez-vous de l'association : galas, conférences, ateliers, festivals. Venez nous rencontrer.",
};

export default async function EvenementsPage() {
  const [upcoming, past] = await Promise.all([
    sanityFetch<EventDoc[]>({
      query: upcomingEventsQuery,
      params: { limit: 12 },
      tags: ["event"],
    }),
    sanityFetch<EventDoc[]>({
      query: pastEventsQuery,
      params: { limit: 6 },
      tags: ["event"],
    }),
  ]);

  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Événements" },
          ]}
          eyebrow="Rencontres & rendez-vous"
          title={
            <>
              Tous nos
              <br />
              <span className="italic">événements</span>.
            </>
          }
          intro="Galas, conférences, ateliers, festivals — autant d'occasions de porter le combat d'Alya ensemble, en personne."
        />

        <section className="px-6 md:px-10 pb-20 md:pb-28">
          <FadeUp className="max-w-screen-2xl mx-auto mb-10 md:mb-14 flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3">
                À venir
              </p>
              <h2 className="font-serif text-primary text-3xl md:text-5xl leading-tight">
                Les <span className="italic">prochains</span> rendez-vous.
              </h2>
            </div>
            {upcoming.length > 0 && (
              <span className="text-on-surface-variant font-serif italic text-base md:text-lg">
                {upcoming.length} événement{upcoming.length > 1 ? "s" : ""} programmé
                {upcoming.length > 1 ? "s" : ""}
              </span>
            )}
          </FadeUp>

          {upcoming.length === 0 ? (
            <FadeUp className="max-w-2xl mx-auto text-center bg-surface-container-low rounded-[2rem] md:rounded-[3rem] p-10 md:p-14">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center mb-6">
                <Icon name="event" filled className="text-2xl" />
              </div>
              <h3 className="font-serif text-primary text-2xl md:text-3xl mb-4">
                Aucun événement <span className="italic">programmé</span> pour le moment.
              </h3>
              <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-8">
                Inscrivez-vous à notre newsletter pour être averti·e des
                prochains rendez-vous.
              </p>
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 text-secondary font-semibold text-sm uppercase tracking-widest"
              >
                Lire nos actualités
                <Icon name="arrow_forward" />
              </Link>
            </FadeUp>
          ) : (
            <Stagger
              staggerDelay={0.08}
              className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {upcoming.map((e) => (
                <StaggerItem key={e._id}>
                  <EventCard event={e} variant="upcoming" />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </section>

        {past.length > 0 && (
          <section className="px-6 md:px-10 pb-20 md:pb-28 bg-surface-container-low pt-20 md:pt-28">
            <FadeUp className="max-w-screen-2xl mx-auto mb-10 md:mb-14">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-3">
                Souvenirs
              </p>
              <h2 className="font-serif text-primary text-3xl md:text-5xl leading-tight">
                <span className="italic">Retours</span> sur nos précédents rendez-vous.
              </h2>
            </FadeUp>
            <Stagger
              staggerDelay={0.06}
              className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {past.map((e) => (
                <StaggerItem key={e._id}>
                  <EventCard event={e} variant="past" />
                </StaggerItem>
              ))}
            </Stagger>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

function EventCard({
  event,
  variant,
}: {
  event: EventDoc;
  variant: "upcoming" | "past";
}) {
  const { date, time } = formatEventRange(event.startsAt, event.endsAt);
  const isPast = variant === "past";

  return (
    <Link
      href={event.slug ? `/evenements/${event.slug}` : "/evenements"}
      className={`group flex flex-col rounded-[1.5rem] md:rounded-[2rem] overflow-hidden h-full transition-all hover:-translate-y-1 ${
        isPast ? "bg-surface-container-lowest" : "bg-surface-container-low"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <ArticleCover
          image={event.cover}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isPast ? "opacity-80 group-hover:opacity-100" : ""
          }`}
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
        <span className="absolute top-4 left-4 bg-surface-container-lowest text-primary text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 rounded-full">
          {isPast ? "Passé" : "À venir"}
        </span>
      </div>
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <span className="text-xs uppercase tracking-[0.25em] text-on-surface-variant mb-2">
          {date}
        </span>
        {time && (
          <span className="text-xs text-secondary font-semibold tracking-wider mb-4">
            {time}
          </span>
        )}
        <h3 className="font-serif text-primary text-xl md:text-2xl leading-snug mb-3 md:mb-4 group-hover:text-secondary transition-colors">
          {event.title}
        </h3>
        {event.location && (
          <p className="text-on-surface-variant text-sm flex items-center gap-2 mb-4">
            <Icon name="location_on" filled className="text-secondary text-base" />
            {event.location}
          </p>
        )}
        {event.description && (
          <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-6 flex-1 line-clamp-3">
            {event.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-secondary font-semibold text-xs uppercase tracking-widest mt-auto">
          {isPast ? "Revoir" : "Détails"}
          <Icon
            name="arrow_forward"
            className="text-sm group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </Link>
  );
}
