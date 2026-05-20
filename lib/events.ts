const DATETIME_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatEventDate(iso: string): string {
  return DATETIME_FORMATTER.format(new Date(iso));
}

export function formatEventTime(iso: string): string {
  return TIME_FORMATTER.format(new Date(iso));
}

export function formatEventRange(startsAt: string, endsAt?: string | null) {
  const start = new Date(startsAt);
  const startDate = DATETIME_FORMATTER.format(start);
  const startTime = TIME_FORMATTER.format(start);
  if (!endsAt) return { date: startDate, time: startTime };

  const end = new Date(endsAt);
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return {
      date: startDate,
      time: `${startTime} – ${TIME_FORMATTER.format(end)}`,
    };
  }
  return {
    date: `${startDate} – ${DATETIME_FORMATTER.format(end)}`,
    time: `${startTime} – ${TIME_FORMATTER.format(end)}`,
  };
}

function toIcsDate(iso: string) {
  // YYYYMMDDTHHMMSSZ in UTC
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(text: string) {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildIcs({
  id,
  title,
  startsAt,
  endsAt,
  location,
  description,
  url,
}: {
  id: string;
  title: string;
  startsAt: string;
  endsAt?: string | null;
  location?: string | null;
  description?: string | null;
  url?: string | null;
}) {
  const dtEnd = endsAt ?? new Date(new Date(startsAt).getTime() + 60 * 60 * 1000).toISOString();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Le Combat d'Alya//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${id}@lecombatdalya.fr`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(startsAt)}`,
    `DTEND:${toIcsDate(dtEnd)}`,
    `SUMMARY:${escapeIcs(title)}`,
    location ? `LOCATION:${escapeIcs(location)}` : "",
    description ? `DESCRIPTION:${escapeIcs(description)}` : "",
    url ? `URL:${escapeIcs(url)}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}
