"use server";

import { z } from "zod";
import * as Sentry from "@sentry/nextjs";
import { resend, FROM_EMAIL, CONTACT_TO_EMAIL } from "@/lib/resend";

const REASON_LABELS: Record<string, string> = {
  don: "Question sur un don",
  benevolat: "Devenir bénévole",
  famille: "Soutien aux familles",
  presse: "Demande presse",
  partenariat: "Partenariat / Mécénat",
  autre: "Autre demande",
};

const ContactSchema = z.object({
  firstname: z.string().trim().min(1, "Prénom requis").max(80),
  lastname: z.string().trim().min(1, "Nom requis").max(80),
  email: z.email("Email invalide").max(160),
  reason: z.enum(["don", "benevolat", "famille", "presse", "partenariat", "autre"]),
  message: z.string().trim().min(10, "Message trop court (min. 10 caractères)").max(5000),
  consent: z.literal("on", { error: "Le consentement est requis" }),
  // Honeypot — must stay empty
  website: z.string().max(0).optional(),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof z.infer<typeof ContactSchema>, string>>;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    reason: formData.get("reason"),
    message: formData.get("message"),
    consent: formData.get("consent"),
    website: formData.get("website"),
  };

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof z.infer<typeof ContactSchema>;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Quelques champs sont à corriger.",
      fieldErrors,
    };
  }

  // Honeypot triggered: pretend success but do nothing
  if (parsed.data.website && parsed.data.website.length > 0) {
    return { status: "success", message: "Merci, votre message a bien été envoyé." };
  }

  const { firstname, lastname, email, reason, message } = parsed.data;
  const reasonLabel = REASON_LABELS[reason] ?? reason;
  const fullName = `${firstname} ${lastname}`.trim();

  const subject = `[Contact site] ${reasonLabel} — ${fullName}`;
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#1e0c10;">
      <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#b8004b;margin-bottom:8px;">
        Nouveau message · Le Combat d'Alya
      </p>
      <h1 style="font-family:Georgia,serif;font-style:italic;color:#864b51;margin:0 0 24px;">
        ${escapeHtml(reasonLabel)}
      </h1>
      <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">
        <tr><td style="padding:6px 0;color:#7a6a6c;width:120px;">De</td><td>${escapeHtml(fullName)}</td></tr>
        <tr><td style="padding:6px 0;color:#7a6a6c;">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#b8004b;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:6px 0;color:#7a6a6c;">Sujet</td><td>${escapeHtml(reasonLabel)}</td></tr>
      </table>
      <div style="margin-top:24px;padding:24px;background:#f7efe9;border-radius:16px;white-space:pre-wrap;font-size:15px;line-height:1.7;">
${escapeHtml(message)}
      </div>
    </div>
  `.trim();

  const text = `Nouveau message — Le Combat d'Alya
Sujet : ${reasonLabel}
De : ${fullName} <${email}>

${message}`;

  try {
    const { error } = await resend.emails.send({
      from: `Le Combat d'Alya <${FROM_EMAIL}>`,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) {
      Sentry.captureException(error, { tags: { feature: "contact-form" } });
      return {
        status: "error",
        message: "L'envoi a échoué. Réessayez ou écrivez-nous directement à contact@lecombatdalya.fr.",
      };
    }

    return {
      status: "success",
      message: "Merci, votre message a bien été envoyé. Nous revenons vers vous sous 48 h.",
    };
  } catch (err) {
    Sentry.captureException(err, { tags: { feature: "contact-form" } });
    return {
      status: "error",
      message: "Erreur inattendue. Réessayez plus tard.",
    };
  }
}
