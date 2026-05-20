import { type SchemaTypeDefinition } from "sanity";

import article from "./article";
import mission from "./mission";
import testimonial from "./testimonial";
import campaign from "./campaign";
import partner from "./partner";
import founder from "./founder";
import event from "./event";
import siteSettings from "./site-settings";
import newsletterIssue from "./newsletter-issue";
import subscriber from "./subscriber";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  // Content
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
