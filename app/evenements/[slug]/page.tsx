import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { FadeUp } from "@/components/anim";
import { ArticleCover } from "@/components/article-cover";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";
import { sanityFetch } from "@/sanity/fetch";
import { eventBySlugQuery, eventSlugsQuery } from "@/sanity/queries";
import type { EventDoc } from "@/sanity/types";
import { formatEventRange } from "@/lib/events";

type Params = { slug: string };

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: eventSlugsQuery,
    tags: ["event"],
  });
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await sanityFetch<EventDoc | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: ["event", `event:${slug}`],
  });

  if (!event) return { title: "Événement introuvable · Le Combat d'Alya" };

  return {
    title: `${event.title} · Le Combat d'Alya`,
    description: event.description ?? undefined,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
      images: event.cover?.url ? [event.cover.url] : undefined,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const event = await sanityFetch<EventDoc | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: ["event", `event:${slug}`],
  });

  if (!event) notFound();

  const { date, time } = formatEventRange(event.startsAt, event.endsAt);
  // Server-rendered at request/revalidate time; `now` snapshot is intentional.
  // eslint-disable-next-line react-hooks/purity
  const isPast = new Date(event.startsAt).getTime() < Date.now();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description ?? undefined,
    startDate: event.startsAt,
    endDate: event.endsAt ?? undefined,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: event.location
      ? {
          "@type": "Place",
          name: event.location,
          address: event.address ?? event.location,
        }
      : undefined,
    image: event.cover?.url ? [event.cover.url] : undefined,
    url: `${SITE_URL}/evenements/${event.slug}`,
    organizer: {
      "@type": "Organization",
      name: "Le Combat d'Alya",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: SITE_URL },
          { name: "Événements", url: `${SITE_URL}/evenements` },
          { name: event.title, url: `${SITE_URL}/evenements/${event.slug}` },
        ]}
      />
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Événements", href: "/evenements" },
            { label: event.title },
          ]}
          eyebrow={isPast ? "Événement passé" : "Événement à venir"}
          title={<>{event.title}</>}
          intro={event.description ?? undefined}
          meta={`${date}${time ? ` · ${time}` : ""}`}
        />

        <section className="px-6 md:px-10 pb-16 md:pb-24">
          <FadeUp className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-7">
                {event.cover?.url && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] md:rounded-[3rem]">
                    <ArticleCover
                      image={event.cover}
                      alt={event.title}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      priority
                    />
                  </div>
                )}
              </div>

              <aside className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start space-y-6">
                <div className="bg-surface-container-low rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10">
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                    Détails pratiques
                  </p>
                  <dl className="space-y-5">
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant font-semibold mb-1.5">
                        Date
                      </dt>
                      <dd className="font-serif text-primary text-lg md:text-xl">
                        {date}
                      </dd>
                    </div>
                    {time && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant font-semibold mb-1.5">
                          Horaire
                        </dt>
                        <dd className="font-serif text-primary text-lg md:text-xl">
                          {time}
                        </dd>
                      </div>
                    )}
                    {event.location && (
                      <div>
                        <dt className="text-[10px] uppercase tracking-[0.25em] text-on-surface-variant font-semibold mb-1.5">
                          Lieu
                        </dt>
                        <dd className="font-serif text-primary text-lg md:text-xl">
                          {event.location}
                          {event.address && (
                            <span className="block text-sm text-on-surface-variant font-sans not-italic mt-1">
                              {event.address}
                            </span>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-8 space-y-3">
                    {event.registrationUrl && !isPast && (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary py-4 rounded-full text-sm font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                      >
                        S&apos;inscrire
                        <Icon name="arrow_outward" className="text-base" />
                      </a>
                    )}
                    <a
                      href={`/api/events/${event.slug}/ics`}
                      className="w-full bg-surface-container-high text-primary py-4 rounded-full text-sm font-semibold flex items-center justify-center gap-3 hover:bg-surface-container-highest transition-colors"
                    >
                      <Icon name="calendar_add_on" />
                      Ajouter à mon agenda (.ics)
                    </a>
                  </div>
                </div>

                <Link
                  href="/evenements"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest hover:text-secondary transition-colors"
                >
                  <Icon name="arrow_back" />
                  Tous les événements
                </Link>
              </aside>
            </div>

            {event.description && (
              <div className="max-w-2xl mx-auto mt-16 md:mt-20">
                <h2 className="font-serif text-primary text-2xl md:text-3xl mb-6">
                  <span className="italic">À propos</span> de l&apos;événement
                </h2>
                <p className="text-base md:text-lg text-on-surface leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}
          </FadeUp>
        </section>
      </main>
      <Footer />
    </>
  );
}
