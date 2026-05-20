"use client";

import { useCallback, useState } from "react";
import type { DocumentActionComponent } from "sanity";

const SECRET_STORAGE_KEY = "lca-newsletter-send-secret";

function getStoredSecret(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SECRET_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeSecret(value: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SECRET_STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
}

type DialogState =
  | { type: "confirm" }
  | { type: "result"; tone: "positive" | "critical"; message: string }
  | null;

export const SendNewsletterAction: DocumentActionComponent = (props) => {
  const { draft, published, type, id, onComplete } = props;
  const [dialog, setDialog] = useState<DialogState>(null);

  const status = (draft ?? published)?.status as string | undefined;
  const subject = (draft ?? published)?.subject as string | undefined;
  const body = (draft ?? published)?.body as unknown[] | undefined;

  const disabled =
    type !== "newsletterIssue" ||
    status === "sent" ||
    !subject ||
    !body ||
    body.length === 0;

  const onSend = useCallback(async () => {
    try {
      let secret = getStoredSecret();
      if (!secret) {
        secret = window.prompt(
          "Token d'envoi (NEWSLETTER_SEND_SECRET). Demandez-le à l'administrateur.",
        );
        if (!secret) {
          setDialog(null);
          onComplete();
          return;
        }
        storeSecret(secret);
      }

      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ issueId: id }),
      });
      const data = (await res.json()) as { sent?: number; error?: string };
      if (!res.ok) {
        if (res.status === 401) {
          try {
            window.localStorage.removeItem(SECRET_STORAGE_KEY);
          } catch {
            /* ignore */
          }
        }
        setDialog({
          type: "result",
          tone: "critical",
          message: data.error ?? `Erreur ${res.status}`,
        });
        return;
      }
      setDialog({
        type: "result",
        tone: "positive",
        message: `Envoyé à ${data.sent ?? 0} abonné·e·s.`,
      });
    } catch (err) {
      setDialog({
        type: "result",
        tone: "critical",
        message: err instanceof Error ? err.message : "Erreur inconnue",
      });
    }
  }, [id, onComplete]);

  return {
    disabled,
    label: status === "sent" ? "Newsletter envoyée" : "Envoyer la newsletter",
    tone: "primary",
    onHandle: () => {
      setDialog({ type: "confirm" });
    },
    dialog:
      dialog?.type === "confirm"
        ? {
            type: "confirm",
            tone: "critical",
            message:
              "Envoyer cette newsletter à TOUS les abonnés actifs ? Cette action est irréversible.",
            onConfirm: onSend,
            onCancel: () => {
              setDialog(null);
              onComplete();
            },
          }
        : dialog?.type === "result"
          ? {
              type: "popover",
              content: dialog.message,
              onClose: () => {
                setDialog(null);
                onComplete();
              },
            }
          : false,
  };
};
