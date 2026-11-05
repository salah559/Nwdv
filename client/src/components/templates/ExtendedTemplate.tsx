import React, { useState } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Copy, Check, Sparkles } from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export interface ExtendedTemplateConfig {
  id: string;
  name: string;
  category: "creative" | "developer" | "business" | "luxury" | "minimal";
  theme: {
    bg: string;
    bgStyle?: "grid" | "dots" | "gradient" | "radial" | "noise" | "lines" | "matrix" | "stars";
    cardBg: string;
    cardBorder: string;
    cardHoverBorder: string;
    cardHoverShadow: string;
    primaryColor: string;
    accentColor: string;
    textColor: string;
    mutedColor: string;
    badgeBg: string;
    badgeText: string;
    fontStyle?: "sans" | "mono" | "serif" | "display";
    avatarShape?: "circle" | "rounded" | "squircle" | "hexagon";
    avatarRing?: string;
    avatarGlow?: string;
    tagline?: string;
    vibeTag?: string;
  };
}

export const EXTENDED_TEMPLATES_CONFIG: Record<string, ExtendedTemplateConfig> = {
  // 1. Cyberpunk 2077 Night City
  "cyberpunk-runner": {
    id: "cyberpunk-runner",
    name: "Cyberpunk 2077 Runner",
    category: "developer",
    theme: {
      bg: "bg-[#05050a]",
      bgStyle: "grid",
      cardBg: "bg-[#0d0e1a]/80 backdrop-blur-xl",
      cardBorder: "border-[#fcee0a]/30",
      cardHoverBorder: "hover:border-[#00f0ff]",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]",
      primaryColor: "#fcee0a",
      accentColor: "#00f0ff",
      textColor: "text-[#fcee0a]",
      mutedColor: "text-gray-400",
      badgeBg: "bg-[#fcee0a]/20 border border-[#fcee0a]/50",
      badgeText: "text-[#fcee0a]",
      fontStyle: "mono",
      avatarShape: "hexagon",
      avatarRing: "border-2 border-[#00f0ff]",
      avatarGlow: "shadow-[0_0_30px_rgba(0,240,255,0.6)]",
      tagline: "NETRUNNER // EDGERUNNER",
      vibeTag: "CYBER CITY",
    },
  },

  // 2. Midnight Sakura Tokyo
  "midnight-sakura": {
    id: "midnight-sakura",
    name: "Midnight Sakura Tokyo",
    category: "creative",
    theme: {
      bg: "bg-gradient-to-b from-[#0b0410] via-[#150720] to-[#0b0410]",
      bgStyle: "stars",
      cardBg: "bg-white/[0.04] backdrop-blur-2xl",
      cardBorder: "border-pink-500/20",
      cardHoverBorder: "hover:border-pink-400",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(244,114,182,0.35)]",
      primaryColor: "#f472b6",
      accentColor: "#c084fc",
      textColor: "text-pink-100",
      mutedColor: "text-pink-300/70",
      badgeBg: "bg-pink-500/20 border border-pink-400/30",
      badgeText: "text-pink-300",
      fontStyle: "sans",
      avatarShape: "circle",
      avatarRing: "border-2 border-pink-400/80",
      avatarGlow: "shadow-[0_0_35px_rgba(236,72,153,0.5)]",
      tagline: "TOKYO NIGHTS // SAKURA BLOSSOM",
      vibeTag: "JAPAN AESTHETIC",
    },
  },

  // 3. Matrix Terminal Green
  "matrix-terminal": {
    id: "matrix-terminal",
    name: "Matrix Source Code",
    category: "developer",
    theme: {
      bg: "bg-[#020904]",
      bgStyle: "matrix",
      cardBg: "bg-[#031508]/90 backdrop-blur-xl",
      cardBorder: "border-emerald-500/30",
      cardHoverBorder: "hover:border-emerald-400",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]",
      primaryColor: "#10b981",
      accentColor: "#34d399",
      textColor: "text-emerald-300",
      mutedColor: "text-emerald-600/80",
      badgeBg: "bg-emerald-950/80 border border-emerald-500/40",
      badgeText: "text-emerald-400",
      fontStyle: "mono",
      avatarShape: "rounded",
      avatarRing: "border-2 border-emerald-500",
      avatarGlow: "shadow-[0_0_25px_rgba(16,185,129,0.7)]",
      tagline: "WAKE UP, NEO // FOLLOW THE WHITE RABBIT",
      vibeTag: "SYS_ADMIN",
    },
  },

  // 4. Emerald Billionaire Royalty
  "emerald-royalty": {
    id: "emerald-royalty",
    name: "Emerald Royalty VIP",
    category: "luxury",
    theme: {
      bg: "bg-[#01140e]",
      bgStyle: "radial",
      cardBg: "bg-gradient-to-r from-[#032319]/90 to-[#053123]/90 backdrop-blur-2xl",
      cardBorder: "border-emerald-400/30",
      cardHoverBorder: "hover:border-emerald-300",
      cardHoverShadow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.4)]",
      primaryColor: "#10b981",
      accentColor: "#fbbf24",
      textColor: "text-emerald-50",
      mutedColor: "text-emerald-300/60",
      badgeBg: "bg-amber-400/20 border border-amber-400/50",
      badgeText: "text-amber-300",
      fontStyle: "serif",
      avatarShape: "circle",
      avatarRing: "border-2 border-amber-400/90",
      avatarGlow: "shadow-[0_0_30px_rgba(251,191,36,0.5)]",
      tagline: "PRIVATE WEALTH // SOVEREIGN CLUB",
      vibeTag: "ULTRA LUXURY",
    },
  },

  // 5. Sunset Boulevard Beverly Hills
  "sunset-boulevard": {
    id: "sunset-boulevard",
    name: "Sunset Boulevard Glow",
    category: "creative",
    theme: {
      bg: "bg-gradient-to-b from-[#180828] via-[#2d0e30] to-[#12041e]",
      bgStyle: "gradient",
      cardBg: "bg-white/[0.05] backdrop-blur-2xl",
      cardBorder: "border-orange-500/20",
      cardHoverBorder: "hover:border-amber-400",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]",
      primaryColor: "#f97316",
      accentColor: "#fbbf24",
      textColor: "text-orange-50",
      mutedColor: "text-orange-200/60",
      badgeBg: "bg-orange-500/20 border border-orange-400/40",
      badgeText: "text-orange-300",
      fontStyle: "sans",
      avatarShape: "squircle",
      avatarRing: "border-2 border-gradient-to-r from-orange-400 to-amber-300",
      avatarGlow: "shadow-[0_0_35px_rgba(249,115,22,0.5)]",
      tagline: "GOLDEN HOUR // PACIFIC HIGHWAY",
      vibeTag: "CALIFORNIA VIBES",
    },
  },

  // 6. Deep Space Orbit & Galaxy
  "deep-space-orbit": {
    id: "deep-space-orbit",
    name: "Deep Space Orbit",
    category: "developer",
    theme: {
      bg: "bg-[#030611]",
      bgStyle: "stars",
      cardBg: "bg-[#080f24]/70 backdrop-blur-2xl",
      cardBorder: "border-blue-500/20",
      cardHoverBorder: "hover:border-cyan-400",
      cardHoverShadow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.45)]",
      primaryColor: "#38bdf8",
      accentColor: "#818cf8",
      textColor: "text-sky-100",
      mutedColor: "text-sky-300/60",
      badgeBg: "bg-sky-500/10 border border-sky-400/30",
      badgeText: "text-sky-300",
      fontStyle: "mono",
      avatarShape: "circle",
      avatarRing: "border-2 border-sky-400/80",
      avatarGlow: "shadow-[0_0_35px_rgba(56,189,248,0.5)]",
      tagline: "ORBITAL VELOCITY // APOLLO 25",
      vibeTag: "COSMOS",
    },
  },

  // 7. Nordic Frost & Snow
  "nordic-frost": {
    id: "nordic-frost",
    name: "Nordic Minimalist Frost",
    category: "minimal",
    theme: {
      bg: "bg-[#0a0f16]",
      bgStyle: "dots",
      cardBg: "bg-white/[0.03] backdrop-blur-3xl",
      cardBorder: "border-slate-700/40",
      cardHoverBorder: "hover:border-sky-300/80",
      cardHoverShadow: "hover:shadow-[0_0_20px_rgba(224,242,254,0.2)]",
      primaryColor: "#e0f2fe",
      accentColor: "#94a3b8",
      textColor: "text-slate-100",
      mutedColor: "text-slate-400",
      badgeBg: "bg-slate-800/80 border border-slate-700",
      badgeText: "text-slate-300",
      fontStyle: "sans",
      avatarShape: "circle",
      avatarRing: "border border-slate-600",
      avatarGlow: "shadow-lg",
      tagline: "COPENHAGEN // PURE FORM",
      vibeTag: "SCANDINAVIAN",
    },
  },

  // 8. Silicon Valley Pitch Deck
  "silicon-pitch": {
    id: "silicon-pitch",
    name: "Silicon Valley Tech Founder",
    category: "business",
    theme: {
      bg: "bg-[#060b14]",
      bgStyle: "grid",
      cardBg: "bg-[#0b1424]/80 backdrop-blur-2xl",
      cardBorder: "border-indigo-500/20",
      cardHoverBorder: "hover:border-indigo-400",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(99,102,241,0.35)]",
      primaryColor: "#6366f1",
      accentColor: "#38bdf8",
      textColor: "text-indigo-50",
      mutedColor: "text-indigo-200/60",
      badgeBg: "bg-indigo-500/20 border border-indigo-400/30",
      badgeText: "text-indigo-300",
      fontStyle: "sans",
      avatarShape: "rounded",
      avatarRing: "border-2 border-indigo-500/80",
      avatarGlow: "shadow-[0_0_30px_rgba(99,102,241,0.4)]",
      tagline: "SERIES A // YC ALUMNI // TECH FOUNDER",
      vibeTag: "VENTURE CAPITAL",
    },
  },

  // 9. Marble Architecture Milan
  "marble-architecture": {
    id: "marble-architecture",
    name: "Milano Marble & Stone",
    category: "luxury",
    theme: {
      bg: "bg-[#09090b]",
      bgStyle: "lines",
      cardBg: "bg-white/[0.04] backdrop-blur-2xl",
      cardBorder: "border-stone-700/50",
      cardHoverBorder: "hover:border-amber-200/80",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(254,243,199,0.2)]",
      primaryColor: "#fef3c7",
      accentColor: "#d6d3d1",
      textColor: "text-stone-100",
      mutedColor: "text-stone-400",
      badgeBg: "bg-stone-900 border border-stone-700",
      badgeText: "text-stone-300",
      fontStyle: "serif",
      avatarShape: "squircle",
      avatarRing: "border-2 border-stone-500",
      avatarGlow: "shadow-[0_0_20px_rgba(254,243,199,0.25)]",
      tagline: "ARCHITECTURAL MASTERY // MILANO 2025",
      vibeTag: "HAUTE DESIGN",
    },
  },

  // 10. Synthwave 1984 Retrowave
  "synthwave-1984": {
    id: "synthwave-1984",
    name: "Synthwave 1984 Miami",
    category: "creative",
    theme: {
      bg: "bg-gradient-to-b from-[#18042b] via-[#240638] to-[#0c0217]",
      bgStyle: "grid",
      cardBg: "bg-[#1f0732]/80 backdrop-blur-xl",
      cardBorder: "border-fuchsia-500/30",
      cardHoverBorder: "hover:border-cyan-400",
      cardHoverShadow: "hover:shadow-[0_0_30px_rgba(232,121,249,0.5)]",
      primaryColor: "#e879f9",
      accentColor: "#22d3ee",
      textColor: "text-fuchsia-100",
      mutedColor: "text-fuchsia-300/70",
      badgeBg: "bg-gradient-to-r from-fuchsia-600/30 to-cyan-600/30 border border-fuchsia-400/40",
      badgeText: "text-fuchsia-300",
      fontStyle: "display",
      avatarShape: "circle",
      avatarRing: "border-2 border-fuchsia-500",
      avatarGlow: "shadow-[0_0_35px_rgba(232,121,249,0.6)]",
      tagline: "OUTRUN // PALM TREES & NEON",
      vibeTag: "RETROWAVE",
    },
  },

  // 11. Monolith Matte Dark
  "monolith-matte": {
    id: "monolith-matte",
    name: "Monolith Pitch Black",
    category: "minimal",
    theme: {
      bg: "bg-[#030303]",
      bgStyle: "dots",
      cardBg: "bg-[#0d0d0d] backdrop-blur-xl",
      cardBorder: "border-neutral-800",
      cardHoverBorder: "hover:border-neutral-500",
      cardHoverShadow: "hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]",
      primaryColor: "#ffffff",
      accentColor: "#a3a3a3",
      textColor: "text-neutral-100",
      mutedColor: "text-neutral-500",
      badgeBg: "bg-neutral-900 border border-neutral-800",
      badgeText: "text-neutral-300",
      fontStyle: "sans",
      avatarShape: "rounded",
      avatarRing: "border border-neutral-700",
      avatarGlow: "shadow-none",
      tagline: "STEALTH // MATTE OBSIDIAN",
      vibeTag: "MINIMALIST",
    },
  },

  // 12. Swiss International Typo
  "swiss-typo": {
    id: "swiss-typo",
    name: "Swiss International Style",
    category: "business",
    theme: {
      bg: "bg-[#0f1115]",
      bgStyle: "lines",
      cardBg: "bg-[#181a20]/90 backdrop-blur-xl",
      cardBorder: "border-red-600/30",
      cardHoverBorder: "hover:border-red-500",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(239,68,68,0.35)]",
      primaryColor: "#ef4444",
      accentColor: "#ffffff",
      textColor: "text-white",
      mutedColor: "text-neutral-400",
      badgeBg: "bg-red-600/20 border border-red-500/40",
      badgeText: "text-red-400",
      fontStyle: "sans",
      avatarShape: "squircle",
      avatarRing: "border-2 border-red-600",
      avatarGlow: "shadow-[0_0_25px_rgba(239,68,68,0.4)]",
      tagline: "HELVETICA // ZURICH DESIGN ARCHIVE",
      vibeTag: "BAUHAUS",
    },
  },

  // 13. Electric Tokyo Violet
  "electric-violet": {
    id: "electric-violet",
    name: "Electric Violet & Purple",
    category: "creative",
    theme: {
      bg: "bg-[#080211]",
      bgStyle: "radial",
      cardBg: "bg-[#140628]/80 backdrop-blur-2xl",
      cardBorder: "border-violet-500/25",
      cardHoverBorder: "hover:border-violet-400",
      cardHoverShadow: "hover:shadow-[0_0_30px_rgba(167,139,250,0.45)]",
      primaryColor: "#a78bfa",
      accentColor: "#c084fc",
      textColor: "text-violet-100",
      mutedColor: "text-violet-300/60",
      badgeBg: "bg-violet-500/20 border border-violet-400/30",
      badgeText: "text-violet-300",
      fontStyle: "sans",
      avatarShape: "circle",
      avatarRing: "border-2 border-violet-500",
      avatarGlow: "shadow-[0_0_35px_rgba(167,139,250,0.6)]",
      tagline: "ULTRAVIOLET BEAM // NIGHTLIFE",
      vibeTag: "NEON PURPLE",
    },
  },

  // 14. Blockchain Web3 Ledger
  "crypto-ledger": {
    id: "crypto-ledger",
    name: "Web3 Crypto & Solana",
    category: "developer",
    theme: {
      bg: "bg-[#080a14]",
      bgStyle: "matrix",
      cardBg: "bg-[#0d1224]/80 backdrop-blur-2xl",
      cardBorder: "border-purple-500/25",
      cardHoverBorder: "hover:border-teal-400",
      cardHoverShadow: "hover:shadow-[0_0_30px_rgba(45,212,191,0.45)]",
      primaryColor: "#2dd4bf",
      accentColor: "#a855f7",
      textColor: "text-teal-100",
      mutedColor: "text-teal-300/60",
      badgeBg: "bg-gradient-to-r from-purple-500/20 to-teal-500/20 border border-teal-400/40",
      badgeText: "text-teal-300",
      fontStyle: "mono",
      avatarShape: "hexagon",
      avatarRing: "border-2 border-teal-400",
      avatarGlow: "shadow-[0_0_30px_rgba(45,212,191,0.5)]",
      tagline: "CONSENSUS LAYER // DECENTRALIZED IDENTITY",
      vibeTag: "BLOCKCHAIN",
    },
  },

  // 15. Sahara Golden Mirage
  "sahara-mirage": {
    id: "sahara-mirage",
    name: "Sahara Golden Dunes",
    category: "luxury",
    theme: {
      bg: "bg-gradient-to-b from-[#140b03] via-[#241306] to-[#0f0701]",
      bgStyle: "radial",
      cardBg: "bg-[#291708]/80 backdrop-blur-2xl",
      cardBorder: "border-amber-500/30",
      cardHoverBorder: "hover:border-yellow-400",
      cardHoverShadow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]",
      primaryColor: "#f59e0b",
      accentColor: "#fbbf24",
      textColor: "text-amber-50",
      mutedColor: "text-amber-200/60",
      badgeBg: "bg-amber-500/20 border border-amber-400/40",
      badgeText: "text-amber-300",
      fontStyle: "serif",
      avatarShape: "circle",
      avatarRing: "border-2 border-amber-400",
      avatarGlow: "shadow-[0_0_35px_rgba(245,158,11,0.55)]",
      tagline: "GOLDEN DUNES // OASIS MAJESTY",
      vibeTag: "SAHARA GOLD",
    },
  },

  // 16. Tokyo Manga Anime Ink
  "manga-ink": {
    id: "manga-ink",
    name: "Tokyo Manga & Anime Ink",
    category: "creative",
    theme: {
      bg: "bg-[#0b0b0f]",
      bgStyle: "lines",
      cardBg: "bg-[#14141c]/90 backdrop-blur-xl",
      cardBorder: "border-rose-500/30",
      cardHoverBorder: "hover:border-rose-400",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(244,63,94,0.4)]",
      primaryColor: "#f43f5e",
      accentColor: "#ffffff",
      textColor: "text-rose-50",
      mutedColor: "text-rose-200/60",
      badgeBg: "bg-rose-500/20 border border-rose-400/40",
      badgeText: "text-rose-300",
      fontStyle: "sans",
      avatarShape: "rounded",
      avatarRing: "border-2 border-rose-500",
      avatarGlow: "shadow-[0_0_30px_rgba(244,63,94,0.5)]",
      tagline: "SHONEN SPIRIT // INK & SCREENTONE",
      vibeTag: "ANIME HERO",
    },
  },

  // 17. Linux Kernel Hacker
  "linux-kernel": {
    id: "linux-kernel",
    name: "Linux Kernel Hacker",
    category: "developer",
    theme: {
      bg: "bg-[#07090b]",
      bgStyle: "grid",
      cardBg: "bg-[#0d1217]/90 backdrop-blur-xl",
      cardBorder: "border-orange-500/30",
      cardHoverBorder: "hover:border-yellow-400",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(249,115,22,0.4)]",
      primaryColor: "#f97316",
      accentColor: "#eab308",
      textColor: "text-orange-100",
      mutedColor: "text-orange-300/60",
      badgeBg: "bg-orange-500/20 border border-orange-400/40",
      badgeText: "text-orange-300",
      fontStyle: "mono",
      avatarShape: "squircle",
      avatarRing: "border-2 border-orange-500",
      avatarGlow: "shadow-[0_0_25px_rgba(249,115,22,0.5)]",
      tagline: "ROOT ACCESS // COMPILED FROM SOURCE",
      vibeTag: "OPEN SOURCE",
    },
  },

  // 18. Platinum Banking Executive
  "platinum-executive": {
    id: "platinum-executive",
    name: "Platinum Banking & Law",
    category: "business",
    theme: {
      bg: "bg-[#070a0e]",
      bgStyle: "radial",
      cardBg: "bg-[#0f1722]/85 backdrop-blur-2xl",
      cardBorder: "border-slate-500/30",
      cardHoverBorder: "hover:border-cyan-300",
      cardHoverShadow: "hover:shadow-[0_0_25px_rgba(103,232,249,0.3)]",
      primaryColor: "#67e8f9",
      accentColor: "#cbd5e1",
      textColor: "text-slate-100",
      mutedColor: "text-slate-400",
      badgeBg: "bg-slate-800 border border-slate-600",
      badgeText: "text-cyan-300",
      fontStyle: "sans",
      avatarShape: "circle",
      avatarRing: "border-2 border-cyan-400/70",
      avatarGlow: "shadow-[0_0_25px_rgba(103,232,249,0.35)]",
      tagline: "SWISS PRIVATE BANKING // ADVISORY",
      vibeTag: "CORPORATE ELITE",
    },
  },
};

