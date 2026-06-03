import { type SchemaTypeDefinition } from "sanity";

// Reusable objects
import seo from "./objects/seo";
import figure from "./objects/figure";
import videoEmbed from "./objects/video-embed";
import blockContent from "./objects/block-content";
import ctaLink from "./objects/cta-link";
import socialLink from "./objects/social-link";

// Singletons / pages
import siteSettings from "./site-settings";
import homePage from "./home-page";
import storyPage from "./story-page";
import missionsPage from "./missions-page";
import helpPage from "./help-page";
import contactPage from "./contact-page";
import { newsPage, eventsPage } from "./simple-page";
import legalPage from "./legal-page";

// Collections
import article from "./article";
import mission from "./mission";
import testimonial from "./testimonial";
import campaign from "./campaign";
import partner from "./partner";
import founder from "./founder";
import event from "./event";

// Newsletter
import newsletterIssue from "./newsletter-issue";
import subscriber from "./subscriber";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  seo,
  figure,
  videoEmbed,
  blockContent,
  ctaLink,
  socialLink,
  // Singletons / pages
  siteSettings,
  homePage,
  storyPage,
  missionsPage,
  helpPage,
  contactPage,
  newsPage,
  eventsPage,
  legalPage,
  // Collections
  article,
  mission,
  testimonial,
  campaign,
  partner,
  founder,
  event,
  // Newsletter
  newsletterIssue,
  subscriber,
];
