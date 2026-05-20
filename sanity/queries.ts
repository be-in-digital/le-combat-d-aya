import { defineQuery } from "next-sanity";

const COVER_FRAGMENT = `
  cover {
    "url": asset->url,
    "lqip": asset->metadata.lqip,
    "dimensions": asset->metadata.dimensions,
    alt,
  }
`;

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
    instagramUrl, linkedinUrl,
    stats[] { value, label }
  }
`);
