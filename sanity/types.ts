import type { PortableTextBlock } from "@portabletext/types";

export type SanityImage = {
  url: string | null;
  lqip?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
  alt?: string | null;
  caption?: string | null;
};

export type Seo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: { url: string | null; alt?: string | null } | null;
  keywords?: string[] | null;
  noIndex?: boolean | null;
};

export type VideoEmbed = {
  title?: string | null;
  source?: "url" | "file" | null;
  url?: string | null;
  fileUrl?: string | null;
  poster?: { url: string | null; alt?: string | null } | null;
  caption?: string | null;
};

export type CtaLink = {
  label?: string | null;
  href?: string | null;
  style?: "primary" | "secondary" | null;
};

export type SocialLink = {
  platform: string;
  url: string;
  label?: string | null;
};

export type Hero = {
  eyebrow?: string | null;
  title?: string | null;
  titleAccent?: string | null;
  intro?: string | null;
  meta?: string | null;
  image?: SanityImage | null;
  video?: VideoEmbed | null;
  primaryCta?: CtaLink | null;
  secondaryCta?: CtaLink | null;
};

export type SectionHeading = {
  eyebrow?: string | null;
  title?: string | null;
  intro?: string | null;
  note?: string | null;
};

export type ArticleCard = {
  _id: string;
  title: string;
  slug: string;
  category?: string | null;
  excerpt?: string | null;
  publishedAt: string;
  readingTime?: number | null;
  cover?: SanityImage | null;
};

export type FeaturedArticle = ArticleCard & {
  author?: string | null;
};

export type Article = FeaturedArticle & {
  body?: PortableTextBlock[] | null;
  seo?: Seo | null;
};

export type Mission = {
  _id: string;
  title: string;
  icon: string;
  eyebrow?: string | null;
  italicWord?: string | null;
  tagline?: string | null;
  summary?: string | null;
  description?: string | null;
  programs?: string[] | null;
  stats?: { value: string; label: string }[] | null;
  cover?: SanityImage | null;
  video?: VideoEmbed | null;
  details?: PortableTextBlock[] | null;
};

export type Testimonial = {
  _id: string;
  quote: string;
  authorName: string;
  authorRole?: string | null;
  featured?: boolean | null;
  authorPhoto?: { url: string | null; alt?: string | null } | null;
};

export type Partner = {
  _id: string;
  name: string;
  url?: string | null;
  tier?: "platinum" | "gold" | "silver" | "bronze" | null;
  logo?: { url: string | null; alt?: string | null } | null;
};

export type FeaturedCampaign = {
  _id: string;
  title: string;
  slug?: string | null;
  tagline?: string | null;
  description?: string | null;
  goalAmount: number;
  raisedAmount?: number | null;
  supporters?: number | null;
  deadline?: string | null;
  helloAssoUrl?: string | null;
  cover?: SanityImage | null;
  video?: VideoEmbed | null;
  seo?: Seo | null;
};

export type Founder = {
  _id: string;
  name: string;
  role?: string | null;
  bio?: string | null;
  quote?: string | null;
  portrait?: { url: string | null; alt?: string | null } | null;
};

export type EventDoc = {
  _id: string;
  title: string;
  slug?: string | null;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  address?: string | null;
  description?: string | null;
  registrationUrl?: string | null;
  featured?: boolean | null;
  cover?: SanityImage | null;
  video?: VideoEmbed | null;
  seo?: Seo | null;
};

export type SiteSettings = {
  siteName?: string | null;
  tagline?: string | null;
  rna?: string | null;
  siret?: string | null;
  address?: string | null;
  email?: string | null;
  phone?: string | null;
  publicationDirector?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  footerNote?: string | null;
  logo?: { url: string | null; alt?: string | null } | null;
  socialLinks?: SocialLink[] | null;
  stats?: { value: string; label: string }[] | null;
  defaultSeo?: Seo | null;
};

/* ---------- Page singletons ---------- */

export type StatItem = { value?: string | null; label?: string | null; caption?: string | null };
export type FaqItem = { question: string; answer: string };

export type HomePage = {
  hero?: Hero | null;
  stats?: StatItem[] | null;
  missionsHeading?: SectionHeading | null;
  founderNote?: {
    eyebrow?: string | null;
    quote?: string | null;
    body?: PortableTextBlock[] | null;
    name?: string | null;
    role?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    portrait?: SanityImage | null;
  } | null;
  faqHeading?: SectionHeading | null;
  faq?: FaqItem[] | null;
  newsletter?: { heading?: string | null; text?: string | null } | null;
  seo?: Seo | null;
};

export type TimelineItem = { year: string; title: string; text?: string | null };
export type ValueItem = { icon?: string | null; title?: string | null; text?: string | null };

export type GalleryFigure = SanityImage & { _key: string; _type: "figure" };
export type GalleryVideo = VideoEmbed & { _key: string; _type: "videoEmbed" };
export type GalleryQuote = { _key: string; _type: "quoteCard"; quote?: string | null; author?: string | null };
export type GalleryItem = GalleryFigure | GalleryVideo | GalleryQuote;

export type StoryPage = {
  hero?: Hero | null;
  parentsWord?: {
    eyebrow?: string | null;
    quote?: string | null;
    body?: PortableTextBlock[] | null;
    signature?: string | null;
    role?: string | null;
    imageBadge?: string | null;
    image?: SanityImage | null;
  } | null;
  timelineHeading?: SectionHeading | null;
  timeline?: TimelineItem[] | null;
  valuesHeading?: SectionHeading | null;
  values?: ValueItem[] | null;
  galleryHeading?: SectionHeading | null;
  gallery?: GalleryItem[] | null;
  cta?: {
    eyebrow?: string | null;
    title?: string | null;
    text?: string | null;
    primaryCta?: CtaLink | null;
    secondaryCta?: CtaLink | null;
  } | null;
  seo?: Seo | null;
};

export type MissionsPage = {
  hero?: Hero | null;
  intro?: PortableTextBlock[] | null;
  seo?: Seo | null;
};

export type HelpPage = {
  hero?: Hero | null;
  ways?: {
    icon?: string | null;
    title?: string | null;
    text?: string | null;
    ctaLabel?: string | null;
    ctaHref?: string | null;
    highlighted?: boolean | null;
  }[] | null;
  stepsHeading?: SectionHeading | null;
  steps?: { number?: string | null; title?: string | null; text?: string | null }[] | null;
  taxSection?: { title?: string | null; text?: string | null; note?: string | null } | null;
  seo?: Seo | null;
};

export type ContactPage = {
  hero?: Hero | null;
  channels?: {
    icon?: string | null;
    title?: string | null;
    primary?: string | null;
    secondary?: string | null;
  }[] | null;
  quickLinks?: { icon?: string | null; label?: string | null; href?: string | null }[] | null;
  socialLinks?: SocialLink[] | null;
  seo?: Seo | null;
};

export type SimplePage = {
  hero?: Hero | null;
  seo?: Seo | null;
};

export type LegalPage = {
  title: string;
  slug: string;
  intro?: string | null;
  lastUpdated?: string | null;
  body?: PortableTextBlock[] | null;
  seo?: Seo | null;
};
