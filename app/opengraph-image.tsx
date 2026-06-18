import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(circle at 80% 20%, #f0c4cf 0%, transparent 55%), radial-gradient(circle at 15% 85%, #f9d5da 0%, transparent 50%), #fdf9f6",
          fontFamily: "Georgia, 'Times New Roman', serif",
          color: "#1e0c10",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "#b8004b",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 700,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "999px",
              background: "#b8004b",
            }}
          />
          Le Combat d&apos;Alya
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            maxWidth: 880,
          }}
        >
          <div
            style={{
              fontSize: 108,
              lineHeight: 1.02,
              color: "#864b51",
              letterSpacing: "-0.02em",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <span style={{ fontStyle: "italic" }}>Ensemble</span>
            <span style={{ fontWeight: 300 }}>pour</span>
            <span style={{ fontStyle: "italic", color: "#b8004b" }}>
              Alya.
            </span>
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#7a6a6c",
              lineHeight: 1.5,
              fontStyle: "italic",
              maxWidth: 760,
            }}
          >
            Une association dédiée au soutien d&apos;Alya et des familles
            touchées par la maladie.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#7a6a6c",
            fontFamily: "system-ui, sans-serif",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          <span>lecombatdalya.org</span>
          <span style={{ color: "#b8004b", fontWeight: 700 }}>
            Faire un don
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
