import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/icon";
import { sanityWriteClient } from "@/sanity/server-client";

export const metadata: Metadata = {
  title: "Se désinscrire · Le Combat d'Alya",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ email?: string }>;

async function unsubscribe(email: string) {
  const sub = await sanityWriteClient.fetch<{ _id: string } | null>(
    `*[_type == "subscriber" && email == $email][0]{_id}`,
    { email: email.toLowerCase().trim() },
  );
  if (!sub) return { ok: false, reason: "not_found" as const };
  await sanityWriteClient.patch(sub._id).set({ status: "unsubscribed" }).commit();
  return { ok: true as const };
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email } = await searchParams;
  let state: "missing" | "ok" | "not_found" | "preview" = "missing";

  if (email === "preview") {
    state = "preview";
  } else if (email) {
    const result = await unsubscribe(email);
    state = result.ok ? "ok" : result.reason;
  }

  const message =
    state === "ok"
      ? "Votre désinscription est confirmée. Vous ne recevrez plus nos emails."
      : state === "preview"
        ? "Aperçu : ce lien désinscrirait normalement le destinataire."
        : state === "not_found"
          ? "Cette adresse n'est pas dans nos abonnés actifs."
          : "Aucune adresse fournie.";

  return (
    <>
      <Nav />
      <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-6">
            Newsletter
          </p>
          <h1 className="font-serif text-primary text-4xl md:text-5xl leading-tight mb-6">
            {state === "ok" ? (
              <>
                <span className="italic">Désinscription</span> confirmée.
              </>
            ) : (
              <>Préférences de réception.</>
            )}
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed mb-10">
            {message}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-[0_12px_32px_-8px_rgba(184,0,75,0.35)]"
          >
            <Icon name="home" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
