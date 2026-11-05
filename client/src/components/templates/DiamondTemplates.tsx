import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Copy, Check } from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

/* ─────────────────────────────────────────────────────────
   SHARED UTILS
───────────────────────────────────────────────────────── */
function useCopy() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };
  return { copiedId, copy };
}

/* ─────────────────────────────────────────────────────────
   1. ANIME ATMOSPHERE  — dark cinematic anime / Pinterest pin style
      Cover photo = full-screen parallax bg
      Sakura particles + glowing avatar ring
      Japanese typography accents
───────────────────────────────────────────────────────── */
export function AnimeAtmosphere({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden font-sans"
      style={{ background: "#0b0415" }}
    >
      {/* Cover background */}
      {profile.coverUrl && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${profile.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
            filter: "brightness(0.28) saturate(1.4)",
          }}
        />
      )}

      {/* Aurora overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.35) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(236,72,153,0.2) 0%, transparent 60%)",
        }}
      />

      {/* Animated Sakura particles */}
      <SakuraParticles />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        {/* Japanese accent top */}
        <p
          className="text-xs tracking-[0.5em] mb-6 opacity-50"
          style={{ color: "#c084fc", fontFamily: "serif" }}
        >
          ✦ プロフィール ✦
        </p>

        {/* Avatar */}
        <div className="relative mb-5">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #c084fc, #ec4899, #818cf8, #c084fc)",
              padding: "3px",
              borderRadius: "9999px",
              animation: "spin 4s linear infinite",
            }}
          />
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden"
            style={{
              border: "3px solid transparent",
              background: "linear-gradient(#0b0415,#0b0415) padding-box, conic-gradient(from 0deg,#c084fc,#ec4899,#818cf8,#c084fc) border-box",
              boxShadow: "0 0 40px rgba(192,132,252,0.5), 0 0 80px rgba(236,72,153,0.2)",
            }}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold"
                style={{ background: "linear-gradient(135deg,#4c1d95,#1e1b4b)", color: "#c084fc" }}
              >
                {profile.displayName?.[0] ?? "?"}
              </div>
            )}
          </div>
        </div>

        {/* Name + bio */}
        <h1
          className="text-2xl font-bold text-center mb-1"
          style={{
            background: "linear-gradient(135deg,#e9d5ff,#ffffff,#c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "none",
          }}
        >
          {profile.displayName || "Name"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "#d8b4fe" }}>
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs flex items-center gap-1 mb-5" style={{ color: "#a78bfa" }}>
            <MapPin className="w-3 h-3" /> {profile.location}
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-2 mb-6 w-full max-w-xs opacity-40">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,transparent,#c084fc)" }} />
          <span className="text-xs" style={{ color: "#c084fc" }}>♦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,#c084fc,transparent)" }} />
        </div>

        {/* Links */}
        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                background: "rgba(139,92,246,0.08)",
                border: "1px solid rgba(192,132,252,0.2)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 0 0 0 rgba(192,132,252,0)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(192,132,252,0.3)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,252,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 rgba(192,132,252,0)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,252,0.2)";
              }}
            >
              <PlatformIcon platform={link.platform} size={18} color="#c084fc" />
              <span className="flex-1 text-sm font-medium text-center" style={{ color: "#e9d5ff" }}>
                {link.title}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#c084fc" }} />
            </motion.a>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(192,132,252,0.3)",
                color: "#d8b4fe",
              }}
            >
              {copiedId === "email" ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
              {profile.email}
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all"
              style={{
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(192,132,252,0.3)",
                color: "#d8b4fe",
              }}
            >
              {copiedId === "phone" ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
              {profile.phone}
            </button>
          )}
        </div>

        <p className="mt-10 text-xs opacity-20" style={{ color: "#a78bfa", letterSpacing: "0.3em" }}>
          月光 · MOONLIGHT
        </p>
      </div>

      <style>{`
        @keyframes sakuraFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function SakuraParticles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    duration: 6 + Math.random() * 8,
    delay: Math.random() * 10,
    size: 6 + Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "60% 40% 50% 50% / 40% 60% 40% 60%",
            background: "radial-gradient(circle, rgba(236,72,153,0.7), rgba(192,132,252,0.4))",
            animation: `sakuraFall ${p.duration}s ${p.delay}s linear infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   2. AURORA GLASS — React Bits-inspired
      Cover photo = base background
      Rotating conic-gradient aurora
      True glassmorphism + morphing blob avatar ring
      Shimmer hover on cards
───────────────────────────────────────────────────────── */
export function AuroraGlass({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#05080f" }}>
      {/* Cover background */}
      {profile.coverUrl && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${profile.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.2) saturate(1.6) blur(2px)",
          }}
        />
      )}

      {/* Rotating aurora */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 30%, #0ea5e9 0%, #8b5cf6 25%, #ec4899 50%, #10b981 75%, #0ea5e9 100%)",
          opacity: 0.15,
          animation: "auroraRotate 12s linear infinite",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(5,8,15,0.95) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        {/* Blob avatar */}
        <div className="relative mb-5">
          <div
            className="absolute -inset-3"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899)",
              borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              animation: "blobMorph 8s ease-in-out infinite",
              opacity: 0.5,
              filter: "blur(12px)",
            }}
          />
          <div
            className="relative w-28 h-28 overflow-hidden"
            style={{
              borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
              animation: "blobMorph 8s ease-in-out infinite",
              border: "2px solid rgba(139,92,246,0.5)",
              boxShadow: "0 0 30px rgba(139,92,246,0.4)",
            }}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold"
                style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)", color: "#7c3aed" }}
              >
                {profile.displayName?.[0] ?? "?"}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1
          className="text-2xl font-bold text-center mb-1"
          style={{
            background: "linear-gradient(135deg,#bae6fd,#ffffff,#c4b5fd)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {profile.displayName || "Name"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "#94a3b8" }}>
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "#7dd3fc" }}>
            <MapPin className="w-3 h-3" /> {profile.location}
          </p>
        )}

        {/* Links */}
        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="group relative flex items-center gap-3 w-full px-4 py-3 rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Shimmer on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                  animation: "shimmer 1.5s infinite",
                }}
              />
              <PlatformIcon platform={link.platform} size={18} color="#818cf8" />
              <span className="flex-1 text-sm font-medium text-center relative z-10" style={{ color: "#e2e8f0" }}>
                {link.title}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#818cf8" }} />
            </motion.a>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: "rgba(14,165,233,0.1)",
                border: "1px solid rgba(14,165,233,0.3)",
                color: "#7dd3fc",
                backdropFilter: "blur(8px)",
              }}
            >
              {copiedId === "email" ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
              {profile.email}
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: "rgba(14,165,233,0.1)",
                border: "1px solid rgba(14,165,233,0.3)",
                color: "#7dd3fc",
                backdropFilter: "blur(8px)",
              }}
            >
              {copiedId === "phone" ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
              {profile.phone}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes auroraRotate {
          from { transform: rotate(0deg) scale(1.5); }
          to   { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes blobMorph {
          0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25%     { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50%     { border-radius: 50% 50% 30% 70% / 50% 70% 30% 50%; }
          75%     { border-radius: 70% 30% 50% 50% / 40% 60% 40% 60%; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   3. LIQUID METAL — Platinum liquid chrome aesthetic
      Cover photo with heavy darkening
      Morphing blob shapes
      Metallic gradient text
      Floating particle field
───────────────────────────────────────────────────────── */
export function LiquidMetal({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#0a0a0a" }}>
      {/* Cover */}
      {profile.coverUrl && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${profile.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.15) saturate(0.3) grayscale(0.5)",
          }}
        />
      )}

      {/* Metallic radial glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(226,232,240,0.07) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 40% at 20% 80%, rgba(148,163,184,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Floating chrome particles */}
      <ChromeParticles />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        {/* Avatar ring — metallic */}
        <div className="relative mb-5">
          <div
            className="absolute -inset-1 rounded-full"
            style={{
              background: "linear-gradient(135deg, #94a3b8, #e2e8f0, #64748b, #cbd5e1, #94a3b8)",
              backgroundSize: "200% 200%",
              animation: "metallicShift 4s ease-in-out infinite",
              filter: "blur(1px)",
            }}
          />
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden"
            style={{
              border: "2px solid #64748b",
              boxShadow: "0 0 30px rgba(148,163,184,0.3), inset 0 0 15px rgba(255,255,255,0.05)",
            }}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold"
                style={{ background: "linear-gradient(135deg,#1e293b,#0f172a)", color: "#94a3b8" }}
              >
                {profile.displayName?.[0] ?? "?"}
              </div>
            )}
          </div>
        </div>

        {/* Name — metallic gradient */}
        <h1
          className="text-2xl font-bold text-center mb-1 tracking-wider uppercase"
          style={{
            background: "linear-gradient(135deg, #94a3b8, #f1f5f9, #94a3b8, #e2e8f0)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "metallicText 4s ease-in-out infinite alternate",
          }}
        >
          {profile.displayName || "Name"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "#64748b" }}>
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "#94a3b8" }}>
            <MapPin className="w-3 h-3" /> {profile.location}
          </p>
        )}

        {/* Links */}
        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))",
                border: "1px solid rgba(100,116,139,0.3)",
                backdropFilter: "blur(16px)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.7)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(148,163,184,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(100,116,139,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Chrome sheen */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(241,245,249,0.03) 0%, rgba(241,245,249,0.08) 50%, transparent 100%)",
                }}
              />
              <PlatformIcon platform={link.platform} size={18} color="#94a3b8" />
              <span className="flex-1 text-sm font-medium text-center relative z-10" style={{ color: "#cbd5e1" }}>
                {link.title}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#94a3b8" }} />
            </motion.a>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(100,116,139,0.4)", color: "#94a3b8" }}
            >
              {copiedId === "email" ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
              {profile.email}
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(100,116,139,0.4)", color: "#94a3b8" }}
            >
              {copiedId === "phone" ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
              {profile.phone}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes metallicShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes metallicText {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}

function ChromeParticles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 8,
    size: 2 + Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(226,232,240,0.6), rgba(100,116,139,0.2))",
            animation: `float ${p.duration}s ${p.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   4. COSMIC PARALLAX — Deep space nebula
      Cover photo = star field background
      Rotating nebula color overlay
      Cosmic teal/cyan/indigo palette
      Constellation connectors between links
      3D-tilt card effect on hover
───────────────────────────────────────────────────────── */
export function CosmicParallax({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#020614" }}>
      {/* Cover as star field */}
      {profile.coverUrl && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${profile.coverUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.2) saturate(1.8)",
          }}
        />
      )}

      {/* Nebula overlay — animated */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 30% 30%, rgba(6,182,212,0.15) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 40% at 70% 70%, rgba(99,102,241,0.15) 0%, transparent 60%), " +
            "radial-gradient(ellipse 40% 30% at 50% 50%, rgba(14,165,233,0.08) 0%, transparent 50%)",
          animation: "nebulaBreath 10s ease-in-out infinite alternate",
        }}
      />

      {/* Star dots */}
      <StarField />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        {/* Cosmic badge */}
        <div
          className="text-xs px-3 py-1 rounded-full mb-6 tracking-widest"
          style={{
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.3)",
            color: "#22d3ee",
          }}
        >
          ✦ COSMOS ✦
        </div>

        {/* Avatar — space ring */}
        <div className="relative mb-5">
          <div
            className="absolute -inset-2 rounded-full opacity-60"
            style={{
              background: "conic-gradient(from 0deg, #06b6d4, #6366f1, #0ea5e9, #22d3ee, #06b6d4)",
              animation: "cosmicSpin 6s linear infinite",
            }}
          />
          <div
            className="absolute -inset-1 rounded-full"
            style={{ background: "#020614" }}
          />
          <div
            className="relative w-28 h-28 rounded-full overflow-hidden"
            style={{
              boxShadow: "0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(99,102,241,0.2)",
            }}
          >
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold"
                style={{ background: "linear-gradient(135deg,#0c1445,#030a1e)", color: "#06b6d4" }}
              >
                {profile.displayName?.[0] ?? "?"}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1
          className="text-2xl font-bold text-center mb-1 tracking-wide"
          style={{
            background: "linear-gradient(135deg,#67e8f9,#ffffff,#a5b4fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {profile.displayName || "Name"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "#64748b" }}>
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "#22d3ee" }}>
            <MapPin className="w-3 h-3" /> {profile.location}
          </p>
        )}

        {/* Links */}
        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
              className="group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl overflow-hidden"
              style={{
                background: "rgba(6,182,212,0.05)",
                border: "1px solid rgba(6,182,212,0.2)",
                backdropFilter: "blur(16px)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.6)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 25px rgba(6,182,212,0.25), inset 0 0 15px rgba(6,182,212,0.05)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.2)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Star connector line above (except first) */}
              {i > 0 && (
                <div
                  className="absolute -top-3 left-1/2 w-px h-3 opacity-20"
                  style={{ background: "linear-gradient(to bottom, transparent, #06b6d4)" }}
                />
              )}
              <PlatformIcon platform={link.platform} size={18} color="#06b6d4" />
              <span className="flex-1 text-sm font-medium text-center relative z-10" style={{ color: "#e0f2fe" }}>
                {link.title}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#06b6d4" }} />
            </motion.a>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.3)", color: "#67e8f9" }}
            >
              {copiedId === "email" ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
              {profile.email}
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
              style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.3)", color: "#67e8f9" }}
            >
              {copiedId === "phone" ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
              {profile.phone}
            </button>
          )}
        </div>

        <p className="mt-10 text-xs opacity-20" style={{ color: "#06b6d4", letterSpacing: "0.4em" }}>
          ★ NOVAWEBDV
        </p>
      </div>

      <style>{`
        @keyframes nebulaBreath {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes cosmicSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes starTwinkle {
          0%,100% { opacity: 0.3; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "50%",
            background: "white",
            opacity: 0.4,
            animation: `starTwinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
