import React from "react";
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
import { StoreTemplateView } from "./StoreTemplates";

export function ProfileTemplateRenderer({ 
  profile,
  activeStudioPage,
  onPageChange,
  isOwnerPreview = false,
  selectedSectionId,
  onSelectSection
}: { 
  profile: UserProfile;
  activeStudioPage?: string;
  onPageChange?: (page: string) => void;
  isOwnerPreview?: boolean;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
}) {
  // 🛍️ Store Portfolio Templates
  if (profile.templateId?.startsWith("store")) {
    const commonProps = {
      profile,
      activeStudioPage,
      onPageChange,
      isOwnerPreview,
      selectedSectionId,
      onSelectSection
    };
    switch (profile.templateId) {
      case "store-minimal-boutique":
      case "store_minimal":
        return <StoreTemplateView {...commonProps} variant="minimal" />;
      case "store-cyber-tech":
      case "store_cyber":
        return <StoreTemplateView {...commonProps} variant="cyber" />;
      case "store-luxury-brand":
      case "store_luxury":
        return <StoreTemplateView {...commonProps} variant="luxury" />;
      case "store-organic-nature":
      case "store_organic":
        return <StoreTemplateView {...commonProps} variant="organic" />;
      case "store-streetwear-bold":
      case "store_streetwear":
        return <StoreTemplateView {...commonProps} variant="streetwear" />;
      case "store-instant-catalog":
      case "store_catalog":
        return <StoreTemplateView {...commonProps} variant="catalog" />;
      default:
        return <StoreTemplateView {...commonProps} variant="minimal" />;
    }
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
