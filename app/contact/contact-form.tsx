"use client";

import { useActionState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@/components/icon";
import { submitContact, type ContactState } from "./actions";

const REASONS = [
  { value: "don", label: "Question sur un don" },
  { value: "benevolat", label: "Devenir bénévole" },
  { value: "famille", label: "Soutien aux familles" },
  { value: "presse", label: "Demande presse" },
  { value: "partenariat", label: "Partenariat / Mécénat" },
  { value: "autre", label: "Autre demande" },
] as const;

const INITIAL: ContactState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary py-4 md:py-5 px-10 rounded-full text-base font-bold shadow-[0_12px_32px_-8px_rgba(184,0,75,0.35)] hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 transition-transform flex items-center justify-center gap-3"
    >
      {pending ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-on-secondary/40 border-t-on-secondary rounded-full animate-spin" />
          Envoi en cours…
        </>
      ) : (
        <>
          Envoyer le message
          <Icon name="arrow_forward" />
        </>
      )}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const fieldError = (name: string) => state.fieldErrors?.[name as keyof NonNullable<ContactState["fieldErrors"]>];

  return (
    <form ref={formRef} action={formAction} className="space-y-6 md:space-y-7" noValidate>
      {/* Honeypot — hidden from humans */}
      <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Ne pas remplir
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        <Field
          id="firstname"
          name="firstname"
          label="Prénom"
          placeholder="Camille"
          error={fieldError("firstname")}
        />
        <Field
          id="lastname"
          name="lastname"
          label="Nom"
          placeholder="Lefèvre"
          error={fieldError("lastname")}
        />
      </div>

      <Field
        id="email"
        name="email"
        type="email"
        label="Email"
        placeholder="vous@email.com"
        error={fieldError("email")}
      />

      <div>
        <span className="block text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
          Sujet
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
          {REASONS.map((r, idx) => (
            <label key={r.value} className="cursor-pointer">
              <input
                type="radio"
                name="reason"
                value={r.value}
                defaultChecked={idx === 0}
                className="peer sr-only"
              />
              <div className="text-center px-3 py-3 bg-surface-container-high rounded-full text-xs md:text-sm font-semibold text-primary peer-checked:bg-secondary peer-checked:text-on-secondary transition-colors hover:bg-surface-container-highest">
                {r.label}
              </div>
            </label>
          ))}
        </div>
        {fieldError("reason") && (
          <p className="text-xs text-secondary mt-2">{fieldError("reason")}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          placeholder="Racontez-nous…"
          aria-invalid={!!fieldError("message")}
          className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors resize-none"
        />
        {fieldError("message") && (
          <p className="text-xs text-secondary mt-2">{fieldError("message")}</p>
        )}
      </div>

      <label className="flex items-start gap-3 text-sm text-on-surface-variant cursor-pointer">
        <input
          type="checkbox"
          name="consent"
          value="on"
          className="mt-1 w-5 h-5 rounded accent-secondary"
        />
        <span>
          J&apos;accepte que mes informations soient utilisées pour me répondre.
          Aucune donnée n&apos;est transmise à des tiers.
        </span>
      </label>
      {fieldError("consent") && (
        <p className="text-xs text-secondary -mt-3">{fieldError("consent")}</p>
      )}

      <AnimatePresence>
        {state.status !== "idle" && state.message && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            role="status"
            aria-live="polite"
            className={`flex items-start gap-3 p-4 rounded-2xl text-sm ${
              state.status === "success"
                ? "bg-secondary-fixed text-secondary"
                : "bg-error-container text-on-error-container"
            }`}
          >
            <Icon
              name={state.status === "success" ? "check_circle" : "error"}
              filled
              className="text-xl flex-shrink-0 mt-0.5"
            />
            <p className="leading-relaxed">{state.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <SubmitButton />
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  placeholder,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        className="w-full bg-surface-container-high border-none rounded-2xl px-5 py-4 text-base focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:bg-surface-container-lowest transition-colors"
      />
      {error && <p className="text-xs text-secondary mt-2">{error}</p>}
    </div>
  );
}
