import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Bg, TitleCard, BrowserFrame, StudioShell, Field, TypingField, TimedPublish, Cursor, StepChip, Pop } from "../kit";
import { theme } from "../theme";

export const PUBLIER_PREVIEW_DURATION = 540;

const Pill: React.FC<{ text: string; color?: string; bg?: string; right: number }> = ({ text, color, bg, right }) => (
  <div
    style={{
      position: "absolute",
      top: 30,
      right,
      padding: "9px 16px",
      borderRadius: 99,
      fontSize: 15,
      fontWeight: 700,
      color: color ?? theme.muted,
      background: bg ?? "#fff",
      border: `1.5px solid ${theme.line}`,
    }}
  >
    {text}
  </div>
);

export const PublierPreview: React.FC = () => (
  <Bg>
    <Sequence durationInFrames={80}>
      <TitleCard
        step="Tutoriel 3"
        eyebrow="Publier & prévisualiser"
        title={
          <>
            Brouillon, aperçu,
            <br />
            <span style={{ fontStyle: "italic" }}>publication</span>
          </>
        }
      />
    </Sequence>

    <Sequence from={80} durationInFrames={390}>
      <AbsoluteFill style={{ paddingTop: 56 }}>
        <BrowserFrame url="votre-site.fr/studio">
          <StudioShell active="Accueil" title="Accueil">
            <TypingField label="Titre" value="Ensemble pour Alya, ensemble plus forts" start={30} dur={60} highlight />
            <Field label="Introduction" value="Une association dédiée au combat d'Alya." area />
            <Pill text="● Brouillon" color={theme.pink} bg={theme.softPink} right={360} />
            <Pill text="Aperçu" right={180} />
            <TimedPublish publishAt={300} doneAt={330} />
          </StudioShell>
          <Sequence from={120} durationInFrames={90}>
            <Cursor from={[690, 200]} to={[880, 52]} moveStart={5} moveDur={30} clickAt={40} />
          </Sequence>
          <Sequence from={285} durationInFrames={95}>
            <Cursor from={[880, 52]} to={[992, 52]} moveStart={5} moveDur={28} clickAt={38} />
          </Sequence>
        </BrowserFrame>
        <Sequence durationInFrames={120}>
          <StepChip n={1} total={3} text="Vos changements restent en « Brouillon » tant que vous ne publiez pas" />
        </Sequence>
        <Sequence from={120} durationInFrames={130}>
          <StepChip n={2} total={3} text="Cliquez sur « Aperçu » pour voir le rendu réel avant publication" />
        </Sequence>
        <Sequence from={250} durationInFrames={140}>
          <StepChip n={3} total={3} text="Tout est bon ? Cliquez sur « Publier » — le site se met à jour" />
        </Sequence>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={470} durationInFrames={70}>
      <TitleCard
        title={
          <>
            En ligne pour <span style={{ fontStyle: "italic" }}>tous</span> ✓
          </>
        }
        subtitle="Astuce : rien n'est visible publiquement avant de cliquer sur Publier."
      />
    </Sequence>
  </Bg>
);
