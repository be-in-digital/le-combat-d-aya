import type { PortableTextBlock } from "@portabletext/types";

export type SanityImage = {
  url: string | null;
  lqip?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
  alt?: string | null;
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
};

export type Mission = {
  _id: string;
  title: string;
  icon: string;
  tagline?: string | null;
  summary?: string | null;
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
  stats?: { value: string; label: string }[] | null;
};
