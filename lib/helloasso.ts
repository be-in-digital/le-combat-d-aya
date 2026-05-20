const TOKEN_URL = "https://api.helloasso.com/oauth2/token";
const API_BASE = "https://api.helloasso.com/v5";

type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let tokenCache: TokenCache | null = null;

export function isHelloAssoConfigured() {
  return Boolean(
    process.env.HELLOASSO_CLIENT_ID &&
      process.env.HELLOASSO_CLIENT_SECRET &&
      process.env.HELLOASSO_ORG_SLUG &&
      process.env.HELLOASSO_FORM_SLUG &&
      process.env.HELLOASSO_FORM_TYPE,
  );
}

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now + 30_000) {
    return tokenCache.accessToken;
  }

  const clientId = process.env.HELLOASSO_CLIENT_ID;
  const clientSecret = process.env.HELLOASSO_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("HelloAsso credentials are not configured");
  }

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `HelloAsso token request failed: ${res.status} ${await res.text()}`,
    );
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  tokenCache = {
    accessToken: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return tokenCache.accessToken;
}

export type FormStats = {
  raisedAmount: number;
  supporters: number;
  goalAmount?: number | null;
  currency: "EUR";
  title?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  coverAlt?: string | null;
  helloAssoUrl?: string | null;
  endDate?: string | null;
};

type HelloAssoPayment = {
  amount?: number;
  state?: string;
  payer?: { email?: string };
  order?: { id?: number };
};

type HelloAssoPaymentsPage = {
  data?: HelloAssoPayment[];
  pagination?: { pageSize?: number; pageIndex?: number };
};

type HelloAssoFormPublic = {
  amountInCents?: number | null;
  title?: string;
  description?: string;
  state?: string;
  url?: string;
  endDate?: string;
  banner?: { publicUrl?: string };
  logo?: { publicUrl?: string };
};

async function helloFetch<T>(
  path: string,
  init?: RequestInit & { revalidate?: number },
): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: init?.revalidate ?? 300 },
  });
  if (!res.ok) {
    throw new Error(
      `HelloAsso request failed: ${res.status} ${await res.text()}`,
    );
  }
  return (await res.json()) as T;
}

// HelloAsso caps pageSize at 100; paginate by pageIndex until we drain the
// stream. Bounded at MAX_PAGES so a runaway form can't blow up the request.
const MAX_PAGES = 20;
const PAGE_SIZE = 100;

async function fetchAllPayments(
  orgSlug: string,
  formType: string,
  formSlug: string,
): Promise<HelloAssoPayment[]> {
  const all: HelloAssoPayment[] = [];
  for (let pageIndex = 1; pageIndex <= MAX_PAGES; pageIndex++) {
    const page = await helloFetch<HelloAssoPaymentsPage>(
      `/organizations/${orgSlug}/forms/${formType}/${formSlug}/payments?pageIndex=${pageIndex}&pageSize=${PAGE_SIZE}`,
      { revalidate: 300 },
    );
    const data = page.data ?? [];
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
  }
  return all;
}

export async function getFormStats(opts?: {
  orgSlug?: string;
  formType?: string;
  formSlug?: string;
}): Promise<FormStats | null> {
  const orgSlug = opts?.orgSlug ?? process.env.HELLOASSO_ORG_SLUG;
  const formType = opts?.formType ?? process.env.HELLOASSO_FORM_TYPE;
  const formSlug = opts?.formSlug ?? process.env.HELLOASSO_FORM_SLUG;

  if (!orgSlug || !formType || !formSlug) return null;
  if (!isHelloAssoConfigured()) return null;

  try {
    const payments = await fetchAllPayments(orgSlug, formType, formSlug);

    // Only count fully authorized payments toward the raised total.
    // HelloAsso's orders endpoint returns totalCount: -1 (not computed),
    // so we derive unique supporters from the payments themselves.
    const supporterKeys = new Set<string>();
    let raisedCents = 0;
    for (const p of payments) {
      if (p.state !== "Authorized") continue;
      raisedCents += p.amount ?? 0;
      const key = p.payer?.email ?? (p.order?.id ? `order:${p.order.id}` : null);
      if (key) supporterKeys.add(key);
    }

    // The public form endpoint works without elevated scopes and gives us
    // the goal amount when the form has one (free-amount donation forms
    // return null — we fall through to the Sanity-configured goal) along
    // with title, description, and banner image for the featured card.
    let goalAmount: number | null = null;
    let title: string | null = null;
    let description: string | null = null;
    let coverUrl: string | null = null;
    let helloAssoUrl: string | null = null;
    let endDate: string | null = null;
    try {
      const details = await helloFetch<HelloAssoFormPublic>(
        `/organizations/${orgSlug}/forms/${formType}/${formSlug}/public`,
        { revalidate: 3600 },
      );
      goalAmount = details.amountInCents
        ? Math.round(details.amountInCents / 100)
        : null;
      title = details.title?.trim() ?? null;
      description = details.description?.trim() ?? null;
      coverUrl = details.banner?.publicUrl ?? details.logo?.publicUrl ?? null;
      helloAssoUrl = details.url ?? null;
      endDate = details.endDate ?? null;
    } catch {
      // Non-fatal: form details are optional.
    }

    return {
      raisedAmount: Math.round(raisedCents / 100),
      supporters: supporterKeys.size,
      goalAmount,
      currency: "EUR",
      title,
      description,
      coverUrl,
      coverAlt: title,
      helloAssoUrl,
      endDate,
    };
  } catch (err) {
    console.error("HelloAsso getFormStats failed", err);
    return null;
  }
}
