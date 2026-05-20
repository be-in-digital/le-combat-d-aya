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
