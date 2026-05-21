export const NAV_LINKS = [
  { label: "Accueil", href: "/" },
  { label: "Notre histoire", href: "/histoire" },
  { label: "Nos missions", href: "/missions" },
  { label: "Comment aider ?", href: "/aider" },
  { label: "Actualités", href: "/actualites" },
  { label: "Événements", href: "/evenements" },
  { label: "Contact", href: "/contact" },
] as const;

export const HELLOASSO_URL =
  "https://www.helloasso.com/associations/le-combat-d-alya/formulaires/2";

export const HELLOASSO_WIDGET_URL = `${HELLOASSO_URL}/widget`;

// General donation form (open-amount, embedded on /aider). The home page
// surfaces a separate CrowdFunding (see HELLOASSO_FORM_TYPE/SLUG env vars).
export const HELLOASSO_GENERAL_FORM = {
  formType: "Donation",
  formSlug: "2",
} as const;

export const ORG = {
  name: "Le Combat d'Alya",
  email: "contact@lecombatdalya.fr",
  address: "15 rue de la Solidarité, 75011 Paris",
  city: "Paris",
  country: "France",
  founded: "2023",
  rna: "W751234567",
  siret: "—",
  publicationDirector: "Marion Lefèvre",
} as const;
