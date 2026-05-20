"use server";

import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { sanityWriteClient } from "@/sanity/server-client";
import { resend, FROM_EMAIL } from "@/lib/resend";

const SubscribeSchema = z.object({
  email: z.email("Email invalide").max(160),
  firstName: z.string().trim().max(80).optional(),
  source: z
    .enum(["site-footer", "site-cta", "donation", "manual"])
    .default("site-cta"),
  website: z.string().max(0).optional(),
});

export type SubscribeState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function subscribeNewsletter(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = SubscribeSchema.safeParse({
    email: formData.get("email"),
    firstName: formData.get("firstName") || undefined,
    source: formData.get("source") || undefined,
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  // Honeypot
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { status: "success", message: "Merci ! Inscription confirmée." };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const subscribedAt = new Date().toISOString();

  try {
    const existing = await sanityWriteClient.fetch<{
      _id: string;
      status?: string;
    } | null>(`*[_type == "subscriber" && email == $email][0]{ _id, status }`, {
      email,
    });

    if (existing) {
      if (existing.status === "unsubscribed") {
        await sanityWriteClient
          .patch(existing._id)
          .set({ status: "active", subscribedAt })
          .commit();
      }
      return {
        status: "success",
        message: "Vous êtes déjà inscrit·e. Merci pour votre soutien.",
      };
    }

    await sanityWriteClient.create({
      _type: "subscriber",
      email,
      firstName: parsed.data.firstName,
      subscribedAt,
      source: parsed.data.source,
      status: "active",
    });

    try {
      await resend.emails.send({
        from: `Le Combat d'Alya <${FROM_EMAIL}>`,
        to: email,
        subject: "Bienvenue dans la newsletter du Combat d'Alya",
        text: `Merci pour votre inscription. Vous recevrez bientôt nos prochaines nouvelles.\n\nLe Combat d'Alya`,
        html: `<p>Merci pour votre inscription.</p><p>Vous recevrez bientôt nos prochaines nouvelles.</p><p style="font-family:Georgia,serif;font-style:italic;color:#864b51;">Le Combat d'Alya</p>`,
      });
    } catch (mailErr) {
      Sentry.captureException(mailErr, {
        tags: { feature: "newsletter-welcome" },
      });
    }

    return {
      status: "success",
      message: "Merci ! Vous êtes inscrit·e à la newsletter.",
    };
  } catch (err) {
    Sentry.captureException(err, { tags: { feature: "newsletter-subscribe" } });
    return {
      status: "error",
      message: "Inscription impossible pour l'instant. Réessayez plus tard.",
    };
  }
}
