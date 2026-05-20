"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="min-h-screen flex items-center justify-center p-8 bg-[#fdf9f6] text-[#1e0c10] font-sans">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b8004b] mb-4 font-semibold">
            Erreur inattendue
          </p>
          <h1 className="font-serif italic text-4xl mb-4">
            Quelque chose s&apos;est cassé.
          </h1>
          <p className="text-sm opacity-70 mb-8">
            Nos équipes ont été notifiées. Vous pouvez recharger la page ou
            revenir à l&apos;accueil.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 rounded-full bg-[#864b51] text-white text-sm font-semibold"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
