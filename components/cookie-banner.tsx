"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icon";

const STORAGE_KEY = "lca-cookie-consent";

export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const isStudio = pathname?.startsWith("/studio");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStudio) return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // small delay so it doesn't fight the page entrance animations
        const t = window.setTimeout(() => setVisible(true), 1200);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, [isStudio]);

  const persist = (value: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:max-w-md z-[55]"
          role="dialog"
          aria-live="polite"
          aria-label="Bandeau cookies"
        >
          <div className="bg-surface-container-lowest rounded-3xl shadow-[0_20px_60px_-15px_rgba(55,12,19,0.18)] p-6 md:p-7 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-fixed-dim/30 blur-[60px] rounded-full" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center">
                  <Icon name="cookie" filled className="text-xl" />
                </span>
                <p className="text-[10px] uppercase tracking-[0.3em] text-secondary font-semibold">
                  Vos préférences
                </p>
              </div>

              <p className="text-on-surface text-sm leading-relaxed mb-5">
                Ce site ne dépose <strong>aucun cookie de traçage</strong>.
                Seuls les cookies strictement nécessaires au formulaire de don
                HelloAsso peuvent être déposés au moment où vous donnez.
              </p>

              <p className="text-xs text-on-surface-variant italic font-serif mb-5">
                En savoir plus dans notre{" "}
                <Link
                  href="/confidentialite"
                  className="text-secondary hover:underline underline-offset-4"
                >
                  politique de confidentialité
                </Link>
                .
              </p>

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => persist("declined")}
                  className="flex-1 px-5 py-3 rounded-full text-primary font-semibold text-sm bg-surface-container-high hover:bg-surface-container-highest transition-colors"
                >
                  Refuser
                </button>
                <button
                  type="button"
                  onClick={() => persist("accepted")}
                  className="flex-1 px-5 py-3 rounded-full text-on-secondary font-bold text-sm bg-gradient-to-br from-secondary to-[#e01e62] shadow-[0_8px_24px_-6px_rgba(184,0,75,0.35)] hover:scale-[1.02] transition-transform"
                >
                  J&apos;ai compris
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
