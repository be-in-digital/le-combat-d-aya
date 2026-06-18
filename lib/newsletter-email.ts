import { toHTML, type PortableTextHtmlComponents } from "@portabletext/to-html";
import { urlForImage } from "@/sanity/image";
import type { PortableTextBlock } from "@portabletext/types";

const components: Partial<PortableTextHtmlComponents> = {
  block: {
    normal: ({ children }) =>
      `<p style="font-size:16px;line-height:1.7;color:#1e0c10;margin:0 0 20px;">${children}</p>`,
    h2: ({ children }) =>
      `<h2 style="font-family:Georgia,serif;font-size:26px;color:#864b51;margin:36px 0 14px;">${children}</h2>`,
    h3: ({ children }) =>
      `<h3 style="font-family:Georgia,serif;font-size:22px;color:#864b51;margin:30px 0 12px;">${children}</h3>`,
    blockquote: ({ children }) =>
      `<blockquote style="font-family:Georgia,serif;font-style:italic;font-size:22px;color:#864b51;border-left:3px solid #b8004b;padding-left:18px;margin:32px 0;">${children}</blockquote>`,
  },
  marks: {
    link: ({ value, children }) =>
      `<a href="${value?.href ?? "#"}" style="color:#b8004b;text-decoration:underline;text-underline-offset:3px;">${children}</a>`,
    strong: ({ children }) =>
      `<strong style="color:#864b51;">${children}</strong>`,
  },
  list: {
    bullet: ({ children }) =>
      `<ul style="font-size:16px;line-height:1.7;color:#1e0c10;margin:0 0 20px;padding-left:22px;">${children}</ul>`,
    number: ({ children }) =>
      `<ol style="font-size:16px;line-height:1.7;color:#1e0c10;margin:0 0 20px;padding-left:22px;">${children}</ol>`,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return "";
      const url = urlForImage(value).width(1200).url();
      return `<figure style="margin:28px 0;"><img src="${url}" alt="${value.alt ?? ""}" style="width:100%;border-radius:16px;display:block;" /></figure>`;
    },
  },
};

export function renderNewsletterBody(body: PortableTextBlock[] | null | undefined) {
  if (!body || body.length === 0) return "";
  return toHTML(body, { components });
}

export function buildNewsletterEmail({
  heading,
  preheader,
  bodyHtml,
  unsubscribeUrl,
}: {
  heading: string;
  preheader?: string | null;
  bodyHtml: string;
  unsubscribeUrl: string;
}) {
  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escape(heading)}</title>
  </head>
  <body style="margin:0;background:#fdf9f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1e0c10;">
    ${preheader ? `<div style="display:none;font-size:1px;color:#fdf9f6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escape(preheader)}</div>` : ""}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf9f6;padding:48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:40px 40px 16px;">
                <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#b8004b;margin:0 0 12px;font-weight:700;">Le Combat d'Alya · Newsletter</p>
                <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.15;color:#864b51;margin:0;font-style:italic;">${escape(heading)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px 40px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;background:#f7efe9;border-top:1px solid rgba(134,75,81,0.15);">
                <p style="font-size:12px;color:#7a6a6c;margin:0 0 8px;line-height:1.6;">
                  Vous recevez cet email car vous êtes inscrit·e à la newsletter du Combat d'Alya.
                </p>
                <p style="font-size:12px;color:#7a6a6c;margin:0;line-height:1.6;">
                  <a href="${unsubscribeUrl}" style="color:#b8004b;text-decoration:underline;">Se désinscrire</a>
                  · <a href="https://lecombatdalya.org" style="color:#b8004b;text-decoration:underline;">Visiter le site</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
