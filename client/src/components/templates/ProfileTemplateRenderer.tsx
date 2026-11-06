import React, { useEffect, useState } from "react";
import { UserProfile } from "@shared/saas-schema";
import { ModernMinimalist } from "./ModernMinimalist";
import { DeveloperProfile } from "./DeveloperProfile";
import { ProfessionalProfile } from "./ProfessionalProfile";
import { LuxuryBlackGold } from "./LuxuryBlackGold";
import { CreativeDesigner } from "./CreativeDesigner";
import { NeonDeveloper } from "./NeonDeveloper";
import { ElegantProfessional } from "./ElegantProfessional";
import { ModernGradient } from "./ModernGradient";
import { HologramCard } from "./HologramCard";
import { RetroArcade } from "./RetroArcade";
import { AudioEqualizer } from "./AudioEqualizer";
import { CinematicDirector } from "./CinematicDirector";
import { EXTENDED_TEMPLATES_CONFIG, ExtendedTemplateView } from "./ExtendedTemplate";
import {
  BaryonAnimeLive,
  CustomWallpaperHero,
  ReactBitsSpotlight,
  ReactBitsAuroraMesh,
  CyberpunkHologramHUD,
} from "./DiamondTemplates";
import { CustomTemplateRenderer } from "./CustomTemplateRenderer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export function ProfileTemplateRenderer({ profile }: { profile: UserProfile }) {
  // 🎨 Custom ChatGPT templates — IDs start with "chatgpt-"
  if (profile.templateId?.startsWith("chatgpt-")) {
    return <CustomTemplateLoader profile={profile} templateId={profile.templateId} />;
  }

  // 💎 5 Diamond tier templates — bespoke innovative renderers
  switch (profile.templateId) {
    case "baryon-anime-live":
      return <BaryonAnimeLive profile={profile} />;
    case "custom-wallpaper-hero":
      return <CustomWallpaperHero profile={profile} />;
    case "reactbits-spotlight":
      return <ReactBitsSpotlight profile={profile} />;
    case "reactbits-aurora-mesh":
      return <ReactBitsAuroraMesh profile={profile} />;
    case "cyberpunk-hologram-hud":
      return <CyberpunkHologramHUD profile={profile} />;
  }
  // Check if it's one of the 18 extended templates
  if (EXTENDED_TEMPLATES_CONFIG[profile.templateId]) {
    return <ExtendedTemplateView profile={profile} config={EXTENDED_TEMPLATES_CONFIG[profile.templateId]} />;
  }

  switch (profile.templateId) {
    case "developer-profile":
      return <DeveloperProfile profile={profile} />;
    case "professional-profile":
      return <ProfessionalProfile profile={profile} />;
    case "luxury-black-gold":
      return <LuxuryBlackGold profile={profile} />;
    case "creative-designer":
      return <CreativeDesigner profile={profile} />;
    case "neon-developer":
      return <NeonDeveloper profile={profile} />;
    case "elegant-professional":
      return <ElegantProfessional profile={profile} />;
    case "modern-gradient":
      return <ModernGradient profile={profile} />;
    case "hologram-card":
      return <HologramCard profile={profile} />;
    case "retro-arcade":
      return <RetroArcade profile={profile} />;
    case "audio-equalizer":
      return <AudioEqualizer profile={profile} />;
    case "cinematic-director":
      return <CinematicDirector profile={profile} />;
    case "modern-minimalist":
    default:
      return <ModernMinimalist profile={profile} />;
  }
}

/** Loads a custom ChatGPT template from Firestore then renders it */
function CustomTemplateLoader({ profile, templateId }: { profile: UserProfile; templateId: string }) {
  const [htmlCode, setHtmlCode] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "customTemplates", templateId));
        if (snap.exists()) {
          setHtmlCode(snap.data().htmlCode || "");
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    };
    load();
  }, [templateId]);

  if (error) return <ModernMinimalist profile={profile} />;
  if (!htmlCode) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
    </div>
  );

  return <CustomTemplateRenderer profile={profile} htmlCode={htmlCode} />;
}
