import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Bg, TitleCard, BrowserFrame, StudioShell, Field, StepChip, Cursor } from "../kit";

export const BIENVENUE_DURATION = 320;

export const Bienvenue: React.FC = () => (
  <Bg>
    {/* Intro */}
    <Sequence durationInFrames={100}>
      <TitleCard
        eyebrow="Le Combat d'Alya · Guide"
        title={
          <>
            Gérer votre site,
            <br />
            en toute <span style={{ fontStyle: "italic" }}>simplicité</span>
          </>
        }
        subtitle="Tout le contenu se modifie dans Sanity, sans jamais toucher au code."
      />
    </Sequence>

    {/* Studio overview */}
    <Sequence from={100} durationInFrames={150}>
      <AbsoluteFill style={{ paddingTop: 56 }}>
        <BrowserFrame url="votre-site.fr/studio">
          <StudioShell active="Accueil" title="Accueil">
            <Field label="Titre" value="Ensemble pour Alya" />
            <Field label="Introduction" value="Une association dédiée au combat d'Alya." area />
          </StudioShell>
          <Cursor from={[760, 470]} to={[150, 120]} moveStart={20} moveDur={28} clickAt={50} />
        </BrowserFrame>
        <StepChip text="Ouvrez l'éditeur sur votre-site.fr/studio" delay={14} />
      </AbsoluteFill>
    </Sequence>

    {/* Outro */}
    <Sequence from={250} durationInFrames={70}>
      <TitleCard
        title={
          <>
            Suivez les <span style={{ fontStyle: "italic" }}>tutoriels</span>
          </>
        }
        subtitle="Modifier un texte · Images & vidéos · Publier · Articles · Contact"
      />
    </Sequence>
  </Bg>
);
