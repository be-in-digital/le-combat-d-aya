import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { PageHero } from "@/components/page-hero";
import { FadeUp, Stagger, StaggerItem } from "@/components/anim";
import { ArticleCover } from "@/components/article-cover";
import { portableComponents } from "@/components/portable-text";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { sanityFetch } from "@/sanity/fetch";
import {
  articleBySlugQuery,
  articleSlugsQuery,
  articlesQuery,
} from "@/sanity/queries";
import type { Article, ArticleCard } from "@/sanity/types";

type Params = { slug: string };

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(iso: string) {
  return DATE_FORMATTER.format(new Date(iso));
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({
    query: articleSlugsQuery,
    tags: ["article"],
  });
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await sanityFetch<Article | null>({
    query: articleBySlugQuery,
    params: { slug },
    tags: ["article", `article:${slug}`],
  });

  if (!article) return { title: "Article introuvable · Le Combat d'Alya" };

  return buildMetadata({
    seo: article.seo,
    title: article.title,
    description: article.excerpt,
    path: `/actualites/${article.slug}`,
    // Fall back to the cover image for sharing when no dedicated OG image set.
    ...(article.seo?.ogImage?.url
      ? {}
      : article.cover?.url
        ? { seo: { ...article.seo, ogImage: { url: article.cover.url, alt: article.title } } }
        : {}),
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const [article, related] = await Promise.all([
    sanityFetch<Article | null>({
      query: articleBySlugQuery,
      params: { slug },
      tags: ["article", `article:${slug}`],
    }),
    sanityFetch<ArticleCard[]>({
      query: articlesQuery,
      params: { limit: 4, exclude: null },
      tags: ["article"],
    }),
  ]);

  if (!article) notFound();

  const relatedArticles = related.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <>
      <ArticleJsonLd
        title={article.title}
        description={article.excerpt}
        slug={article.slug}
        imageUrl={article.cover?.url ?? null}
        publishedAt={article.publishedAt}
        author={article.author}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: SITE_URL },
          { name: "Actualités", url: `${SITE_URL}/actualites` },
          { name: article.title, url: `${SITE_URL}/actualites/${article.slug}` },
        ]}
      />
      <Nav />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Accueil", href: "/" },
            { label: "Actualités", href: "/actualites" },
            { label: article.category ?? "Article" },
          ]}
          eyebrow={article.category ?? "Article"}
          title={<>{article.title}</>}
          intro={article.excerpt ?? undefined}
          meta={[
            formatDate(article.publishedAt),
            article.author ? `Par ${article.author}` : null,
            article.readingTime ? `${article.readingTime} min de lecture` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        />

        {article.cover?.url && (
          <section className="px-6 md:px-10 pb-12 md:pb-16">
            <FadeUp className="max-w-screen-xl mx-auto">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] md:rounded-[3rem]">
                <ArticleCover
                  image={article.cover}
                  alt={article.title}
                  sizes="(min-width: 1280px) 1200px, 100vw"
                  priority
                />
              </div>
            </FadeUp>
          </section>
        )}

        <article className="px-6 md:px-10 pb-20 md:pb-28">
          <FadeUp className="max-w-2xl mx-auto prose-anchor">
            {article.body ? (
              <PortableText
                value={article.body}
                components={portableComponents}
              />
            ) : (
              <p className="text-on-surface-variant">
                Cet article n&apos;a pas encore de contenu.
              </p>
            )}

            <div className="mt-16 pt-10 border-t border-outline-variant/30 flex items-center justify-between gap-4 flex-wrap">
              <Link
                href="/actualites"
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest hover:text-secondary transition-colors"
              >
                <Icon name="arrow_back" />
                Toutes les actualités
              </Link>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-on-surface-variant">
                Partager
                <a
                  href={`mailto:?subject=${encodeURIComponent(article.title)}`}
                  className="w-10 h-10 rounded-full bg-surface-container-low text-primary hover:bg-surface-container-high flex items-center justify-center transition-colors"
                  aria-label="Partager par email"
                >
                  <Icon name="mail" className="text-base" />
                </a>
              </div>
            </div>
          </FadeUp>
        </article>

        {relatedArticles.length > 0 && (
          <section className="py-20 md:py-28 px-6 md:px-10 bg-surface-container-low">
            <div className="max-w-screen-2xl mx-auto">
              <FadeUp className="mb-10 md:mb-14">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-4">
                  À lire ensuite
                </p>
                <h2 className="font-serif text-primary text-3xl md:text-5xl leading-tight">
                  D&apos;autres <span className="italic">histoires</span>.
                </h2>
              </FadeUp>
              <Stagger
                staggerDelay={0.08}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {relatedArticles.map((a) => (
                  <StaggerItem key={a._id}>
                    <Link
                      href={`/actualites/${a.slug}`}
                      className="group bg-surface-container-lowest rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex flex-col transition-all hover:-translate-y-1 h-full"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <ArticleCover
                          image={a.cover}
                          alt={a.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, 100vw"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <span className="text-xs uppercase tracking-[0.25em] text-on-surface-variant mb-3">
                          {formatDate(a.publishedAt)}
                        </span>
                        <h3 className="font-serif text-primary text-xl md:text-2xl leading-snug group-hover:text-secondary transition-colors">
                          {a.title}
                        </h3>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