export function ExtendedTemplateView({ 
  profile, 
  config 
}: { 
  profile: UserProfile; 
  config: ExtendedTemplateConfig; 
}) {
  const [copied, setCopied] = useState(false);
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];
  const { theme } = config;

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getShapeClass = (shape?: string) => {
    switch (shape) {
      case "squircle":
        return "rounded-[28px]";
      case "rounded":
        return "rounded-2xl";
      case "hexagon":
        return "rounded-3xl rotate-3";
      case "circle":
      default:
        return "rounded-full";
    }
  };

  return (
    <div className={`min-h-screen ${theme.bg} text-white flex flex-col items-center justify-between p-4 sm:p-8 relative overflow-hidden font-${theme.fontStyle || "sans"} selection:bg-white/20`}>
      {/* Background Ambience Pattern */}
      {theme.bgStyle === "grid" && (
        <div 
          className="fixed inset-0 pointer-events-none opacity-20 -z-10"
          style={{
            backgroundImage: `radial-gradient(${theme.primaryColor} 1px, transparent 1px)`,
            backgroundSize: "32px 32px"
          }}
        />
      )}
      {theme.bgStyle === "stars" && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[160px] opacity-25" style={{ backgroundColor: theme.primaryColor }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[180px] opacity-20" style={{ backgroundColor: theme.accentColor }} />
        </div>
      )}
      {theme.bgStyle === "matrix" && (
        <div 
          className="fixed inset-0 pointer-events-none opacity-15 -z-10"
          style={{
            backgroundImage: `linear-gradient(to right, ${theme.primaryColor}15 1px, transparent 1px), linear-gradient(to bottom, ${theme.primaryColor}15 1px, transparent 1px)`,
            backgroundSize: "24px 24px"
          }}
        />
      )}

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto pt-6 sm:pt-10 pb-12 flex-1"
      >
        {/* Top Status Bar */}
        <div className="flex items-center justify-between text-xs mb-8 px-1">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${theme.badgeBg}`}>
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.primaryColor }} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${theme.badgeText}`}>
              {theme.vibeTag || "VERIFIED CREATOR"}
            </span>
          </div>

          <button
            onClick={copyUrl}
            className="hover:opacity-80 transition-opacity flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300 backdrop-blur-md"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "تم النسخ" : "مشاركة"}</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-8 relative">
          <div className="relative inline-block mb-4">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 p-1 bg-black/40 overflow-hidden ${getShapeClass(theme.avatarShape)} ${theme.avatarRing || "border-2 border-white/20"} ${theme.avatarGlow || "shadow-2xl"}`}>
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                alt={profile.fullName}
                className={`w-full h-full object-cover ${getShapeClass(theme.avatarShape)}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: theme.primaryColor }}>
              {profile.fullName}
            </h1>
            <Sparkles className="w-4 h-4" style={{ color: theme.accentColor }} />
          </div>

          {profile.jobTitle && (
            <p className="text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: theme.accentColor }}>
              {profile.jobTitle}
            </p>
          )}

          {theme.tagline && (
            <div className="inline-block text-[10px] tracking-widest font-mono opacity-60 mb-3 px-2 py-0.5 border-b border-white/10">
              {theme.tagline}
            </div>
          )}

          {profile.bio && (
            <p className={`text-xs sm:text-sm leading-relaxed max-w-sm mx-auto ${theme.mutedColor}`}>
              {profile.bio}
            </p>
          )}

          {profile.location && (
            <div className={`flex items-center justify-center gap-1.5 text-xs mt-3 ${theme.mutedColor}`}>
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>

        {/* Links List */}
        <div className="space-y-3 mb-8">
          {activeLinks.map((link, index) => (
            <motion.a
              key={link.id || index}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${theme.cardBg} ${theme.cardBorder} ${theme.cardHoverBorder} ${theme.cardHoverShadow}`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <PlatformIcon platform={link.platform} className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <span className="font-semibold text-sm block truncate group-hover:text-white transition-colors">
                    {link.title}
                  </span>
                  <span className="text-[11px] block truncate font-mono opacity-50">
                    {link.platform}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                <ExternalLink className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Contact Footer */}
        {(profile.email || profile.phone || profile.whatsapp) && (
          <div className="pt-6 border-t border-white/10 flex items-center justify-center gap-4 text-xs">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-white/30 hover:scale-110 transition-all text-gray-300 hover:text-white"
                title={profile.email}
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-white/30 hover:scale-110 transition-all text-gray-300 hover:text-white"
                title={profile.phone}
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </motion.div>

      {/* Powered By Badge */}
      <div className="py-4 text-center">
        <a
          href="https://novawebdv.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
        >
          <span>Powered by</span>
          <span className="font-bold tracking-wider" style={{ color: theme.primaryColor }}>NOVAWEB</span>
        </a>
      </div>
    </div>
  );
}
