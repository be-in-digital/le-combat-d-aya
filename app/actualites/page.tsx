import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { FadeUp, Stagger, StaggerItem } from "@/components/anim";
import { ArticleCover } from "@/components/article-cover";
import { NewsletterForm } from "@/components/newsletter-form";
import { sanityFetch } from "@/sanity/fetch";
import {
  featuredArticleQuery,
  articlesQuery,
  articleCategoriesQuery,
} from "@/sanity/queries";
import type { ArticleCard, FeaturedArticle } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Actualités · Le Combat d'Alya",
  description:
    "Les dernières nouvelles d'Alya, de l'association, des campagnes et des familles que nous accompagnons.",
};

const HERO_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg/v1/fill/w_1066,h_740,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg";
const CAMPAIGN_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b288a16560794a2a9e6cf5122dd22d69~mv2.jpg/v1/fill/w_780,h_1124,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-07-12%20%C3%A0%2014_30_08_ba15ba8b.jpg";

const FALLBACK_FEATURED: FeaturedArticle = {
  _id: "fallback-featured",
  slug: "fauteuil-multisensoriel-alya",
  title: "Le fauteuil multisensoriel d'Alya : à 62 % de l'objectif",
  category: "Campagne",
  excerpt:
    "En trois mois, 847 contributrices et contributeurs ont permis de réunir 12 450 € sur les 20 000 € nécessaires. Retour sur cette mobilisation hors norme — et ce qui reste à accomplir avant l'été.",
  publishedAt: "2026-05-12",
  readingTime: 6,
  cover: { url: CAMPAIGN_IMAGE },
};

const FALLBACK_ARTICLES: ArticleCard[] = [
  {
    _id: "fallback-1",
    slug: "barcelone-trois-familles",
    title: "Barcelone : trois familles partent en rééducation cet été",
    category: "Programme",
    excerpt:
      "Grâce au partenariat avec la clinique Vall d'Hebron, trois enfants accédéront à un protocole de neurorééducation inédit.",
    publishedAt: "2026-04-28",
    cover: { url: HERO_IMAGE },
  },
  {
    _id: "fallback-2",
    slug: "voix-dalya-bordeaux",
    title: "« Voix d'Alya » : le festival fait sa rentrée à Bordeaux",
    category: "Communauté",
    excerpt:
      "Concerts, conférences, ateliers : le festival de sensibilisation s'installera à Bordeaux du 12 au 14 septembre 2026.",
    publishedAt: "2026-04-15",
    cover: { url: CAMPAIGN_IMAGE },
  },
  {
    _id: "fallback-3",
    slug: "mediapart-dossier",
    title: "Mediapart consacre un dossier aux maladies rares pédiatriques",
    category: "Partenariat",
    excerpt:
      "Un travail journalistique de six mois pour mettre en lumière le combat de huit familles, dont celle d'Alya.",
    publishedAt: "2026-04-03",
    cover: { url: HERO_IMAGE },
  },
  {
    _id: "fallback-4",
    slug: "rapport-activite-2025",
    title: "Rapport d'activité 2025 : 85 % des dons reversés aux programmes",
    category: "Transparence",
    excerpt:
      "Comme chaque année, le bilan financier détaillé est disponible en libre accès. Découvrez où sont allés vos dons.",
    publishedAt: "2026-03-20",
    cover: { url: CAMPAIGN_IMAGE },
  },
  {
    _id: "fallback-5",
    slug: "sophie-temoignage",
    title: "« Cette association nous a sauvé du naufrage »",
    category: "Témoignage",
    excerpt:
      "Sophie raconte comment l'accompagnement des familles l'a aidée à traverser le diagnostic de sa fille.",
    publishedAt: "2026-03-08",
    cover: { url: HERO_IMAGE },
  },
  {
    _id: "fallback-6",
    slug: "atelier-lumiere-mecene",
    title: "Une nouvelle entreprise rejoint nos mécènes : Atelier Lumière",
    category: "Mécénat",
    excerpt:
      "L'atelier de lutherie parisien s'engage sur trois ans pour financer notre programme d'équipement.",
    publishedAt: "2026-02-22",
    cover: { url: CAMPAIGN_IMAGE },
  },
];

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(iso: string) {
  return DATE_FORMATTER.format(new Date(iso));
}

