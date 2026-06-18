import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Bg, TitleCard, Pop } from "../kit";
import { theme } from "../theme";

export const CONTACT_DURATION = 300;

const Row: React.FC<{ icon: string; label: string; value: string; delay: number }> = ({ icon, label, value, delay }) => (
  <Pop delay={delay} y={18}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 0", borderBottom: `1px solid ${theme.line}` }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          background: theme.softPink,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 15, letterSpacing: 2, textTransform: "uppercase", color: theme.muted, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 26, color: theme.ink, fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  </Pop>
);

export const Contact: React.FC = () => (
  <Bg>
    <Sequence durationInFrames={75}>
      <TitleCard
        eyebrow="Besoin d'aide ?"
        title={
          <>
            Une question ? <br />
            Contactez <span style={{ fontStyle: "italic" }}>Be In Digital</span>
          </>
        }
      />
    </Sequence>

    <Sequence from={75} durationInFrames={155}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 80 }}>
        <Pop>
          <div
            style={{
              width: 820,
              background: "#fff",
              borderRadius: 28,
              padding: "44px 52px",
              boxShadow: "0 40px 90px -30px rgba(120,10,55,0.4)",
              border: `1px solid ${theme.line}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
              <span style={{ fontSize: 22 }}>♥</span>
              <span style={{ fontFamily: theme.sans, fontWeight: 800, letterSpacing: 3, color: theme.pink }}>BE IN DIGITAL</span>
            </div>
            <div style={{ fontFamily: theme.serif, fontSize: 34, color: theme.ink, marginBottom: 8 }}>
              Nous avons conçu votre site — et nous restons à vos côtés.
            </div>
            <Row icon="🌐" label="Site web" value="beindigital.fr" delay={14} />
            <Row icon="💬" label="Accompagnement" value="Votre interlocuteur dédié vous répond" delay={22} />
          </div>
        </Pop>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={230} durationInFrames={70}>
      <TitleCard
        title={
          <>
            À votre <span style={{ fontStyle: "italic" }}>écoute</span> ✓
          </>
        }
        subtitle="Décrivez votre besoin, on s'occupe du reste."
      />
    </Sequence>
  </Bg>
);
