import { NextResponse } from "next/server";
import { sanityFetch } from "@/sanity/fetch";
import { eventBySlugQuery } from "@/sanity/queries";
import type { EventDoc } from "@/sanity/types";
import { buildIcs } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

type Params = { slug: string };

export async function GET(
  _req: Request,
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const event = await sanityFetch<EventDoc | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: ["event", `event:${slug}`],
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const ics = buildIcs({
    id: event._id,
    title: event.title,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    location: event.location ?? event.address,
    description: event.description,
    url: `${SITE_URL}/evenements/${event.slug}`,
  });

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
      "Cache-Control": "public, max-age=60",
    },
  });
}