export default async function ActualitesPage() {
  const [featured, articles, categoriesRaw] = await Promise.all([
    sanityFetch<FeaturedArticle | null>({
      query: featuredArticleQuery,
      tags: ["article"],
    }),
    sanityFetch<ArticleCard[]>({
      query: articlesQuery,
      params: { limit: 12, exclude: null },
      tags: ["article"],
    }),
    sanityFetch<string[]>({
      query: articleCategoriesQuery,
      tags: ["article"],
    }),
  ]);

  const usingFallback = articles.length === 0;
  const featuredArticle =
    featured ?? (usingFallback ? FALLBACK_FEATURED : articles[0] ?? null);
  const articleList = usingFallback
    ? FALLBACK_ARTICLES
    : articles.filter((a) => a._id !== featuredArticle?._id);

  const categories = ["Tous", ...new Set(categoriesRaw.filter(Boolean))];
  if (usingFallback) {
    const fallbackCats = Array.from(
      new Set(FALLBACK_ARTICLES.map((a) => a.category).filter(Boolean) as string[]),
    );
    categories.splice(1, categories.length - 1, ...fallbackCats);
  }

  return (
    <>
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Actualités" },
          ]}
          eyebrow="Le journal de notre combat"
          title={
            <>
              Toutes nos
              <br />
              <span className="italic">actualités</span>.
            </>
          }
          intro="Campagnes, programmes, témoignages, partenariats : tout ce qui anime l'association, raconté en toute transparence."
          meta={
            featuredArticle?.publishedAt
              ? `Mise à jour le ${formatDate(featuredArticle.publishedAt)}`
              : undefined
          }
        />

        {/* Featured article */}
        {featuredArticle && (
          <section className="px-6 md:px-10 pb-16 md:pb-24">
            <FadeUp className="max-w-screen-2xl mx-auto">
              <Link
                href={`/actualites/${featuredArticle.slug}`}
                className="group block bg-surface-container-lowest rounded-[2rem] md:rounded-[3rem] overflow-hidden transition-all hover:-translate-y-1"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[480px] overflow-hidden">
                    <ArticleCover
                      image={featuredArticle.cover}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      priority
                    />
                    {featuredArticle.category && (
                      <span className="absolute top-5 md:top-7 left-5 md:left-7 bg-surface-container-lowest text-primary text-[10px] uppercase tracking-[0.3em] font-bold px-4 py-2 rounded-full">
                        À la une · {featuredArticle.category}
                      </span>
                    )}
                  </div>
                  <div className="lg:col-span-5 p-8 md:p-12 lg:p-14 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-on-surface-variant mb-6">
                        <span>{formatDate(featuredArticle.publishedAt)}</span>
                        {featuredArticle.readingTime ? (
                          <>
                            <span className="w-1 h-1 rounded-full bg-on-surface-variant/40" />
                            <span>{featuredArticle.readingTime} min de lecture</span>
                          </>
                        ) : null}
                      </div>
                      <h2 className="font-serif text-primary text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-6 md:mb-8 group-hover:text-secondary transition-colors">
                        {featuredArticle.title}
                      </h2>
                      {featuredArticle.excerpt && (
                        <p className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                          {featuredArticle.excerpt}
                        </p>
                      )}
                    </div>
                    <div className="mt-8 md:mt-10 flex items-center gap-3 text-secondary font-semibold text-sm uppercase tracking-widest">
                      Lire l&apos;article
                      <Icon
                        name="arrow_forward"
                        className="text-base group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeUp>
          </section>
        )}

        {/* Filter pills (display-only for now) */}
        {categories.length > 1 && (
          <section className="px-6 md:px-10 pb-12 md:pb-16">
            <div className="max-w-screen-2xl mx-auto">
              <div className="flex items-center gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
                {categories.map((cat, idx) => (
                  <button
                    key={cat}
                    type="button"
                    className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                      idx === 0
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-low text-primary hover:bg-surface-container-high"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Articles grid */}
        <section className="px-6 md:px-10 pb-20 md:pb-28">
          {articleList.length > 0 ? (
            <Stagger
              staggerDelay={0.08}
              className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {articleList.map((a) => (
                <StaggerItem key={a._id}>
                  <Link
                    href={`/actualites/${a.slug}`}
                    className="group bg-surface-container-low rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex flex-col transition-all hover:-translate-y-1 h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ArticleCover
                        image={a.cover}
                        alt={a.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                      {a.category && (
                        <span className="absolute top-4 left-4 bg-surface-container-lowest text-primary text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 rounded-full">
                          {a.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <span className="text-xs uppercase tracking-[0.25em] text-on-surface-variant mb-4">
                        {formatDate(a.publishedAt)}
                      </span>
                      <h3 className="font-serif text-primary text-xl md:text-2xl leading-snug mb-3 md:mb-4 group-hover:text-secondary transition-colors">
                        {a.title}
                      </h3>
                      {a.excerpt && (
                        <p className="text-on-surface-variant text-sm md:text-base leading-relaxed mb-6 flex-1">
                          {a.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-secondary font-semibold text-xs uppercase tracking-widest">
                        Lire
                        <Icon
                          name="arrow_forward"
                          className="text-sm group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <FadeUp className="max-w-screen-md mx-auto text-center py-12">
              <p className="text-on-surface-variant text-base md:text-lg">
                Aucun article pour l&apos;instant. Revenez bientôt.
              </p>
            </FadeUp>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="relative py-20 md:py-32 px-6 md:px-10 bg-surface-container-low overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary-fixed-dim/25 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary-fixed/30 blur-[120px] rounded-full" />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4 md:mb-6">
              Newsletter
            </p>
            <h2 className="font-serif text-primary text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-6 md:mb-8">
              <span className="italic">Une lettre</span> mensuelle, sans bruit.
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant mb-10 md:mb-12">
              Recevez nos avancées, campagnes et histoires directement dans
              votre boîte mail.
            </p>
            <NewsletterForm source="site-cta" className="max-w-md mx-auto" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
