import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Bg, TitleCard, BrowserFrame, StudioShell, Field, TypingField, Cursor, StepChip } from "../kit";
import { theme } from "../theme";

export const IMAGES_VIDEOS_DURATION = 540;

const ImageBox: React.FC<{ uploadAt: number }> = ({ uploadAt }) => {
  const f = useCurrentFrame();
  const up = f >= uploadAt;
  return (
    <div
      style={{
        height: 180,
        border: `2px ${up ? "solid" : "dashed"} ${up ? theme.pink : theme.line}`,
        borderRadius: 14,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: up ? undefined : "#fdfafb",
        color: theme.muted,
        fontSize: 19,
      }}
    >
      {up ? (
        <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#f7b3c8,#c20a52)" }} />
      ) : (
        "⬆︎  Importer une image"
      )}
    </div>
  );
};

const SourceTabs: React.FC<{ active: string }> = ({ active }) => (
  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
    {[
      ["url", "Lien externe (YouTube, Vimeo…)"],
      ["file", "Fichier importé"],
    ].map(([k, l]) => {
      const on = active === k;
      return (
        <div
          key={k}
          style={{
            padding: "11px 18px",
            borderRadius: 99,
            fontSize: 16,
            border: `2px solid ${on ? theme.pink : theme.line}`,
            color: on ? theme.pink : theme.muted,
            background: on ? theme.softPink : "#fff",
            fontWeight: on ? 700 : 500,
          }}
        >
          {l}
        </div>
      );
    })}
  </div>
);

export const ImagesVideos: React.FC = () => (
  <Bg>
    <Sequence durationInFrames={80}>
      <TitleCard
        step="Tutoriel 2"
        eyebrow="Images & vidéos"
        title={
          <>
            Ajouter une image
            <br />
            ou une <span style={{ fontStyle: "italic" }}>vidéo</span>
          </>
        }
      />
    </Sequence>

    {/* Image */}
    <Sequence from={80} durationInFrames={220}>
      <AbsoluteFill style={{ paddingTop: 56 }}>
        <BrowserFrame url="votre-site.fr/studio">
          <StudioShell active="Accueil" title="Image de couverture">
            <ImageBox uploadAt={70} />
            <div style={{ height: 18 }} />
            <TypingField label="Texte alternatif (description de l'image)" value="Alya souriante au centre Aléas" start={120} dur={60} highlight />
          </StudioShell>
          <Cursor from={[820, 480]} to={[690, 180]} moveStart={10} moveDur={32} clickAt={48} />
        </BrowserFrame>
        <Sequence durationInFrames={110}>
          <StepChip n={1} total={3} text="Cliquez sur le champ Image puis « Importer »" />
        </Sequence>
        <Sequence from={110} durationInFrames={110}>
          <StepChip n={2} total={3} text="Ajoutez un texte alternatif (important pour l'accessibilité et le SEO)" />
        </Sequence>
      </AbsoluteFill>
    </Sequence>

    {/* Video */}
    <Sequence from={300} durationInFrames={170}>
      <AbsoluteFill style={{ paddingTop: 56 }}>
        <BrowserFrame url="votre-site.fr/studio">
          <StudioShell active="Accueil" title="Vidéo">
            <div style={{ fontSize: 15, color: theme.muted, marginBottom: 8, fontWeight: 600 }}>Source de la vidéo</div>
            <SourceTabs active="url" />
            <TypingField label="Lien de la vidéo" value="https://youtu.be/xxxxxxxx" start={45} dur={55} highlight />
          </StudioShell>
        </BrowserFrame>
        <Sequence durationInFrames={95}>
          <StepChip n={3} total={3} text="Pour une vidéo : choisissez la source (lien ou fichier)" />
        </Sequence>
        <Sequence from={95} durationInFrames={75}>
          <StepChip text="Collez un lien YouTube / Vimeo, ou importez un fichier" />
        </Sequence>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={470} durationInFrames={70}>
      <TitleCard
        title={
          <>
            Médias <span style={{ fontStyle: "italic" }}>ajoutés</span> ✓
          </>
        }
        subtitle="Pensez toujours au texte alternatif pour chaque image."
      />
    </Sequence>
  </Bg>
);
