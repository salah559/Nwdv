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

export function ProfileTemplateRenderer({ profile }: { profile: UserProfile }) {
  const customTheme = profile.customTheme;
  const primaryColor = customTheme?.primaryColor;
  const fontFamily = customTheme?.fontFamily;
  const bgStyle = customTheme?.backgroundStyle;
  const buttonStyle = customTheme?.buttonStyle;

  const renderTemplateContent = () => {
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

    // Check if it's one of the extended templates
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
  };

  return (
    <div
      className="profile-custom-theme-root w-full min-h-full relative overflow-x-hidden"
      style={{
        ...(primaryColor && {
          "--theme-primary": primaryColor,
          "--primary": primaryColor,
        } as React.CSSProperties),
        ...(fontFamily && { fontFamily: `${fontFamily}, sans-serif` }),
      }}
    >
      {/* Dynamic Button Shape Styles */}
      {buttonStyle && (
        <style>{`
          .profile-custom-theme-root a,
          .profile-custom-theme-root button {
            border-radius: ${
              buttonStyle === "pill"
                ? "9999px !important"
                : buttonStyle === "sharp"
                ? "4px !important"
                : buttonStyle === "glass"
                ? "18px !important; backdrop-filter: blur(16px) !important; background-color: rgba(255,255,255,0.06) !important; border: 1px solid rgba(255,255,255,0.15) !important;"
                : "16px !important"
            };
          }
        `}</style>
      )}

      {/* Dynamic Background Atmosphere */}
      {bgStyle === "mesh" && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-25 animate-pulse"
            style={{ backgroundColor: primaryColor || "#06b6d4" }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-25"
            style={{ backgroundColor: primaryColor || "#a855f7" }}
          />
        </div>
      )}

      {bgStyle === "grid" && (
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />
      )}

      {bgStyle === "particles" && (
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black" />
      )}

      {renderTemplateContent()}
    </div>
  );
}
