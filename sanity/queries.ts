import { defineQuery } from "next-sanity";

const COVER_FRAGMENT = `
  cover {
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions,
    alt,
  }
`;

// Projection for a `figure`/image field (named, e.g. "image": image{...}).
const IMG = `{
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "dimensions": asset->metadata.dimensions,
  alt,
  caption,
}`;

// Projection for a `videoEmbed` object field.
const VIDEO = `{
  title,
  source,
  url,
  "fileUrl": file.asset->url,
  poster { "url": asset->url, alt },
  caption,
}`;

// Projection for the reusable `seo` object.
const SEO = `seo {
  metaTitle,
  metaDescription,
  ogImage { "url": asset->url, alt },
  keywords,
  noIndex,
}`;

const CTA = `{ label, href, style }`;

const ARTICLE_CARD = `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  readingTime,
  ${COVER_FRAGMENT}
`;

export const featuredArticleQuery = defineQuery(`
  *[_type == "article" && featured == true] | order(publishedAt desc)[0] {
    ${ARTICLE_CARD},
    author
  }
`);

export const articlesQuery = defineQuery(`
  *[_type == "article" && (!defined($exclude) || _id != $exclude)] | order(publishedAt desc)[0...$limit] {
    ${ARTICLE_CARD}
  }
`);

export const articleBySlugQuery = defineQuery(`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    excerpt,
    publishedAt,
    author,
    readingTime,
    body,
    ${SEO},
    ${COVER_FRAGMENT}
  }
`);

export const articleSlugsQuery = defineQuery(`
  *[_type == "article" && defined(slug.current)][].slug.current
`);

export const articleCategoriesQuery = defineQuery(`
  array::unique(*[_type == "article" && defined(category)].category)
`);

export const missionsQuery = defineQuery(`
  *[_type == "mission"] | order(order asc) {
    _id, title, icon, tagline, summary, details
  }
`);

export const testimonialsQuery = defineQuery(`
  *[_type == "testimonial"] | order(featured desc, order asc) {
    _id,
    quote,
    authorName,
    authorRole,
    featured,
    authorPhoto {
      "url": asset->url,
      alt
    }
  }
`);

export const partnersQuery = defineQuery(`
  *[_type == "partner"] | order(order asc) {
    _id, name, url, tier,
    logo {
      "url": asset->url,
      alt
    }
  }
`);

export const featuredCampaignQuery = defineQuery(`
  *[_type == "campaign" && featured == true && status == "active"] | order(_updatedAt desc)[0] {
    _id, title, tagline, description, goalAmount, raisedAmount, supporters, deadline, helloAssoUrl,
    "slug": slug.current,
    "video": video ${VIDEO},
    ${COVER_FRAGMENT}
  }
`);

export const foundersQuery = defineQuery(`
  *[_type == "founder"] | order(order asc) {
    _id, name, role, bio, quote,
    portrait {
      "url": asset->url,
      alt
    }
  }
`);

const EVENT_FIELDS = `
  _id, title, "slug": slug.current, startsAt, endsAt, location, address, description, registrationUrl, featured,
  ${SEO},
  "video": video ${VIDEO},
  ${COVER_FRAGMENT}
`;

export const upcomingEventsQuery = defineQuery(`
  *[_type == "event" && startsAt >= now()] | order(startsAt asc)[0...$limit] {
    ${EVENT_FIELDS}
  }
`);

export const pastEventsQuery = defineQuery(`
  *[_type == "event" && startsAt < now()] | order(startsAt desc)[0...$limit] {
    ${EVENT_FIELDS}
  }
`);

export const eventBySlugQuery = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    ${EVENT_FIELDS}
  }
`);

export const eventSlugsQuery = defineQuery(`
  *[_type == "event" && defined(slug.current)][].slug.current
`);

export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0] {
    siteName, tagline, rna, siret, address, email, phone, publicationDirector,
    instagramUrl, linkedinUrl, footerNote,
    logo { "url": asset->url, alt },
    socialLinks[] { platform, url, label },
    stats[] { value, label },
    ${SEO}
  }
`);

const HERO = `hero {
  eyebrow, title, titleAccent, intro, meta,
  "image": image ${IMG},
  "video": video ${VIDEO},
  primaryCta ${CTA},
  secondaryCta ${CTA},
}`;

export const homePageQuery = defineQuery(`
  *[_id == "homePage"][0] {
    ${HERO},
    stats[] { value, label, caption },
    missionsHeading { eyebrow, title, intro },
    founderNote {
      eyebrow, quote, body, name, role, ctaLabel, ctaHref,
      "portrait": portrait ${IMG},
    },
    faqHeading { eyebrow, title },
    faq[] { question, answer },
    newsletter { heading, text },
    ${SEO}
  }
`);

export const storyPageQuery = defineQuery(`
  *[_id == "storyPage"][0] {
    hero { eyebrow, title, titleAccent, intro, meta },
    parentsWord {
      eyebrow, quote, body, signature, role, imageBadge,
      "image": image ${IMG},
    },
    timelineHeading { eyebrow, title },
    timeline[] { year, title, text },
    valuesHeading { eyebrow, title },
    values[] { icon, title, text },
    galleryHeading { eyebrow, title, note },
    gallery[] {
      _key, _type,
      _type == "figure" => {
        "url": asset->url,
        "lqip": asset->metadata.lqip,
        "dimensions": asset->metadata.dimensions,
        alt, caption,
      },
      _type == "videoEmbed" => {
        title, source, url, "fileUrl": file.asset->url,
        poster { "url": asset->url, alt }, caption,
      },
      _type == "quoteCard" => { quote, author },
    },
    cta {
      eyebrow, title, text,
      primaryCta ${CTA},
      secondaryCta ${CTA},
    },
    ${SEO}
  }
`);

export const missionsPageQuery = defineQuery(`
  *[_id == "missionsPage"][0] {
    hero { eyebrow, title, titleAccent, intro, meta },
    intro,
    ${SEO}
  }
`);

export const helpPageQuery = defineQuery(`
  *[_id == "helpPage"][0] {
    hero { eyebrow, title, titleAccent, intro },
    ways[] { icon, title, text, ctaLabel, ctaHref, highlighted },
    stepsHeading { eyebrow, title },
    steps[] { number, title, text },
    taxSection { title, text, note },
    ${SEO}
  }
`);

export const contactPageQuery = defineQuery(`
  *[_id == "contactPage"][0] {
    hero { eyebrow, title, titleAccent, intro },
    channels[] { icon, title, primary, secondary },
    quickLinks[] { icon, label, href },
    socialLinks[] { platform, url, label },
    ${SEO}
  }
`);

export const simplePageQuery = defineQuery(`
  *[_id == $id][0] {
    hero { eyebrow, title, titleAccent, intro, meta },
    ${SEO}
  }
`);

export const fullMissionsQuery = defineQuery(`
  *[_type == "mission"] | order(order asc) {
    _id, title, eyebrow, italicWord, icon, tagline, summary, description,
    programs, stats[] { value, label },
    "cover": cover ${IMG},
    "video": video ${VIDEO},
  }
`);

export const legalPageBySlugQuery = defineQuery(`
  *[_type == "legalPage" && slug.current == $slug][0] {
    title, "slug": slug.current, intro, lastUpdated, body,
    ${SEO}
  }
`);

export const legalPageSlugsQuery = defineQuery(`
  *[_type == "legalPage" && defined(slug.current)][].slug.current
`);
