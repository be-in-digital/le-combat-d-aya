/**
 * Idempotent Sanity seed script for "Le Combat d'Alya".
 * ---------------------------------------------------------------------------
 * Populates the Sanity dataset with the content currently HARDCODED in the
 * site (the fallback copy baked into the page files), so the Studio mirrors
 * the live site. Field names match the schemas in `sanity/schemas/` exactly.
 *
 * Re-running is safe: every document uses a deterministic `_id` and is written
 * with `createOrReplace`, so a second run UPDATES rather than duplicates.
 *
 * Some documents are placeholders invented to match the site's fallback copy
 * (testimonials, partners, articles, the featured campaign, and a few invented
 * "key figures"). Those are flagged "⚠ placeholder — review/replace in Studio".
 *
 * ---------------------------------------------------------------------------
 * HOW TO RUN
 *
 *   Dry run (no writes, no uploads — just lists what WOULD be created):
 *       pnpm seed -- --dry-run
 *
 *   Real run (requires a write token; reads project/dataset from .env.local):
 *       SANITY_API_WRITE_TOKEN=sk... pnpm seed
 *
 * Config comes from env: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * NEXT_PUBLIC_SANITY_API_VERSION (default "2026-05-19"). The token is read from
 * SANITY_API_WRITE_TOKEN, falling back to SANITY_API_READ_TOKEN (a read token
 * cannot write — supply a write token for a real run). If those env vars are
 * not already present, `.env.local` is parsed at startup. Token values are
 * never printed.
 * ---------------------------------------------------------------------------
 */

import { createClient, type SanityClient } from "next-sanity";
import { readFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";

/* ===========================================================================
 * 0. CLI flags
 * ========================================================================= */

const DRY_RUN = process.argv.slice(2).includes("--dry-run");

/* ===========================================================================
 * 1. Environment — load .env.local manually if needed (never print secrets)
 * ========================================================================= */

const REPO_ROOT = resolve(__dirname, "..");

/** Minimal KEY=VALUE parser for .env.local; only sets vars not already set. */
function loadEnvLocal(): void {
  const envPath = resolve(REPO_ROOT, ".env.local");
  if (!existsSync(envPath)) return;
  const raw = readFileSync(envPath, "utf8");
  for (const rawLine of raw.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    // Strip matching surrounding quotes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

// Load only if the vars we care about are not already in the environment.
if (
  !process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_SANITY_DATASET ||
  (!process.env.SANITY_API_WRITE_TOKEN && !process.env.SANITY_API_READ_TOKEN)
) {
  loadEnvLocal();
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-05-19";
const token =
  process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_READ_TOKEN;

if (!DRY_RUN) {
  if (!projectId) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Set it in .env.local or the environment, or run with --dry-run.",
    );
  }
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN). A WRITE token is required to seed. " +
        "Run `SANITY_API_WRITE_TOKEN=sk... pnpm seed`, or use --dry-run to preview.",
    );
  }
}

/** Lazily created — never instantiated in dry-run. */
let _client: SanityClient | null = null;
function client(): SanityClient {
  if (!_client) {
    _client = createClient({
      projectId: projectId!,
      dataset: dataset ?? "production",
      apiVersion,
      token,
      useCdn: false,
    });
  }
  return _client;
}

/* ===========================================================================
 * 2. Helpers — stable keys, Portable Text, image uploads
 * ========================================================================= */

/** Deterministic key generator so array members get stable `_key`s. */
function keyer(prefix: string) {
  let n = 0;
  return () => `${prefix}-${n++}`;
}

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Block = {
  _type: "block";
  _key: string;
  style: string;
  markDefs: never[];
  children: Span[];
};

/** Build a single Portable Text block (a paragraph/heading) with a stable key. */
function block(text: string, style: string, key: string): Block {
  return {
    _type: "block",
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: `${key}s0`, text, marks: [] }],
  };
}

/** A `normal` paragraph block. */
function para(text: string, key: string): Block {
  return block(text, "normal", key);
}

/** Build a blockContent array of plain `normal` paragraphs. */
function paragraphs(texts: string[], prefix: string): Block[] {
  return texts.map((t, i) => para(t, `${prefix}-p${i}`));
}

/** A single bullet-list item block. */
function bullet(text: string, key: string): Block & { listItem: "bullet"; level: number } {
  return { ...block(text, "normal", key), listItem: "bullet", level: 1 };
}

/* ---- Image uploads -------------------------------------------------------- */

type ImageRef = {
  _type: "figure" | "image";
  asset: { _type: "reference"; _ref: string };
  alt?: string;
};

/** Cache so each distinct source uploads at most once. */
const uploadCache = new Map<string, string>();

/** Track which assets we touched, for the summary. */
const uploadedAssets: { source: string; assetId: string }[] = [];

/**
 * Upload an image from a remote URL or a local path under the repo, returning
 * an image value object. `_type` matches the destination field:
 *   - "figure" for fields declared `type:"figure"`
 *   - "image"  for fields declared `type:"image"`
 * In --dry-run nothing is fetched/uploaded; a placeholder ref is returned.
 */
async function uploadImage(
  src: string,
  type: "figure" | "image",
  alt?: string,
): Promise<ImageRef> {
  if (DRY_RUN) {
    return {
      _type: type,
      asset: { _type: "reference", _ref: "image-DRYRUN" },
      ...(alt ? { alt } : {}),
    };
  }

  let assetId = uploadCache.get(src);
  if (!assetId) {
    const isRemote = /^https?:\/\//i.test(src);
    let buffer: Buffer;
    let filename: string;

    if (isRemote) {
      const res = await fetch(src);
      if (!res.ok) {
        throw new Error(`Failed to fetch image ${src} (${res.status})`);
      }
      const arr = await res.arrayBuffer();
      buffer = Buffer.from(arr);
      // Derive a sane filename from the URL path.
      const urlPath = new URL(src).pathname;
      filename = basename(urlPath) || "image";
    } else {
      const localPath = resolve(REPO_ROOT, src);
      buffer = readFileSync(localPath);
      filename = basename(localPath);
    }

    const asset = await client().assets.upload("image", buffer, { filename });
    assetId = asset._id;
    uploadCache.set(src, assetId);
    uploadedAssets.push({ source: src, assetId });
  }

  return {
    _type: type,
    asset: { _type: "reference", _ref: assetId },
    ...(alt ? { alt } : {}),
  };
}

/* ---- Remote image sources (the Wix constants found in the page files) ----- */

const HERO_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg/v1/fill/w_1066,h_740,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/26a6fa_b3eba259fc2e41c097fad060b3738366~mv2.jpg";
const PORTRAIT_IMAGE =
  "https://static.wixstatic.com/media/26a6fa_b288a16560794a2a9e6cf5122dd22d69~mv2.jpg/v1/fill/w_780,h_1124,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/WhatsApp%20Image%202025-07-12%20%C3%A0%2014_30_08_ba15ba8b.jpg";
