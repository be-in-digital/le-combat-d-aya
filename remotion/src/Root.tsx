import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme";
import { Bienvenue, BIENVENUE_DURATION } from "./compositions/Bienvenue";
import { ModifierTexte, MODIFIER_TEXTE_DURATION } from "./compositions/ModifierTexte";
import { ImagesVideos, IMAGES_VIDEOS_DURATION } from "./compositions/ImagesVideos";
import { PublierPreview, PUBLIER_PREVIEW_DURATION } from "./compositions/PublierPreview";
import { AjouterArticle, AJOUTER_ARTICLE_DURATION } from "./compositions/AjouterArticle";
import { Contact, CONTACT_DURATION } from "./compositions/Contact";

const common = { fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="bienvenue" component={Bienvenue} durationInFrames={BIENVENUE_DURATION} {...common} />
    <Composition id="modifier-texte" component={ModifierTexte} durationInFrames={MODIFIER_TEXTE_DURATION} {...common} />
    <Composition id="images-videos" component={ImagesVideos} durationInFrames={IMAGES_VIDEOS_DURATION} {...common} />
    <Composition id="publier-preview" component={PublierPreview} durationInFrames={PUBLIER_PREVIEW_DURATION} {...common} />
    <Composition id="ajouter-article" component={AjouterArticle} durationInFrames={AJOUTER_ARTICLE_DURATION} {...common} />
    <Composition id="contact" component={Contact} durationInFrames={CONTACT_DURATION} {...common} />
  </>
);
