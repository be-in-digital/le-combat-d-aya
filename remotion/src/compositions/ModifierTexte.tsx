import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import {
  Bg,
  TitleCard,
  BrowserFrame,
  StudioShell,
  Field,
  TypingField,
  TimedPublish,
  Cursor,
  StepChip,
} from "../kit";

export const MODIFIER_TEXTE_DURATION = 520;

export const ModifierTexte: React.FC = () => (
  <Bg>
    <Sequence durationInFrames={80}>
      <TitleCard
        step="Tutoriel 1"
        eyebrow="Modifier un texte"
        title={
          <>
            Changer un texte
            <br />
            en <span style={{ fontStyle: "italic" }}>4 étapes</span>
          </>
        }
      />
    </Sequence>

    <Sequence from={80} durationInFrames={370}>
      <AbsoluteFill style={{ paddingTop: 56 }}>
        <BrowserFrame url="votre-site.fr/studio">
          <StudioShell active="Accueil" title="Accueil">
            <TypingField label="Titre" value="Ensemble pour Alya" start={175} dur={70} highlight />
            <Field label="Introduction" value="Une association dédiée au combat d'Alya." area />
            <TimedPublish publishAt={300} doneAt={328} />
          </StudioShell>
          <Sequence durationInFrames={90}>
            <Cursor from={[820, 470]} to={[150, 120]} moveStart={10} moveDur={32} clickAt={48} />
          </Sequence>
          <Sequence from={90} durationInFrames={90}>
            <Cursor from={[150, 120]} to={[690, 205]} moveStart={5} moveDur={32} clickAt={42} />
          </Sequence>
          <Sequence from={285} durationInFrames={85}>
            <Cursor from={[690, 205]} to={[955, 55]} moveStart={5} moveDur={30} clickAt={40} />
          </Sequence>
        </BrowserFrame>
        <Sequence durationInFrames={90}>
          <StepChip n={1} total={4} text="Cliquez sur la page à modifier (ex. Accueil)" />
        </Sequence>
        <Sequence from={90} durationInFrames={95}>
          <StepChip n={2} total={4} text="Cliquez dans le champ à modifier" />
        </Sequence>
        <Sequence from={185} durationInFrames={100}>
          <StepChip n={3} total={4} text="Saisissez votre nouveau texte" />
        </Sequence>
        <Sequence from={285} durationInFrames={85}>
          <StepChip n={4} total={4} text="Cliquez sur « Publier » pour mettre en ligne" />
        </Sequence>
      </AbsoluteFill>
    </Sequence>

    <Sequence from={450} durationInFrames={70}>
      <TitleCard
        title={
          <>
            Votre texte est <span style={{ fontStyle: "italic" }}>en ligne</span> ✓
          </>
        }
        subtitle="Le site se met à jour automatiquement après publication."
      />
    </Sequence>
  </Bg>
);