const CAMPAIGN_IMAGE = PORTRAIT_IMAGE; // CAMPAIGN_IMAGE === PORTRAIT_IMAGE in the pages
const LOGO_PATH = "public/logo.png";

/* ===========================================================================
 * 3. Logging — grouped by type, with counts
 * ========================================================================= */

const PLACEHOLDER_NOTE = "⚠ placeholder — review/replace in Studio";

type LoggedDoc = { type: string; id: string; title: string; placeholder?: boolean };
const logged: LoggedDoc[] = [];

function note(doc: { _type: string; _id: string }, title: string, placeholder = false) {
  logged.push({ type: doc._type, id: doc._id, title, placeholder });
  const tag = placeholder ? `  (${PLACEHOLDER_NOTE})` : "";
  const verb = DRY_RUN ? "would create" : "writing";
  console.log(`  • [${doc._type}] ${doc._id} — ${title}${tag}  …${verb}`);
}

/* ===========================================================================
 * 4. Document builders
 *
 * Each builder returns a fully-formed document object (with deterministic
 * `_id` + `_type`). Image fields are resolved via `uploadImage`, so builders
 * are async. Field names mirror the schemas exactly.
 * ========================================================================= */

/* ---- siteSettings --------------------------------------------------------- */

async function buildSiteSettings() {
  const sk = keyer("ss-social");
  const stk = keyer("ss-stat");
  const logo = await uploadImage(LOGO_PATH, "image", "Le Combat d'Alya");
  const ogImage = await uploadImage(HERO_IMAGE, "image", "Le Combat d'Alya");

  return {
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "Le Combat d'Alya",
    tagline: "Ensemble pour Alya",
    logo,
    rna: "W751234567",
    siret: "—",
    address: "15 rue de la Solidarité, 75011 Paris",
    email: "contact@lecombatdalya.fr",
    phone: undefined,
    publicationDirector: "Mariam Nassar",
    footerNote: "Association reconnue d'intérêt général · 66 % déductible",
    socialLinks: [
      { _key: sk(), _type: "socialLink", platform: "instagram", url: "https://instagram.com", label: "Instagram" },
      { _key: sk(), _type: "socialLink", platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
    ],
    // Mirrors the home STATS constant (invented figures).
    stats: [
      { _key: stk(), value: "45k€", label: "Fonds récoltés" },
      { _key: stk(), value: "1 247", label: "Donateurs" },
      { _key: stk(), value: "15", label: "Partenaires" },
      { _key: stk(), value: "850", label: "Vies impactées" },
    ],
    defaultSeo: {
      _type: "seo",
      metaDescription:
        "Association dédiée au soutien d'Alya et des familles touchées par la maladie. Rejoignez notre communauté de bienveillance et d'impact.",
      ogImage,
      noIndex: false,
    },
  };
}

/* ---- homePage ------------------------------------------------------------- */

async function buildHomePage() {
  const statsKey = keyer("home-stat");
  const faqKey = keyer("home-faq");
  const heroImage = await uploadImage(HERO_IMAGE, "figure", "Portrait d'Alya");
  const portrait = await uploadImage(HERO_IMAGE, "figure", "Famille d'Alya");

  return {
    _id: "homePage",
    _type: "homePage",
    hero: {
      eyebrow: "Solidarité & Espoir",
      title: "Ensemble",
      titleAccent: "pour Alya.",
      intro:
        "Chaque geste compte pour soutenir le parcours d'Alya vers la guérison. Une histoire de famille, une mission collective, un combat porté par la bienveillance.",
      image: heroImage,
      primaryCta: { _type: "ctaLink", label: "Soutenir Alya", href: "/aider", style: "primary" },
      secondaryCta: { _type: "ctaLink", label: "Découvrir son histoire", href: "/histoire", style: "secondary" },
    },
    // Mirrors the home STATS constant (invented figures).
    stats: [
      { _key: statsKey(), value: "45k€", label: "Fonds récoltés", caption: "depuis 2019" },
      { _key: statsKey(), value: "1 247", label: "Donateurs", caption: "et donatrices" },
      { _key: statsKey(), value: "15", label: "Partenaires", caption: "engagés" },
      { _key: statsKey(), value: "850", label: "Vies impactées", caption: "à ce jour" },
    ],
    missionsHeading: {
      eyebrow: "Ce que nous faisons",
      title: "Nos missions de cœur",
      intro:
        "Nous œuvrons chaque jour pour transformer le quotidien d'Alya et sensibiliser à la beauté de la différence.",
    },
    founderNote: {
      eyebrow: "Notre histoire",
      quote:
        "Quand le diagnostic est tombé, le monde s'est arrêté. Puis nous avons décidé que ce serait le début d'autre chose.",
      body: paragraphs(
        [
          "Le Combat d'Alya est né en 2019 d'un besoin urgent de financer les soins de notre fille. Mais très vite, nous avons compris que d'autres familles vivaient le même isolement, la même incertitude.",
          "Aujourd'hui, nous transformons cette épreuve en un mouvement : pour Alya, et pour toutes les Alyas que nous n'avons pas encore rencontrées.",
        ],
        "home-founder",
      ),
      name: "Mariam Nassar",
      role: "Fondatrice",
      portrait,
      ctaLabel: "Lire notre histoire complète",
      ctaHref: "/histoire",
    },
    faqHeading: {
      eyebrow: "Vos questions",
      title: "Tout ce qu'il faut savoir.",
    },
    faq: [
      {
        _key: faqKey(),
        question: "Comment sont utilisés mes dons ?",
        answer:
          "85 % de chaque don finance directement les soins, l'équipement et les programmes de soutien aux familles. Le reste couvre le fonctionnement et la communication transparente sur nos actions.",
      },
      {
        _key: faqKey(),
        question: "Puis-je devenir bénévole ?",
        answer:
          "Absolument. Nous accueillons des bénévoles pour l'événementiel, la communication, le soutien aux familles et bien plus. Contactez-nous via le formulaire de contact.",
      },
      {
        _key: faqKey(),
        question: "Les dons sont-ils déductibles d'impôts ?",
        answer:
          "Oui. En tant qu'association reconnue d'intérêt général, 66 % de votre don est déductible de votre impôt sur le revenu, dans la limite de 20 % de votre revenu imposable.",
      },
      {
        _key: faqKey(),
        question: "Puis-je faire un don ponctuel ou mensuel ?",
        answer:
          "Les deux sont possibles. Le don mensuel — même modeste — nous permet de planifier les soins d'Alya sur la durée et a un impact considérable.",
      },
    ],
    newsletter: {
      heading: "Restez proches de notre combat.",
      text: "Une lettre mensuelle, sans bruit. Les avancées d'Alya, les campagnes en cours, et les histoires qui nous portent.",
    },
  };
}

/* ---- storyPage ------------------------------------------------------------ */

async function buildStoryPage() {
  const tlKey = keyer("story-tl");
  const valKey = keyer("story-val");
  const galKey = keyer("story-gal");
  const portrait = await uploadImage(PORTRAIT_IMAGE, "figure", "Portrait d'Alya");
  const family = await uploadImage(HERO_IMAGE, "figure", "Famille d'Alya");
  const portraitComplice = await uploadImage(PORTRAIT_IMAGE, "figure", "Alya, regard complice");
  const parentsImage = await uploadImage(HERO_IMAGE, "figure", "Famille d'Alya");

  return {
    _id: "storyPage",
    _type: "storyPage",
    hero: {
      eyebrow: "Notre histoire",
      title: "Un combat qui a commencé par",
      titleAccent: "un sourire",
      intro:
        "Une famille, un diagnostic, une décision : transformer l'épreuve en mouvement. Voici comment l'aventure du Combat d'Alya a commencé.",
      meta: "Édition Printemps · No. 03",
    },
    parentsWord: {
      eyebrow: "Le mot des parents",
      quote:
        "Quand le diagnostic est tombé, le monde s'est arrêté. Puis nous avons décidé que ce serait le début d'autre chose.",
      body: paragraphs(
        [
          "Alya est née en mai 2018. Une petite fille pleine de vie, de rires, d'observation. Très tôt, le diagnostic tombe : une maladie rare, peu connue, mal financée par la recherche publique.",
          "Face à l'impasse, nous avons cherché ailleurs. Des protocoles innovants à l'étranger, des équipements adaptés, des programmes de stimulation cognitive. Tout coûte cher, tout demande du temps.",
          "Nous avons rapidement compris que d'autres familles vivaient le même parcours du combattant, le même isolement. L'association est née de cette évidence : ce que nous apprenons doit servir à toutes les Alyas du pays.",
        ],
        "story-parents",
      ),
      signature: "Mariam Nassar",
      role: "Fondatrice",
      image: parentsImage,
      imageBadge: "Famille d'Alya · 2026",
    },
    timelineHeading: { eyebrow: "Chronologie", title: "De 2018 à aujourd'hui." },
    timeline: [
      {
        _key: tlKey(),
        year: "2018",
        title: "La naissance d'Alya",
        text: "Alya voit le jour en mai 2018. Une petite fille pleine de vie, de rires et de curiosité.",
      },
      {
        _key: tlKey(),
        year: "2019",
        title: "Naissance de l'association",
        text: "En janvier 2019, Le Combat d'Alya est officiellement créé pour financer les soins d'Alya et tendre la main aux familles confrontées au même parcours.",
      },
      {
        _key: tlKey(),
        year: "2019‑25",
        title: "Des soins sans frontières",
        text: "Rééducation intensive en Espagne jusqu'à trois fois par an, matériel médical pour Alya, financement d'un véhicule adapté (PMR), et envoi de matériel médical à l'étranger pour des enfants lourdement handicapés.",
      },
      {
        _key: tlKey(),
        year: "2025",
        title: "Premier protocole au Mexique",
        text: "En décembre 2025, l'association finance un premier protocole médical innovant au Mexique pour Alya.",
      },
      {
        _key: tlKey(),
        year: "2026",
        title: "La campagne Cytotron",
        text: "La campagne en cours finance un second protocole médical au Mexique : le Cytotron. L'aventure ne fait que commencer.",
      },
    ],
    valuesHeading: { eyebrow: "Nos valeurs", title: "Ce qui nous guide." },
    values: [
      {
        _key: valKey(),
        icon: "favorite",
        title: "Bienveillance",
        text: "Aucune famille ne devrait traverser cela seule. Notre première mission est l'écoute, sans jugement et sans condition.",
      },
      {
        _key: valKey(),
        icon: "lock_open",
        title: "Transparence",
        text: "Chaque euro est tracé, chaque décision est expliquée. Nous publions chaque année un rapport d'activité complet.",
      },
      {
        _key: valKey(),
        icon: "diversity_3",
        title: "Collectif",
        text: "Notre force vient de la communauté : parents, soignants, donateurs, bénévoles. Personne n'avance seul.",
      },
    ],
    galleryHeading: {
      eyebrow: "Album de famille",
      title: "Moments choisis.",
      note: "Quelques instants de l'aventure, partagés avec ceux qui la portent.",
    },
    // The 6 bento tiles, in order: portrait, pink quote, edition quote, wide
    // photo, small photo, caption-strip note.
    gallery: [
      { ...portrait, _key: galKey(), caption: "Alya, l'éclat du quotidien. · Montevideo · Printemps 2026" },
      {
        _key: galKey(),
        _type: "quoteCard",
        quote: "Le sourire d'Alya, c'est notre boussole.",
        author: "Mariam Nassar",
      },
      {
        _key: galKey(),
        _type: "quoteCard",
        quote: "Printemps 2026 — douze instants captés au vol.",
        author: "Album N°03 · Édition limitée",
      },
      { ...family, _key: galKey(), caption: "En famille, le combat devient un horizon." },
      { ...portraitComplice, _key: galKey(), caption: "Alya, regard complice." },
      {
        _key: galKey(),
        _type: "quoteCard",
        quote: "Chaque cliché raconte un combat — et chaque combat, une victoire.",
        author: "Note de l'album",
      },
    ],
    cta: {
      eyebrow: "Rejoindre l'aventure",
      title: "Vous aussi, écrivez la suite.",
      text: "Cette histoire est encore en cours d'écriture. Vous pouvez en être les prochains auteurs.",
      primaryCta: { _type: "ctaLink", label: "Faire un don", href: "/aider", style: "primary" },
      secondaryCta: { _type: "ctaLink", label: "Nous contacter", href: "/contact", style: "secondary" },
    },
  };
}

/* ---- missionsPage --------------------------------------------------------- */

function buildMissionsPage() {
  return {
    _id: "missionsPage",
    _type: "missionsPage",
    hero: {
      eyebrow: "Ce que nous faisons",
      title: "Quatre piliers, une raison d'être",
      titleAccent: "raison d'être",
      intro:
        "Soins, soutien, sensibilisation, équipement. Chaque mission est pensée comme un levier complémentaire pour transformer le quotidien d'Alya et celui des familles que nous accompagnons.",
    },
    intro: paragraphs(
      [
        "Soins, soutien aux familles, sensibilisation, équipement : nos quatre piliers d'action.",
      ],
      "missions-intro",
    ),
  };
}

/* ---- mission documents (the 4 MISSIONS) ----------------------------------- */

type MissionSeed = {
  id: string;
  eyebrow: string;
  title: string;
  italicWord: string;
  tagline: string;
  description: string;
  programs: string[];
  stats: { value: string; label: string }[];
  icon: string;
  order: number;
};

const MISSIONS: MissionSeed[] = [
  {
    id: "mission-soins",
    eyebrow: "Mission principale",
    title: "Soins & Thérapies",
    italicWord: "thérapies",
    tagline: "Financer les meilleurs traitements, sans frontière géographique ni financière.",
    description:
      "Nous prenons en charge les protocoles innovants, les thérapies de pointe et les programmes de rééducation à l'international. Notre rôle : permettre à Alya — et aux familles que nous accompagnons — d'accéder aux soins que la couverture publique ne couvre pas encore.",
    programs: [
      "Programme de rééducation neuromotrice (Barcelone)",
      "Thérapies par stimulation sensorielle",
      "Suivi médical pluridisciplinaire",
      "Bourses de soins pour familles bénéficiaires",
    ],
    stats: [
      { value: "32k€", label: "Investis en 2025" },
      { value: "12", label: "Programmes financés" },
      { value: "3", label: "Pays partenaires" },
    ],
    icon: "medical_services",
    order: 1,
  },
  {
    id: "mission-familles",
    eyebrow: "Communauté",
    title: "Soutien aux Familles",
    italicWord: "Familles",
    tagline: "Une famille élargie pour traverser ce que personne ne devrait traverser seul.",
    description:
      "Au-delà du financement, nous tissons un réseau de soutien : groupes de parole, accompagnement administratif, mise en relation avec des spécialistes, week-ends de répit pour les aidants. L'humain d'abord.",
    programs: [
      "Groupes de parole mensuels (Paris, Lyon, en ligne)",
      "Cellule d'écoute psychologique gratuite",
      "Accompagnement administratif MDPH",
      "Week-ends répit pour aidants familiaux",
    ],
    stats: [
      { value: "850", label: "Familles accompagnées" },
      { value: "24h", label: "Délai d'écoute moyen" },
      { value: "4", label: "Antennes en France" },
    ],
    icon: "diversity_1",
    order: 2,
  },
  {
    id: "mission-sensibilisation",
    eyebrow: "Sensibilisation",
    title: "Changer les Regards",
    italicWord: "regards",
    tagline: "L'éducation comme antidote à l'ignorance et à l'isolement social.",
    description:
      "Nous menons des actions de sensibilisation dans les écoles, en entreprise et auprès du grand public. Notre conviction : c'est en racontant ces histoires qu'on déconstruit les préjugés et qu'on rend la société plus accueillante.",
    programs: [
      "Interventions en milieu scolaire (CM1 à Terminale)",
      "Conférences en entreprise sur le handicap invisible",
      "Campagnes presse et réseaux sociaux",
      "Festival annuel « Voix d'Alya »",
    ],
    stats: [
      { value: "47", label: "Écoles touchées" },
      { value: "12k", label: "Personnes sensibilisées" },
      { value: "8", label: "Médias partenaires" },
    ],
    icon: "visibility",
    order: 3,
  },
  {
    id: "mission-equipement",
    eyebrow: "Innovation",
    title: "Équipement & Autonomie",
    italicWord: "autonomie",
    tagline: "Accès aux technologies d'assistance qui transforment le quotidien.",
    description:
      "Matériel médical, véhicules adaptés et dispositifs de mobilité : nous finançons les équipements de pointe qui repoussent les limites du possible et redonnent de l'autonomie à chacun.",
    programs: [
      "Véhicule adapté (PMR)",
      "Matériel médical pour Alya",
      "Aménagement de domicile",
      "Aides à la mobilité personnalisées",
    ],
    stats: [
      { value: "27k€", label: "Équipement financé" },
      { value: "18", label: "Bénéficiaires" },
      { value: "100%", label: "Sur prescription" },
    ],
    icon: "settings_accessibility",
    order: 4,
  },
];

function buildMission(m: MissionSeed) {
  const sk = keyer(`${m.id}-stat`);
  return {
    _id: m.id,
    _type: "mission",
    title: m.title,
    icon: m.icon,
    eyebrow: m.eyebrow,
    italicWord: m.italicWord,
    tagline: m.tagline,
    description: m.description,
    programs: m.programs,
    stats: m.stats.map((s) => ({ _key: sk(), value: s.value, label: s.label })),
    order: m.order,
  };
}

/* ---- helpPage ------------------------------------------------------------- */

function buildHelpPage() {
  const wk = keyer("help-way");
  const stk = keyer("help-step");
  return {
    _id: "helpPage",
    _type: "helpPage",
    hero: {
      eyebrow: "Rejoindre le combat",
      title: "Plus d'une façon de soutenir Alya",
      titleAccent: "soutenir Alya",
      intro:
        "Don, bénévolat, soutien matériel, mécénat d'entreprise : chaque forme de soutien compte. Choisissez la façon qui vous ressemble.",
    },
    ways: [
      {
        _key: wk(),
        icon: "favorite",
        title: "Faire un don",
        text: "Un don ponctuel ou mensuel. 66 % déductible de vos impôts. Chaque euro est tracé et publié dans notre rapport annuel.",
        ctaLabel: "Donner maintenant",
        ctaHref: "#don",
        highlighted: true,
      },
      {
        _key: wk(),
        icon: "volunteer_activism",
        title: "Devenir bénévole",
        text: "Événementiel, communication, écoute, accompagnement administratif. Quelques heures par mois suffisent pour faire la différence.",
        ctaLabel: "Postuler",
        ctaHref: "/contact?sujet=benevolat",
        highlighted: false,
      },
      {
        _key: wk(),
        icon: "redeem",
        title: "Soutien matériel",
        text: "Équipement médical neuf ou récent, matériel pédagogique, fournitures pour nos événements. Tous les dons en nature sont reçus avec gratitude.",
        ctaLabel: "Voir les besoins",
        ctaHref: "/contact?sujet=don-materiel",
        highlighted: false,
      },
      {
        _key: wk(),
        icon: "domain",
        title: "Entreprise mécène",
        text: "Mécénat financier, de compétences ou en nature : votre entreprise peut s'engager à nos côtés et bénéficier de 60 % de déduction fiscale.",
        ctaLabel: "Nous écrire",
        ctaHref: "/contact?sujet=mecenat",
        highlighted: false,
      },
    ],
    stepsHeading: { eyebrow: "Comment ça marche", title: "Trois étapes, zéro mystère." },
    steps: [
      {
        _key: stk(),
        number: "01",
        title: "Vous donnez",
        text: "En ligne, par virement ou par chèque. Reçu fiscal envoyé sous 48 h.",
      },
      {
        _key: stk(),
        number: "02",
        title: "Nous priorisons",
        text: "Le conseil d'administration alloue les fonds aux campagnes les plus urgentes et aux programmes en cours.",
      },
      {
        _key: stk(),
        number: "03",
        title: "Vous suivez l'impact",
        text: "Newsletter mensuelle, rapport annuel, photos et témoignages. Vous voyez chaque euro à l'œuvre.",
      },
    ],
    taxSection: {
      title: "66 % de votre don déductible.",
      text: "Le Combat d'Alya est une association reconnue d'intérêt général. Vos dons donnent droit à une réduction d'impôt sur le revenu de 66 %, dans la limite de 20 % du revenu imposable.",
      note: "Pour les entreprises : 60 % de réduction d'impôt sur les sociétés.",
    },
  };
}

/* ---- contactPage ---------------------------------------------------------- */

function buildContactPage() {
  const ck = keyer("contact-chan");
  const qk = keyer("contact-link");
  const sk = keyer("contact-social");
  return {
    _id: "contactPage",
    _type: "contactPage",
    hero: {
      eyebrow: "Parlons-en",
      title: "Une question, une conversation",
      titleAccent: "conversation",
      intro:
        "Nous lisons chaque message. Que vous soyez donateur, bénévole, parent ou partenaire potentiel, notre équipe vous répond avec attention.",
    },
    channels: [
      {
        _key: ck(),
        icon: "mail",
        title: "Email général",
        primary: "contact@lecombatdalya.fr",
        secondary: "Réponse sous 48 h ouvrées",
      },
      {
        _key: ck(),
        icon: "favorite",
        title: "Service donateurs",
        primary: "dons@lecombatdalya.fr",
        secondary: "Reçus fiscaux, dons mensuels",
      },
      {
        _key: ck(),
        icon: "domain",
        title: "Mécénat entreprise",
        primary: "mecenat@lecombatdalya.fr",
        secondary: "Mariam Nassar, fondatrice",
      },
      {
        _key: ck(),
        icon: "podcasts",
        title: "Presse",
        primary: "presse@lecombatdalya.fr",
        secondary: "Dossier de presse sur demande",
      },
    ],
    quickLinks: [
      { _key: qk(), icon: "favorite", label: "Faire un don", href: "/aider" },
      { _key: qk(), icon: "help", label: "Questions fréquentes", href: "/#faq" },
      { _key: qk(), icon: "auto_stories", label: "Notre histoire", href: "/histoire" },
    ],
    // The page's SOCIAL_LINKS use placeholder "#" urls; map them to valid URLs
    // (socialLink.url requires http/https) and the schema's platform list.
    socialLinks: [
      { _key: sk(), _type: "socialLink", platform: "instagram", url: "https://instagram.com", label: "Instagram" },
      { _key: sk(), _type: "socialLink", platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
      { _key: sk(), _type: "socialLink", platform: "other", url: "https://lecombatdalya.fr", label: "Podcast" },
      { _key: sk(), _type: "socialLink", platform: "other", url: "https://lecombatdalya.fr", label: "Newsletter" },
    ],
  };
}

/* ---- newsPage / eventsPage (simple pages: hero only) ---------------------- */

function buildNewsPage() {
  return {
    _id: "newsPage",
    _type: "newsPage",
    hero: {
      eyebrow: "Le journal de notre combat",
      title: "Toutes nos actualités",
      titleAccent: "actualités",
      intro:
        "Campagnes, programmes, témoignages, partenariats : tout ce qui anime l'association, raconté en toute transparence.",
    },
  };
}

function buildEventsPage() {
  return {
    _id: "eventsPage",
    _type: "eventsPage",
    hero: {
      eyebrow: "Rencontres & rendez-vous",
      title: "Tous nos événements",
      titleAccent: "événements",
      intro:
        "Galas, conférences, ateliers, festivals — autant d'occasions de porter le combat d'Alya ensemble, en personne.",
    },
  };
}

/* ---- legalPage documents (CGU, confidentialité, mentions légales) --------- */

const LAST_UPDATED = "2026-05-19"; // "19 mai 2026"

function buildLegalCgu() {
  const k = keyer("cgu");
  const body: Block[] = [
    block("Objet", "h2", k()),
    para(
      "Le site lecombatdalya.fr a pour objet de présenter l'association Le Combat d'Alya, ses missions, ses campagnes en cours et de permettre la collecte de dons via la plateforme partenaire HelloAsso.",
      k(),
    ),
    para(
      "L'accès au site est libre et gratuit. Toute consultation du site implique l'acceptation pleine et entière des présentes conditions.",
      k(),
    ),
    block("Accès au site", "h2", k()),
    para(
      "Le site est accessible 7 jours sur 7, 24 heures sur 24, sauf en cas de force majeure ou d'événement hors du contrôle de l'association, et sous réserve des éventuelles opérations de maintenance.",
      k(),
    ),
    para(
      "L'association se réserve la possibilité d'interrompre, de suspendre ou de limiter l'accès au site, sans préavis, à tout moment.",
      k(),
    ),
    block("Dons et paiement", "h2", k()),
    para(
      "Les dons sont collectés via la plateforme HelloAsso. Les conditions générales de HelloAsso s'appliquent à toute transaction effectuée via leur interface.",
      k(),
    ),
    para(
      "Les reçus fiscaux (CERFA n° 11580*04) sont émis automatiquement par HelloAsso et envoyés à l'adresse email indiquée. En cas de problème, contactez contact@lecombatdalya.fr.",
      k(),
    ),
    block("Propriété intellectuelle", "h2", k()),
    para(
      "Les textes, photographies, illustrations, vidéos, logos, marques et tout autre contenu présent sur ce site sont la propriété exclusive de l'association ou de ses partenaires et sont protégés par le droit d'auteur.",
      k(),
    ),
    para(
      "Toute reproduction, représentation, modification, publication ou adaptation, totale ou partielle, est interdite sans autorisation préalable et écrite.",
      k(),
    ),
    block("Données personnelles", "h2", k()),
    para(
      "La collecte et le traitement des données personnelles sont décrits dans notre politique de confidentialité. En naviguant sur ce site, vous reconnaissez en avoir pris connaissance.",
      k(),
    ),
    block("Liens hypertextes", "h2", k()),
    para(
      "Le site peut contenir des liens vers des sites tiers (HelloAsso, partenaires, médias). L'association n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur disponibilité ou les conséquences de leur utilisation.",
      k(),
    ),
    block("Responsabilité", "h2", k()),
    para(
      "L'association s'efforce de fournir des informations aussi précises que possible. Toutefois, elle ne saurait être tenue responsable des omissions, des inexactitudes ou des carences dans la mise à jour, qu'elles soient de son fait ou du fait de tiers partenaires.",
      k(),
    ),
    para(
      "L'utilisateur reconnaît utiliser le site sous sa responsabilité exclusive et garantit l'association contre toute action dirigée contre elle du fait d'un usage inapproprié du site.",
      k(),
    ),
    block("Modification des CGU", "h2", k()),
    para(
      "L'association se réserve le droit de modifier les présentes conditions à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Il est conseillé de les consulter régulièrement.",
      k(),
    ),
    block("Loi applicable et juridiction", "h2", k()),
    para(
      "Les présentes conditions sont régies par le droit français. En cas de litige et à défaut de résolution amiable, les tribunaux français seront seuls compétents.",
      k(),
    ),
    block("Contact", "h2", k()),
    para("Pour toute question relative aux présentes conditions : contact@lecombatdalya.fr.", k()),
    para("Voir aussi les mentions légales et la politique de confidentialité.", k()),
  ];

  return {
    _id: "legal-cgu",
    _type: "legalPage",
    title: "Conditions générales d'utilisation",
    slug: { _type: "slug", current: "cgu" },
    intro:
      "Les présentes conditions régissent l'utilisation du site lecombatdalya.fr édité par l'association Le Combat d'Alya.",
    lastUpdated: LAST_UPDATED,
    body,
  };
}

function buildLegalConfidentialite() {
  const k = keyer("conf");
  const body: Block[] = [
    block("Responsable du traitement", "h2", k()),
    para("Responsable : Le Combat d'Alya", k()),
    para("Siège social : 15 rue de la Solidarité, 75011 Paris", k()),
    para("Contact : contact@lecombatdalya.fr", k()),
    para(
      "L'association Le Combat d'Alya s'engage à protéger vos données personnelles. Cette politique décrit quelles données sont collectées, pour quelles raisons, combien de temps elles sont conservées et quels sont vos droits.",
      k(),
    ),
    block("Données collectées", "h2", k()),
    para("Nous collectons uniquement les données strictement nécessaires :", k()),
    bullet("Formulaire de contact : prénom, nom, email, sujet, message — pour vous répondre.", k()),
    bullet("Newsletter : adresse email — pour vous envoyer notre lettre mensuelle.", k()),
    bullet(
      "Dons (via HelloAsso) : identité, email, adresse, coordonnées de paiement — collectées et traitées directement par HelloAsso. Nous ne stockons aucune donnée bancaire.",
      k(),
    ),
    bullet("Données techniques : aucune. Pas de cookie de traçage. Pas d'analytics.", k()),
    block("Finalités & bases légales", "h2", k()),
    bullet(
      "Répondre à votre demande (formulaire de contact) — base légale : exécution d'une mesure à votre demande.",
      k(),
    ),
    bullet(
      "Vous tenir informé(e) (newsletter) — base légale : votre consentement libre et explicite, révocable à tout moment.",
      k(),
    ),
    bullet(
      "Émettre un reçu fiscal (dons) — base légale : obligation légale (article 200 du CGI).",
      k(),
    ),
    block("Durée de conservation", "h2", k()),
    bullet("Formulaire de contact : 3 ans après le dernier échange.", k()),
    bullet("Newsletter : jusqu'à votre désinscription.", k()),
    bullet("Dons : 10 ans (obligation comptable).", k()),
    block("Destinataires & sous-traitants", "h2", k()),
    para(
      "Vos données ne sont jamais cédées ni vendues à des tiers. Elles peuvent être traitées par les sous-traitants techniques suivants :",
      k(),
    ),
    bullet("Resend : envoi des emails (contact, newsletter). Hébergé en Union européenne.", k()),
    bullet(
      "HelloAsso : collecte des dons et émission des reçus fiscaux. Société française, données hébergées en UE.",
      k(),
    ),
    bullet(
      "Vercel : hébergement du site. Transferts vers les États-Unis encadrés par les clauses contractuelles types (CCT).",
      k(),
    ),
    bullet(
      "Sentry : monitoring d'erreurs techniques. Aucune donnée personnelle identifiable n'est transmise.",
      k(),
    ),
    block("Vos droits", "h2", k()),
    para("Conformément au RGPD, vous disposez à tout moment des droits suivants :", k()),
    bullet("Droit d'accès à vos données", k()),
    bullet("Droit de rectification des données inexactes", k()),
    bullet("Droit à l'effacement (« droit à l'oubli »)", k()),
    bullet("Droit à la limitation du traitement", k()),
    bullet("Droit à la portabilité de vos données", k()),
    bullet("Droit d'opposition", k()),
    bullet("Droit de retirer votre consentement à tout moment", k()),
    bullet("Droit d'introduire une réclamation auprès de la CNIL (cnil.fr)", k()),
    para(
      "Pour exercer vos droits, écrivez-nous à contact@lecombatdalya.fr en précisant votre demande. Nous répondons sous 30 jours maximum.",
      k(),
    ),
    block("Cookies", "h2", k()),
    para(
      "Ce site ne dépose aucun cookie de traçage ni d'analyse. Seuls les cookies strictement nécessaires au fonctionnement de l'iframe HelloAsso (lors d'un don) sont déposés par HelloAsso directement, sous sa propre responsabilité.",
      k(),
    ),
    block("Modifications", "h2", k()),
    para(
      "Cette politique peut être mise à jour. La date de dernière modification est indiquée en haut de cette page. Pour toute question, contactez-nous à contact@lecombatdalya.fr.",
      k(),
    ),
    para("Voir aussi les mentions légales.", k()),
  ];

  return {
    _id: "legal-confidentialite",
    _type: "legalPage",
    title: "Politique de confidentialité",
    slug: { _type: "slug", current: "confidentialite" },
    intro:
      "Conforme au Règlement (UE) 2016/679 (RGPD) et à la loi française Informatique et Libertés modifiée.",
    lastUpdated: LAST_UPDATED,
    body,
  };
}

function buildLegalMentions() {
  const k = keyer("ment");
  const body: Block[] = [
    block("Éditeur du site", "h2", k()),
    para("Association : Le Combat d'Alya", k()),
    para("Forme juridique : Association loi 1901, à but non lucratif", k()),
    para("Siège social : 15 rue de la Solidarité, 75011 Paris", k()),
    para("N° RNA : W751234567", k()),
    para("SIRET : —", k()),
    para("Directeur de publication : Mariam Nassar", k()),
    para("Contact : contact@lecombatdalya.fr", k()),
    para(
      "L'association est reconnue d'intérêt général. À ce titre, les dons consentis ouvrent droit à une réduction d'impôt de 66 % de leur montant dans la limite de 20 % du revenu imposable (article 200 du Code général des impôts).",
      k(),
    ),
    block("Hébergement", "h2", k()),
    para("Hébergeur : Vercel Inc.", k()),
    para("Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, USA", k()),
    para("Site web : vercel.com", k()),
    block("Propriété intellectuelle", "h2", k()),
    para(
      "L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.",
      k(),
    ),
    para(
      "La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de publication.",
      k(),
    ),
    block("Liens hypertextes", "h2", k()),
    para(
      "Le site peut contenir des liens vers d'autres sites internet ou ressources disponibles sur internet. Le Combat d'Alya ne dispose d'aucun moyen pour contrôler ces sites externes et ne peut être tenu responsable de leur contenu.",
      k(),
    ),
    para(
      "La création de liens vers le site lecombatdalya.fr est autorisée, à condition qu'ils ne portent pas atteinte aux intérêts de l'association et qu'ils précisent la source.",
      k(),
    ),
    block("Paiement et dons", "h2", k()),
    para(
      "Les dons effectués via ce site sont collectés par HelloAsso, partenaire de paiement de l'association. HelloAsso est édité par la société HelloAsso, société par actions simplifiée au capital de 32 350 €, immatriculée au RCS de Bordeaux sous le numéro 521 788 308.",
      k(),
    ),
    para(
      "Les reçus fiscaux (CERFA n° 11580*04) sont émis et envoyés automatiquement par HelloAsso à l'adresse email indiquée lors du don.",
      k(),
    ),
    block("Données personnelles", "h2", k()),
    para(
      "Pour toute information sur la collecte et le traitement de vos données personnelles, consultez notre politique de confidentialité.",
      k(),
    ),
    block("Crédits", "h2", k()),
    para(
      "Design & développement : équipe bénévole du Combat d'Alya. Typographies : Newsreader & Manrope (Google Fonts).",
      k(),
    ),
  ];

  return {
    _id: "legal-mentions-legales",
    _type: "legalPage",
    title: "Mentions légales",
    slug: { _type: "slug", current: "mentions-legales" },
    intro:
      "Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.",
    lastUpdated: LAST_UPDATED,
    body,
  };
}

/* ---- testimonial documents (placeholders) --------------------------------- */

type TestimonialSeed = {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  featured: boolean;
  order: number;
};

const TESTIMONIALS: TestimonialSeed[] = [
  {
    id: "testimonial-jean-marc",
    quote:
      "Grâce au soutien de l'association, ma fille a pu accéder à des soins qu'on n'imaginait pas possibles. Au-delà du financement, c'est une famille élargie que nous avons trouvée — une communauté qui comprend ce qu'on traverse, sans jugement et avec une bienveillance rare.",
    authorName: "Jean-Marc Tessier",
    authorRole: "Parent bénéficiaire · Lyon",
    featured: true,
    order: 1,
  },
  {
    id: "testimonial-marie",
    quote:
      "L'engagement de cette association est admirable. On sent une réelle chaleur humaine derrière chaque initiative.",
    authorName: "Marie Lefèvre",
    authorRole: "Donatrice régulière · Paris",
    featured: false,
    order: 2,
  },
  {
    id: "testimonial-sophie",
    quote:
      "Chaque euro donné est utilisé avec une transparence exemplaire. C'est rassurant et profondément motivant.",
    authorName: "Sophie Dubois",
    authorRole: "Bénévole depuis 2024 · Bordeaux",
    featured: false,
    order: 3,
  },
];

function buildTestimonial(t: TestimonialSeed) {
  return {
    _id: t.id,
    _type: "testimonial",
    quote: t.quote,
    authorName: t.authorName,
    authorRole: t.authorRole,
    featured: t.featured,
    order: t.order,
  };
}

/* ---- partner documents (placeholders) ------------------------------------- */

const PARTNERS = [
  "Fondation de France",
  "Hôpital Necker",
  "Croix-Rouge",
  "APF France Handicap",
  "Le Monde",
  "Mediapart",
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildPartner(name: string, index: number) {
  return {
    _id: `partner-${slugify(name)}`,
    _type: "partner",
    name,
    tier: "silver",
    order: (index + 1) * 10,
  };
}

/* ---- article documents (placeholders) ------------------------------------- */

type ArticleSeed = {
  slug: string;
  title: string;
  category: string; // schema list value
  categoryLabel: string; // original display label (kept in mind, not stored)
  excerpt: string;
  publishedAt: string;
  readingTime?: number;
  featured: boolean;
  cover: string;
};

/** Map the page's display categories onto the article schema's category list. */
const CATEGORY_MAP: Record<string, string> = {
  Campagne: "annonce",
  Programme: "annonce",
  Communauté: "evenement",
  Partenariat: "presse",
  Transparence: "annonce",
  Témoignage: "temoignage",
  Mécénat: "presse",
};

const ARTICLES: ArticleSeed[] = [
  {
    slug: "campagne-cytotron-mexique",
    title: "Cytotron : objectif un second protocole médical au Mexique",
    categoryLabel: "Campagne",
    category: CATEGORY_MAP["Campagne"],
    excerpt:
      "Après un premier protocole financé au Mexique en décembre 2025, la nouvelle campagne vise un second traitement par Cytotron pour Alya. Retour sur la mobilisation en cours — et ce qui reste à réunir.",
    publishedAt: "2026-05-12",
    readingTime: 6,
    featured: true,
    cover: CAMPAIGN_IMAGE,
  },
  {
    slug: "barcelone-trois-familles",
    title: "Barcelone : trois familles partent en rééducation cet été",
    categoryLabel: "Programme",
    category: CATEGORY_MAP["Programme"],
    excerpt:
      "Grâce au partenariat avec la clinique Vall d'Hebron, trois enfants accédéront à un protocole de neurorééducation inédit.",
    publishedAt: "2026-04-28",
    featured: false,
    cover: HERO_IMAGE,
  },
  {
    slug: "voix-dalya-bordeaux",
    title: "« Voix d'Alya » : le festival fait sa rentrée à Bordeaux",
    categoryLabel: "Communauté",
    category: CATEGORY_MAP["Communauté"],
    excerpt:
      "Concerts, conférences, ateliers : le festival de sensibilisation s'installera à Bordeaux du 12 au 14 septembre 2026.",
    publishedAt: "2026-04-15",
    featured: false,
    cover: CAMPAIGN_IMAGE,
  },
  {
    slug: "mediapart-dossier",
    title: "Mediapart consacre un dossier aux maladies rares pédiatriques",
    categoryLabel: "Partenariat",
    category: CATEGORY_MAP["Partenariat"],
    excerpt:
      "Un travail journalistique de six mois pour mettre en lumière le combat de huit familles, dont celle d'Alya.",
    publishedAt: "2026-04-03",
    featured: false,
    cover: HERO_IMAGE,
  },
  {
    slug: "rapport-activite-2025",
    title: "Rapport d'activité 2025 : 85 % des dons reversés aux programmes",
    categoryLabel: "Transparence",
    category: CATEGORY_MAP["Transparence"],
    excerpt:
      "Comme chaque année, le bilan financier détaillé est disponible en libre accès. Découvrez où sont allés vos dons.",
    publishedAt: "2026-03-20",
    featured: false,
    cover: CAMPAIGN_IMAGE,
  },
  {
    slug: "sophie-temoignage",
    title: "« Cette association nous a sauvé du naufrage »",
    categoryLabel: "Témoignage",
    category: CATEGORY_MAP["Témoignage"],
    excerpt:
      "Sophie raconte comment l'accompagnement des familles l'a aidée à traverser le diagnostic de sa fille.",
    publishedAt: "2026-03-08",
    featured: false,
    cover: HERO_IMAGE,
  },
  {
    slug: "atelier-lumiere-mecene",
    title: "Une nouvelle entreprise rejoint nos mécènes : Atelier Lumière",
    categoryLabel: "Mécénat",
    category: CATEGORY_MAP["Mécénat"],
    excerpt:
      "L'atelier de lutherie parisien s'engage sur trois ans pour financer notre programme d'équipement.",
    publishedAt: "2026-02-22",
    featured: false,
    cover: CAMPAIGN_IMAGE,
  },
];

async function buildArticle(a: ArticleSeed) {
  const cover = await uploadImage(a.cover, "image", a.title);
  // Body is a short single-paragraph placeholder built from the excerpt.
  const body = paragraphs([a.excerpt], `article-${a.slug}`);
  return {
    _id: `article-${a.slug}`,
    _type: "article",
    title: a.title,
    slug: { _type: "slug", current: a.slug },
    category: a.category,
    excerpt: a.excerpt,
    cover,
    publishedAt: `${a.publishedAt}T09:00:00.000Z`,
    ...(a.readingTime ? { readingTime: a.readingTime } : {}),
    featured: a.featured,
    body,
  };
}

/* ---- campaign document (placeholder) -------------------------------------- */

async function buildCampaign() {
  const cover = await uploadImage(CAMPAIGN_IMAGE, "image", "Campagne Cytotron pour Alya");
  return {
    _id: "campaign-cytotron",
    _type: "campaign",
    title: "Cytotron : un second protocole médical pour Alya",
    slug: { _type: "slug", current: "cytotron" },
    tagline:
      "Après un premier protocole financé au Mexique en décembre 2025, aidez-nous à offrir à Alya un second traitement par Cytotron.",
    description:
      "Après un premier protocole financé au Mexique en décembre 2025, aidez-nous à offrir à Alya un second traitement par Cytotron.",
    cover,
    goalAmount: 20000,
    raisedAmount: 12450,
    supporters: 847,
    helloAssoUrl:
      "https://www.helloasso.com/associations/le-combat-d-alya/formulaires/2",
    status: "active",
    featured: true,
  };
}

/* ===========================================================================
 * 5. Orchestration
 * ========================================================================= */

type SeedDoc = { _id: string; _type: string };

async function main() {
  console.log("");
  console.log("═".repeat(72));
  console.log(
    `Seed Sanity — ${DRY_RUN ? "DRY RUN (no writes, no uploads)" : "LIVE"}  ` +
      `[project=${projectId ?? "?"} dataset=${dataset ?? "?"} apiVersion=${apiVersion}]`,
  );
  console.log("═".repeat(72));

  // Build everything first (uploads happen here in a live run).
  console.log("\n▸ Singletons");
  const siteSettings = await buildSiteSettings();
  note(siteSettings, "Paramètres du site", true); // contains invented stats
  const homePage = await buildHomePage();
  note(homePage, "Accueil (hero, stats, fondatrice, FAQ, newsletter)");
  const storyPage = await buildStoryPage();
  note(storyPage, "Notre histoire (hero, mot des parents, timeline, valeurs, galerie)");
  const missionsPage = buildMissionsPage();
  note(missionsPage, "Page Missions (hero + intro)");
  const helpPage = buildHelpPage();
  note(helpPage, "Comment aider (ways, steps, défiscalisation)");
  const contactPage = buildContactPage();
  note(contactPage, "Contact (channels, quick links, réseaux)");
  const newsPage = buildNewsPage();
  note(newsPage, "Page Actualités (hero)");
  const eventsPage = buildEventsPage();
  note(eventsPage, "Page Événements (hero)");

  console.log("\n▸ Missions");
  const missions = MISSIONS.map(buildMission);
  for (const m of missions) note(m, m.title);

  console.log("\n▸ Legal pages");
  const legalDocs = [buildLegalCgu(), buildLegalConfidentialite(), buildLegalMentions()];
  for (const d of legalDocs) note(d, d.title);

  console.log("\n▸ Testimonials (placeholders)");
  const testimonials = TESTIMONIALS.map(buildTestimonial);
  for (const t of testimonials) note(t, `${t.authorName} — ${t.authorRole}`, true);

  console.log("\n▸ Partners (placeholders)");
  const partners = PARTNERS.map(buildPartner);
  for (const p of partners) note(p, p.name, true);

  console.log("\n▸ Articles (placeholders)");
  const articles: SeedDoc[] = [];
  for (const a of ARTICLES) {
    const doc = await buildArticle(a);
    articles.push(doc);
    note(doc, `${doc.title}${a.featured ? "  [à la une]" : ""}`, true);
  }

  console.log("\n▸ Campaign (placeholder)");
  const campaign = await buildCampaign();
  note(campaign, campaign.title, true);

  // Collect every document for the write phase.
  const allDocs: SeedDoc[] = [
    siteSettings,
    homePage,
    storyPage,
    missionsPage,
    helpPage,
    contactPage,
    newsPage,
    eventsPage,
    ...missions,
    ...legalDocs,
    ...testimonials,
    ...partners,
    ...articles,
    campaign,
  ];

  /* ---- Write phase ------------------------------------------------------- */

  if (!DRY_RUN) {
    console.log("\n▸ Writing to Sanity (createOrReplace in a single transaction)…");
    let tx = client().transaction();
    for (const doc of allDocs) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tx = tx.createOrReplace(doc as any);
    }
    const res = await tx.commit();
    console.log(
      `  ✓ Committed transaction ${res.transactionId} (${allDocs.length} documents).`,
    );
    if (uploadedAssets.length) {
      console.log(`  ✓ Uploaded ${uploadedAssets.length} image asset(s).`);
    }
  }

  /* ---- Summary ----------------------------------------------------------- */

  printSummary(allDocs.length);
}

function printSummary(total: number) {
  console.log("\n" + "═".repeat(72));
  console.log(`SUMMARY — ${DRY_RUN ? "documents that WOULD be created" : "documents written"}`);
  console.log("═".repeat(72));

  // Group counts by type.
  const byType = new Map<string, { total: number; placeholders: number }>();
  for (const d of logged) {
    const entry = byType.get(d.type) ?? { total: 0, placeholders: 0 };
    entry.total += 1;
    if (d.placeholder) entry.placeholders += 1;
    byType.set(d.type, entry);
  }

  const typeNames = [...byType.keys()].sort();
  for (const type of typeNames) {
    const { total: t, placeholders } = byType.get(type)!;
    const ph = placeholders ? `  (${placeholders} ${PLACEHOLDER_NOTE})` : "";
    console.log(`  ${type.padEnd(16)} ${String(t).padStart(2)}${ph}`);
  }

  console.log("─".repeat(72));
  const placeholderTotal = logged.filter((d) => d.placeholder).length;
  console.log(
    `  TOTAL: ${total} documents across ${typeNames.length} types ` +
      `(${placeholderTotal} placeholder docs to review).`,
  );
  if (DRY_RUN) {
    console.log(
      `  Image uploads skipped (dry run). ${
        new Set([HERO_IMAGE, PORTRAIT_IMAGE, CAMPAIGN_IMAGE, LOGO_PATH]).size
      } distinct sources would be uploaded.`,
    );
  } else {
    console.log(`  Image assets uploaded: ${uploadedAssets.length}.`);
  }
  console.log("═".repeat(72) + "\n");
}

main().catch((err) => {
  console.error("\n✖ Seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
