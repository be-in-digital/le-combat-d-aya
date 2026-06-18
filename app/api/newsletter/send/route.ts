import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { sanityWriteClient } from "@/sanity/server-client";
import { resend, FROM_EMAIL } from "@/lib/resend";
import {
  buildNewsletterEmail,
  renderNewsletterBody,
} from "@/lib/newsletter-email";
import type { PortableTextBlock } from "@portabletext/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z.object({
  issueId: z.string().min(1),
  dryRun: z.boolean().optional(),
});

type Issue = {
  _id: string;
  subject: string;
  preheader?: string | null;
  heading?: string | null;
  body?: PortableTextBlock[] | null;
  status: "draft" | "scheduled" | "sent";
};

type Subscriber = { _id: string; email: string };

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lecombatdalya.org";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function POST(req: Request) {
  const expectedSecret = process.env.NEWSLETTER_SEND_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: "NEWSLETTER_SEND_SECRET is not configured" },
      { status: 500 },
    );
  }
  const authHeader = req.headers.get("authorization") ?? "";
  const provided = authHeader.replace(/^Bearer\s+/i, "");
  if (provided !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: z.infer<typeof BodySchema>;
  try {
    payload = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const issue = await sanityWriteClient.fetch<Issue | null>(
      `*[_type == "newsletterIssue" && _id == $id][0] {
        _id, subject, preheader, heading, body, status
      }`,
      { id: payload.issueId },
    );

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }
    if (issue.status === "sent") {
      return NextResponse.json(
        { error: "Issue has already been sent" },
        { status: 409 },
      );
    }
    if (!issue.subject || !issue.body || issue.body.length === 0) {
      return NextResponse.json(
        { error: "Issue is missing a subject or body" },
        { status: 400 },
      );
    }

    const subscribers = await sanityWriteClient.fetch<Subscriber[]>(
      `*[_type == "subscriber" && status == "active" && defined(email)]{ _id, email }`,
    );

    const heading = issue.heading ?? issue.subject;
    const bodyHtml = renderNewsletterBody(issue.body);

    if (payload.dryRun) {
      return NextResponse.json({
        ok: true,
        dryRun: true,
        recipientCount: subscribers.length,
        previewHtml: buildNewsletterEmail({
          heading,
          preheader: issue.preheader,
          bodyHtml,
          unsubscribeUrl: `${BASE_URL}/newsletter/unsubscribe?email=preview`,
        }),
      });
    }

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: "No active subscribers" },
        { status: 400 },
      );
    }

    let sent = 0;
    const batches = chunk(subscribers, 100);
    for (const batch of batches) {
      const messages = batch.map((s) => ({
        from: `Le Combat d'Alya <${FROM_EMAIL}>`,
        to: s.email,
        subject: issue.subject,
        html: buildNewsletterEmail({
          heading,
          preheader: issue.preheader,
          bodyHtml,
          unsubscribeUrl: `${BASE_URL}/newsletter/unsubscribe?email=${encodeURIComponent(s.email)}`,
        }),
        tags: [
          { name: "category", value: "newsletter" },
          { name: "issue_id", value: issue._id },
        ],
      }));
      const { error } = await resend.batch.send(messages);
      if (error) {
        Sentry.captureException(error, {
          tags: { feature: "newsletter-send", issueId: issue._id },
        });
        return NextResponse.json(
          { error: `Resend batch failed: ${error.message}` },
          { status: 502 },
        );
      }
      sent += batch.length;
    }

    await sanityWriteClient
      .patch(issue._id)
      .set({
        status: "sent",
        sentAt: new Date().toISOString(),
        recipientCount: sent,
      })
      .commit();

    return NextResponse.json({ ok: true, sent, batches: batches.length });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { feature: "newsletter-send", issueId: payload.issueId },
    });
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
