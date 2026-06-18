import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { Bg, TitleCard, BrowserFrame, StudioShell, TypingField, TimedPublish, Cursor, StepChip } from "../kit";
import { theme } from "../theme";

export const AJOUTER_ARTICLE_DURATION = 560;

const Cover: React.FC<{ showAt: number }> = ({ showAt }) => {
  const up = useCurrentFrame() >= showAt;
  return (
    <div
      style={{
        height: 110,
        borderRadius: 12,
        border: `2px ${up ? "solid" : "dashed"} ${up ? theme.pink : theme.line}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.muted,
        fontSize: 16,
        background: up ? undefined : "#fdfafb",
      }}
    >
      {up ? <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#f7b3c8,#c20a52)" }} /> : "⬆︎  Image de couverture"}
    </div>
  );
};

const Toggle: React.FC<{ onAt: number; label: string }> = ({ onAt, label }) => {
  const on = useCurrentFrame() >= onAt;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
      <div style={{ width: 52, height: 30, borderRadius: 99, background: on ? theme.pink : theme.line, position: "relative" }}>
        <div style={{ position: "absolute", top: 3, left: on ? 25 : 3, width: 24, height: 24, borderRadius: 99, background: "#fff" }} />
      </div>
      <span style={{ fontSize: 18, color: theme.ink, fontWeight: 600 }}>{label}</span>
    </div>
  );
};

export const AjouterArticle: React.FC = () => (
  <Bg>
    <Sequence durationInFrames={80}>
      <TitleCard
        step="Tutoriel 4"
        eyebrow="Actualités"
        title={
          <>
            Ajouter un <span style={{ fontStyle: "italic" }}>article</span>
          </>
        }
      />
    </Sequence>

    <Sequence from={80} durationInFrames={410}>
      <AbsoluteFill style={{ paddingTop: 56 }}>
        <BrowserFrame url="votre-site.fr/studio">
          <StudioShell active="Articles" title="Nouvel article">
            <TypingField label="Titre" value="Trois familles partent en rééducation" start={95} dur={55} highlight />
            <TypingField label="Chapeau" value="Grâce au centre Aléas (Blanes), trois enfants accèdent aux soins." start={155} dur={70} area />
            <div style={{ fontSize: 15, color: theme.muted, margin: "4px 0 8px", fontWeight: 600 }}>Image de couverture</div>
            <Cover showAt={240} />
            <Toggle onAt={300} label="À la une" />
            <TimedPublish publishAt={345} doneAt={372} />
          </StudioShell>
          <Sequence durationInFrames={90}>
            <Cursor from={[820, 480]} to={[150, 285]} moveStart={10} moveDur={32} clickAt={48} />
          </Sequence>
          <Sequence from={90} durationInFrames={90}>
            <Cursor from={[150, 285]} to={[690, 190]} moveStart={5} moveDur={30} clickAt={40} />
          </Sequence>
          <Sequence from={330} durationInFrames={80}>
            <Cursor from={[690, 300]} to={[992, 52]} moveStart={5} moveDur={28} clickAt={40} />
          </Sequence>
        </BrowserFrame>
        <Sequence durationInFrames={90}>
          <StepChip n={1} total={4} text="Ouvrez « Articles » puis cliquez sur le bouton +" />
        </Sequence>
        <Sequence from={90} durationInFrames={145}>
          <StepChip n={2} total={4} text="Renseignez le titre et le chapeau" />
        </Sequence>
        <Sequence from={235} durationInFrames={95}>
          <StepChip n={3} total={4} text="Ajoutez une image de couverture" />
        </Sequence>
        <Sequence from={330} durationInFrames={80}>
          <StepChip n={4} total={4} text="Cochez « À la une » si besoin, puis Publiez" />
        </Sequence>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={490} durationInFrames={70}>
      <TitleCard
        title={
          <>
            Publié sur <span style={{ fontStyle: "italic" }}>/actualités</span> ✓
          </>
        }
        subtitle="L'article le plus récent apparaît en premier ; « À la une » le met en avant."
      />
    </Sequence>
  </Bg>
);
