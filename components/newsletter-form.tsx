"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "./icon";
import {
  subscribeNewsletter,
  type SubscribeState,
} from "@/app/newsletter/actions";

const INITIAL: SubscribeState = { status: "idle" };

function SubscribeButton({ tone = "secondary" }: { tone?: "secondary" | "ghost" }) {
  const { pending } = useFormStatus();
  const base =
    tone === "ghost"
      ? "bg-primary text-on-primary"
      : "bg-gradient-to-br from-secondary to-[#e01e62] text-white shadow-[0_8px_24px_-6px_rgba(184,0,75,0.4)]";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 transition-transform ${base}`}
      aria-label="S'inscrire"
    >
      {pending ? (
        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <Icon name="arrow_forward" />
      )}
    </button>
  );
}

export function NewsletterForm({
  source = "site-cta",
  placeholder = "votre@email.com",
  tone = "secondary",
  className,
}: {
  source?: "site-footer" | "site-cta" | "donation" | "manual";
  placeholder?: string;
  tone?: "secondary" | "ghost";
  className?: string;
}) {
  const [state, formAction] = useActionState(subscribeNewsletter, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  return (
    <div className={className}>
      <form ref={formRef} action={formAction} className="relative" noValidate>
        <input type="hidden" name="source" value={source} />
        <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden>
          <label>
            Ne pas remplir
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <input
          name="email"
          type="email"
          required
          placeholder={placeholder}
          aria-label="Adresse email"
          className="w-full bg-surface-container-lowest border-none rounded-full py-4 md:py-5 pl-6 md:pl-7 pr-14 md:pr-16 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-secondary/30 shadow-sm"
        />
        <SubscribeButton tone={tone} />
      </form>

      <AnimatePresence>
        {state.status !== "idle" && state.message && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            role="status"
            aria-live="polite"
            className={`text-xs mt-3 font-serif italic ${
              state.status === "success"
                ? "text-secondary"
                : "text-on-error-container"
            }`}
          >
            {state.message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
