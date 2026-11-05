import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Copy, Check, Sparkles } from "lucide-react";
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

function ContactRow({ profile, copiedId, copy }: { profile: UserProfile; copiedId: string | null; copy: (t: string, id: string) => void }) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-2">
      {profile.email && (
        <button onClick={() => copy(profile.email!, "email")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
          {copiedId === "email" ? <Check className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
          {profile.email}
        </button>
      )}
      {profile.phone && (
        <button onClick={() => copy(profile.phone!, "phone")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", backdropFilter: "blur(8px)" }}>
          {copiedId === "phone" ? <Check className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
          {profile.phone}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. ANIME ATMOSPHERE  — Pinterest-inspired cinematic anime
      Fixed built-in dark sky background (NOT coverUrl)
      Rain streaks, distant mountain silhouette
      Sakura petals + floating lanterns
      Glowing torii gate aesthetic
═══════════════════════════════════════════════════════════ */
export function AnimeAtmosphere({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ fontFamily: "sans-serif" }}>
      {/* Sky gradient — dark navy/purple cinematic */}
      <div className="absolute inset-0 z-0" style={{
        background: "linear-gradient(180deg, #0d0520 0%, #1a0a35 25%, #2d1255 50%, #1a0a35 75%, #080212 100%)"
      }} />

      {/* Moon glow */}
      <div className="absolute z-0" style={{
        top: "6%", right: "18%", width: "90px", height: "90px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,240,180,0.9) 0%, rgba(255,220,120,0.4) 40%, transparent 70%)",
        boxShadow: "0 0 60px 30px rgba(255,220,120,0.15), 0 0 120px 60px rgba(180,100,255,0.08)",
      }} />
      {/* Moon crescent shadow */}
      <div className="absolute z-0" style={{
        top: "5.5%", right: "16.5%", width: "90px", height: "90px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 40%, rgba(13,5,32,0.8) 30%, transparent 65%)",
      }} />

      {/* Purple cloud wisps */}
      {[0,1,2,3].map(i => (
        <div key={i} className="absolute z-0" style={{
          top: `${10 + i * 15}%`,
          left: `${-20 + i * 25}%`,
          width: `${200 + i * 80}px`,
          height: `${40 + i * 15}px`,
          borderRadius: "50%",
          background: `rgba(${80 + i*20},${30 + i*10},${150 + i*20},${0.12 + i * 0.03})`,
          filter: "blur(20px)",
          animation: `cloudDrift ${18 + i * 5}s ${i * 3}s ease-in-out infinite alternate`,
        }} />
      ))}

      {/* Mountain silhouettes */}
      <svg className="absolute bottom-0 left-0 w-full z-0" viewBox="0 0 400 180" preserveAspectRatio="none">
        <polygon points="0,180 60,80 120,130 180,50 240,110 300,40 360,100 400,70 400,180" fill="rgba(5,2,15,0.95)" />
        <polygon points="0,180 80,110 150,140 220,90 290,120 370,85 400,100 400,180" fill="rgba(8,3,20,0.98)" />
      </svg>

      {/* Rain streaks */}
      <RainEffect />

      {/* Sakura particles */}
      <SakuraPetals />

      {/* Torii-inspired top arch hint */}
      <div className="absolute top-0 left-0 right-0 z-0 flex justify-center">
        <div style={{
          width: "2px", height: "60px", marginTop: "0",
          background: "linear-gradient(to bottom, rgba(255,80,80,0.5), transparent)"
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        {/* Japanese header */}
        <div className="mb-7 text-center">
          <p className="text-[10px] tracking-[0.6em] opacity-50" style={{ color: "#c084fc" }}>
            夜の星 · NOCTURNE
          </p>
          <div className="mt-1 flex items-center justify-center gap-2 opacity-30">
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg,transparent,#c084fc)" }} />
            <span style={{ color: "#ec4899", fontSize: "8px" }}>✦</span>
            <div className="h-px w-10" style={{ background: "linear-gradient(90deg,#c084fc,transparent)" }} />
          </div>
        </div>

        {/* Avatar — glowing ring with petal animation */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 rounded-full" style={{
            background: "conic-gradient(from 0deg, #7c3aed, #ec4899, #a78bfa, #7c3aed)",
            animation: "spinRing 5s linear infinite",
            opacity: 0.7,
          }} />
          <div className="absolute -inset-1 rounded-full" style={{ background: "#0d0520" }} />
          <div className="relative w-28 h-28 rounded-full overflow-hidden" style={{
            boxShadow: "0 0 30px rgba(124,58,237,0.5), 0 0 60px rgba(236,72,153,0.2)"
          }}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold"
                style={{ background: "linear-gradient(135deg,#2d1255,#1a0a35)", color: "#c084fc" }}>
                {profile.displayName?.[0] ?? "?"}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1 className="text-2xl font-bold text-center mb-1" style={{
          background: "linear-gradient(135deg,#f5d0fe,#ffffff,#c084fc)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          textShadow: "none",
        }}>
          {profile.displayName || "Name"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "rgba(216,180,254,0.8)" }}>
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs flex items-center gap-1 mb-7" style={{ color: "#a78bfa" }}>
            <MapPin className="w-3 h-3" /> {profile.location}
          </p>
        )}

        {/* Links */}
        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                background: "rgba(124,58,237,0.08)",
                border: "1px solid rgba(192,132,252,0.18)",
                backdropFilter: "blur(16px)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(192,132,252,0.3), inset 0 0 15px rgba(192,132,252,0.05)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,252,0.55)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,132,252,0.18)";
              }}
            >
              <PlatformIcon platform={link.platform} size={18} color="#c084fc" />
              <span className="flex-1 text-sm font-medium text-center" style={{ color: "#f5d0fe" }}>{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: "#c084fc" }} />
            </motion.a>
          ))}
        </div>

        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
        <p className="mt-10 text-[9px] opacity-15 tracking-[0.4em]" style={{ color: "#c084fc" }}>月光 · MOONLIGHT</p>
      </div>

      <style>{`
        @keyframes spinRing { to { transform: rotate(360deg); } }
        @keyframes sakuraFall {
          0% { transform: translateY(-10px) rotate(0deg) translateX(0); opacity: 0.9; }
          50% { transform: translateY(50vh) rotate(360deg) translateX(30px); opacity: 0.7; }
          100% { transform: translateY(110vh) rotate(720deg) translateX(-20px); opacity: 0; }
        }
        @keyframes rainFall {
          0% { transform: translateY(-20px); opacity: 0.6; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(30px); }
        }
      `}</style>
    </div>
  );
}

function SakuraPetals() {
  const petals = Array.from({ length: 16 }, (_, i) => ({
    id: i, left: Math.random() * 100,
    duration: 7 + Math.random() * 8, delay: Math.random() * 12, size: 5 + Math.random() * 9,
  }));
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {petals.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.left}%`, top: "-20px",
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: "60% 40% 50% 50% / 40% 60% 40% 60%",
          background: "radial-gradient(circle, rgba(236,72,153,0.75), rgba(192,132,252,0.4))",
          animation: `sakuraFall ${p.duration}s ${p.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}

function RainEffect() {
  const drops = Array.from({ length: 50 }, (_, i) => ({
    id: i, left: Math.random() * 100,
    duration: 0.6 + Math.random() * 0.8, delay: Math.random() * 2,
    opacity: 0.08 + Math.random() * 0.14, height: 15 + Math.random() * 25,
  }));
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {drops.map(d => (
        <div key={d.id} style={{
          position: "absolute", left: `${d.left}%`, top: "-30px",
          width: "1px", height: `${d.height}px`,
          background: "linear-gradient(to bottom, transparent, rgba(200,180,255,0.6), transparent)",
          opacity: d.opacity,
          animation: `rainFall ${d.duration}s ${d.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. COVER HERO  — The user's coverUrl IS the template bg
      Full-screen parallax cover photo
      Minimal overlay, name in big bold text
      Frosted glass link cards
═══════════════════════════════════════════════════════════ */
export function CoverHero({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Cover = FULL background */}
      {profile.coverUrl ? (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
      ) : (
        <div className="absolute inset-0 z-0" style={{
          background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)"
        }} />
      )}
      {/* Dark gradient overlay — bottom heavy so text is readable */}
      <div className="absolute inset-0 z-0" style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.85) 100%)"
      }} />

      {/* Noise texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        backgroundRepeat: "repeat",
      }} />

      <div className="relative z-10 flex flex-col items-center px-4 pb-10 min-h-screen justify-end" style={{ paddingTop: "20vh" }}>
        {/* Avatar */}
        <motion.div className="mb-5" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="w-28 h-28 rounded-full overflow-hidden" style={{
            border: "3px solid rgba(255,255,255,0.4)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)"
          }}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                {profile.displayName?.[0] ?? "?"}
              </div>
            )}
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="text-3xl font-black text-center text-white mb-1 drop-shadow-2xl tracking-tight">
          {profile.displayName || "Name"}
        </motion.h1>
        {profile.bio && (
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            {profile.bio}
          </motion.p>
        )}
        {profile.location && (
          <p className="text-xs flex items-center gap-1 mb-7" style={{ color: "rgba(255,255,255,0.6)" }}>
            <MapPin className="w-3 h-3" /> {profile.location}
          </p>
        )}

        {/* Links — frosted glass */}
        <div className="w-full max-w-xs space-y-2.5">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="group flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.22)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.12)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <PlatformIcon platform={link.platform} size={18} color="rgba(255,255,255,0.8)" />
              <span className="flex-1 text-sm font-semibold text-center text-white">{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-60 transition-opacity" />
            </motion.a>
          ))}
        </div>

        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. AURORA GLASS  — React Bits aurora rotating
      Conic-gradient aurora + blob avatar + shimmer cards
      Cover photo as faded bg
═══════════════════════════════════════════════════════════ */
export function AuroraGlass({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#05080f" }}>
      {profile.coverUrl && (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.18) saturate(1.6) blur(2px)",
        }} />
      )}
      {/* Rotating aurora */}
      <div className="absolute inset-0 z-0" style={{
        background: "conic-gradient(from 0deg at 50% 30%, #0ea5e9 0%, #8b5cf6 25%, #ec4899 50%, #10b981 75%, #0ea5e9 100%)",
        opacity: 0.14,
        animation: "auroraRotate 12s linear infinite",
        filter: "blur(80px)",
      }} />
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(5,8,15,0.96) 0%, transparent 100%)"
      }} />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        {/* Blob avatar */}
        <div className="relative mb-5">
          <div className="absolute -inset-3" style={{
            background: "linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899)",
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            animation: "blobMorph 8s ease-in-out infinite", opacity: 0.45, filter: "blur(14px)",
          }} />
          <div className="relative w-28 h-28 overflow-hidden" style={{
            borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
            animation: "blobMorph 8s ease-in-out infinite",
            border: "2px solid rgba(139,92,246,0.5)",
            boxShadow: "0 0 30px rgba(139,92,246,0.4)",
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ background: "linear-gradient(135deg,#0f172a,#1e1b4b)", color: "#7c3aed" }}>
                  {profile.displayName?.[0] ?? "?"}
                </div>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{
          background: "linear-gradient(135deg,#bae6fd,#ffffff,#c4b5fd)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>{profile.displayName || "Name"}</h1>
        {profile.bio && <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "#94a3b8" }}>{profile.bio}</p>}
        {profile.location && <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "#7dd3fc" }}><MapPin className="w-3 h-3" />{profile.location}</p>}

        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              className="group relative flex items-center gap-3 w-full px-4 py-3 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(20px)", transition: "all 0.3s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(139,92,246,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none" style={{
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)",
                animation: "shimmer 1.5s infinite", transition: "opacity 0.3s"
              }} />
              <PlatformIcon platform={link.platform} size={18} color="#818cf8" />
              <span className="flex-1 text-sm font-medium text-center relative z-10" style={{ color: "#e2e8f0" }}>{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#818cf8" }} />
            </motion.a>
          ))}
        </div>
        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
      </div>

      <style>{`
        @keyframes auroraRotate { from{transform:rotate(0deg) scale(1.5)} to{transform:rotate(360deg) scale(1.5)} }
        @keyframes blobMorph {
          0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
          25%{border-radius:30% 70% 70% 30%/30% 30% 70% 70%}
          50%{border-radius:50% 50% 30% 70%/50% 70% 30% 50%}
          75%{border-radius:70% 30% 50% 50%/40% 60% 40% 60%}
        }
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. LIQUID METAL  — Chrome/platinum aesthetic
═══════════════════════════════════════════════════════════ */
export function LiquidMetal({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#080808" }}>
      {profile.coverUrl && (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.12) saturate(0.2) grayscale(0.6)",
        }} />
      )}
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 20%, rgba(226,232,240,0.06) 0%, transparent 70%)"
      }} />
      <ChromeParticles />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        <div className="relative mb-5">
          <div className="absolute -inset-1 rounded-full" style={{
            background: "linear-gradient(135deg,#94a3b8,#e2e8f0,#64748b,#cbd5e1,#94a3b8)",
            backgroundSize: "200% 200%", animation: "metallicShift 4s ease-in-out infinite", filter: "blur(1px)"
          }} />
          <div className="relative w-28 h-28 rounded-full overflow-hidden" style={{
            border: "2px solid #64748b",
            boxShadow: "0 0 30px rgba(148,163,184,0.3), inset 0 0 15px rgba(255,255,255,0.05)"
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ background: "linear-gradient(135deg,#1e293b,#0f172a)", color: "#94a3b8" }}>
                  {profile.displayName?.[0] ?? "?"}
                </div>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 tracking-wider uppercase" style={{
          background: "linear-gradient(135deg,#94a3b8,#f1f5f9,#94a3b8,#e2e8f0)",
          backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "metallicText 4s ease-in-out infinite alternate"
        }}>{profile.displayName || "Name"}</h1>
        {profile.bio && <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "#64748b" }}>{profile.bio}</p>}
        {profile.location && <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "#94a3b8" }}><MapPin className="w-3 h-3" />{profile.location}</p>}

        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg,rgba(30,41,59,0.8),rgba(15,23,42,0.9))",
                border: "1px solid rgba(100,116,139,0.3)", backdropFilter: "blur(16px)", transition: "all 0.3s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(148,163,184,0.7)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(148,163,184,0.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(100,116,139,0.3)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                background: "linear-gradient(135deg,rgba(241,245,249,0.03) 0%,rgba(241,245,249,0.08) 50%,transparent 100%)"
              }} />
              <PlatformIcon platform={link.platform} size={18} color="#94a3b8" />
              <span className="flex-1 text-sm font-medium text-center relative z-10" style={{ color: "#cbd5e1" }}>{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#94a3b8" }} />
            </motion.a>
          ))}
        </div>
        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
      </div>

      <style>{`
        @keyframes metallicShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes metallicText { 0%{background-position:0% center} 100%{background-position:200% center} }
        @keyframes floatParticle { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(180deg)} }
      `}</style>
    </div>
  );
}

function ChromeParticles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    duration: 5 + Math.random() * 10, delay: Math.random() * 8, size: 2 + Math.random() * 4,
  }));
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.left}%`, top: `${p.top}%`,
          width: `${p.size}px`, height: `${p.size}px`, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(226,232,240,0.6),rgba(100,116,139,0.2))",
          animation: `floatParticle ${p.duration}s ${p.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. COSMIC PARALLAX  — React Bits: deep space
═══════════════════════════════════════════════════════════ */
export function CosmicParallax({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#020614" }}>
      {profile.coverUrl && (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.18) saturate(1.8)",
        }} />
      )}
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 60% 40% at 30% 30%,rgba(6,182,212,0.14) 0%,transparent 60%), radial-gradient(ellipse 50% 40% at 70% 70%,rgba(99,102,241,0.14) 0%,transparent 60%)",
        animation: "nebulaBreath 10s ease-in-out infinite alternate"
      }} />
      <StarField />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        <div className="text-xs px-3 py-1 rounded-full mb-6 tracking-widest" style={{
          background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", color: "#22d3ee"
        }}>✦ COSMOS ✦</div>

        <div className="relative mb-5">
          <div className="absolute -inset-2 rounded-full opacity-60" style={{
            background: "conic-gradient(from 0deg,#06b6d4,#6366f1,#0ea5e9,#22d3ee,#06b6d4)",
            animation: "cosmicSpin 6s linear infinite"
          }} />
          <div className="absolute -inset-1 rounded-full" style={{ background: "#020614" }} />
          <div className="relative w-28 h-28 rounded-full overflow-hidden" style={{
            boxShadow: "0 0 40px rgba(6,182,212,0.4),0 0 80px rgba(99,102,241,0.2)"
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ background: "linear-gradient(135deg,#0c1445,#030a1e)", color: "#06b6d4" }}>
                  {profile.displayName?.[0] ?? "?"}
                </div>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 tracking-wide" style={{
          background: "linear-gradient(135deg,#67e8f9,#ffffff,#a5b4fc)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>{profile.displayName || "Name"}</h1>
        {profile.bio && <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "#64748b" }}>{profile.bio}</p>}
        {profile.location && <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "#22d3ee" }}><MapPin className="w-3 h-3" />{profile.location}</p>}

        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
              className="group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl overflow-hidden"
              style={{
                background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)",
                backdropFilter: "blur(16px)", transition: "all 0.3s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.6)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 25px rgba(6,182,212,0.25)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(6,182,212,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
            >
              {i > 0 && <div className="absolute -top-3 left-1/2 w-px h-3 opacity-20" style={{ background: "linear-gradient(to bottom,transparent,#06b6d4)" }} />}
              <PlatformIcon platform={link.platform} size={18} color="#06b6d4" />
              <span className="flex-1 text-sm font-medium text-center relative z-10" style={{ color: "#e0f2fe" }}>{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#06b6d4" }} />
            </motion.a>
          ))}
        </div>
        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
        <p className="mt-10 text-xs opacity-20 tracking-[0.4em]" style={{ color: "#06b6d4" }}>★ NOVAWEBDV</p>
      </div>

      <style>{`
        @keyframes nebulaBreath { 0%{opacity:0.6;transform:scale(1)} 100%{opacity:1;transform:scale(1.05)} }
        @keyframes cosmicSpin { to{transform:rotate(360deg)} }
        @keyframes starTwinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>
    </div>
  );
}

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    size: 1 + Math.random() * 2, duration: 2 + Math.random() * 4, delay: Math.random() * 5,
  }));
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`, borderRadius: "50%",
          background: "white", opacity: 0.4,
          animation: `starTwinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. SPOTLIGHT GLASS  — React Bits: Spotlight effect
      Moving radial spotlight follows a slow CSS animation
      True glassmorphism dark base
      Cover photo as ultra-dark bg
═══════════════════════════════════════════════════════════ */
export function SpotlightGlass({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 50, y: 30 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMouse({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div ref={ref} onMouseMove={handleMove} className="relative min-h-screen w-full overflow-hidden cursor-default"
      style={{ background: "#050508" }}>
      {profile.coverUrl && (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.1) saturate(1.2)",
        }} />
      )}
      {/* Dynamic spotlight */}
      <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-100" style={{
        background: `radial-gradient(ellipse 35% 35% at ${mouse.x}% ${mouse.y}%, rgba(99,102,241,0.18) 0%, transparent 70%)`
      }} />
      {/* Static ambient */}
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 50% 40% at 50% 10%, rgba(139,92,246,0.08) 0%, transparent 60%)"
      }} />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        <div className="mb-6 px-3 py-1.5 rounded-full text-xs tracking-widest" style={{
          background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "#a5b4fc"
        }}>
          <Sparkles className="inline w-3 h-3 mr-1" />SPOTLIGHT
        </div>

        {/* Avatar with spotlight ring */}
        <div className="relative mb-5">
          <div className="absolute -inset-1 rounded-full" style={{
            background: "conic-gradient(from 0deg,#6366f1,#8b5cf6,#a78bfa,#6366f1)",
            animation: "spinRing2 7s linear infinite", opacity: 0.6
          }} />
          <div className="absolute inset-0 rounded-full" style={{ background: "#050508", margin: "2px" }} />
          <div className="relative w-28 h-28 rounded-full overflow-hidden" style={{ margin: "2px",
            boxShadow: "0 0 40px rgba(99,102,241,0.35)"
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ background: "linear-gradient(135deg,#1e1b4b,#0f0d2e)", color: "#6366f1" }}>
                  {profile.displayName?.[0] ?? "?"}
                </div>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{
          background: "linear-gradient(135deg,#c7d2fe,#ffffff,#a5b4fc)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>{profile.displayName || "Name"}</h1>
        {profile.bio && <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "#64748b" }}>{profile.bio}</p>}
        {profile.location && <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "#818cf8" }}><MapPin className="w-3 h-3" />{profile.location}</p>}

        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300"
              style={{
                background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.18)",
                backdropFilter: "blur(20px)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.12)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.5)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(99,102,241,0.2)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.18)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <PlatformIcon platform={link.platform} size={18} color="#818cf8" />
              <span className="flex-1 text-sm font-medium text-center" style={{ color: "#e0e7ff" }}>{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#818cf8" }} />
            </motion.a>
          ))}
        </div>
        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
      </div>
      <style>{`@keyframes spinRing2 { to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   7. GRAVITY ORBS  — React Bits: floating gravity blobs
      Colorful bubbles drifting slowly
      Dark bg with vibrant orb colors
      Cover photo as dark bg
═══════════════════════════════════════════════════════════ */
export function GravityOrbs({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  const orbs = [
    { color: "#f43f5e", x: 10, y: 15, size: 180, dur: 14 },
    { color: "#8b5cf6", x: 75, y: 10, size: 220, dur: 18 },
    { color: "#0ea5e9", x: 20, y: 65, size: 160, dur: 12 },
    { color: "#10b981", x: 70, y: 70, size: 190, dur: 16 },
    { color: "#f59e0b", x: 50, y: 40, size: 140, dur: 20 },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#04060d" }}>
      {profile.coverUrl && (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.08) saturate(1)",
        }} />
      )}
      {/* Gravity orb blobs */}
      {orbs.map((o, i) => (
        <div key={i} className="absolute z-0 pointer-events-none" style={{
          left: `${o.x}%`, top: `${o.y}%`,
          width: `${o.size}px`, height: `${o.size}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle at 35% 35%, ${o.color}30, ${o.color}08)`,
          filter: "blur(40px)",
          animation: `orbFloat ${o.dur}s ${i * 2}s ease-in-out infinite alternate`,
        }} />
      ))}
      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        {/* Avatar */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 rounded-full" style={{
            background: "conic-gradient(from 0deg,#f43f5e,#8b5cf6,#0ea5e9,#10b981,#f59e0b,#f43f5e)",
            animation: "orbSpin 8s linear infinite", opacity: 0.7, filter: "blur(2px)"
          }} />
          <div className="absolute -inset-0.5 rounded-full" style={{ background: "#04060d" }} />
          <div className="relative w-28 h-28 rounded-full overflow-hidden" style={{
            boxShadow: "0 0 50px rgba(139,92,246,0.3)"
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ background: "linear-gradient(135deg,#1a0533,#0a0218)", color: "#8b5cf6" }}>
                  {profile.displayName?.[0] ?? "?"}
                </div>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{
          background: "linear-gradient(135deg,#fda4af,#c4b5fd,#7dd3fc)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
        }}>{profile.displayName || "Name"}</h1>
        {profile.bio && <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{profile.bio}</p>}
        {profile.location && <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "rgba(255,255,255,0.4)" }}><MapPin className="w-3 h-3" />{profile.location}</p>}

        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07, type: "spring" }}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
            >
              <PlatformIcon platform={link.platform} size={18} color="rgba(255,255,255,0.7)" />
              <span className="flex-1 text-sm font-medium text-center" style={{ color: "rgba(255,255,255,0.85)" }}>{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity text-white" />
            </motion.a>
          ))}
        </div>
        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
      </div>
      <style>{`
        @keyframes orbFloat { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(25px,30px) scale(1.1)} }
        @keyframes orbSpin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   8. NEON GRID  — React Bits: Pixel grid + neon glow
      Animated glowing grid lines
      Neon border cards
      Scanline effect
═══════════════════════════════════════════════════════════ */
export function NeonGrid({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#020510", fontFamily: "monospace" }}>
      {profile.coverUrl && (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.07) saturate(2) hue-rotate(120deg)",
        }} />
      )}
      {/* Grid */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: "linear-gradient(rgba(0,255,170,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,170,0.07) 1px,transparent 1px)",
        backgroundSize: "50px 50px",
        animation: "gridPulse 4s ease-in-out infinite alternate",
      }} />
      {/* Scanline */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg,rgba(0,0,0,0.15) 0px,rgba(0,0,0,0.15) 1px,transparent 1px,transparent 3px)",
      }} />
      {/* Neon radial center */}
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,255,170,0.07) 0%, transparent 70%)"
      }} />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        <div className="mb-6 text-xs tracking-[0.5em]" style={{ color: "rgba(0,255,170,0.6)" }}>
          [[ NEON GRID ]]
        </div>

        {/* Avatar — neon square */}
        <div className="relative mb-5">
          <div className="absolute -inset-1 rounded-lg" style={{
            background: "linear-gradient(135deg,#00ffaa,#00aaff,#aa00ff,#00ffaa)",
            backgroundSize: "200% 200%", animation: "neonShift 3s linear infinite",
            filter: "blur(1px)", opacity: 0.8
          }} />
          <div className="relative w-28 h-28 rounded-lg overflow-hidden" style={{
            boxShadow: "0 0 30px rgba(0,255,170,0.4), inset 0 0 10px rgba(0,255,170,0.1)"
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ background: "linear-gradient(135deg,#001a0d,#000d1a)", color: "#00ffaa" }}>
                  {profile.displayName?.[0] ?? "?"}
                </div>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1 uppercase tracking-widest" style={{
          color: "#00ffaa", textShadow: "0 0 20px rgba(0,255,170,0.6), 0 0 40px rgba(0,255,170,0.3)"
        }}>{profile.displayName || "Name"}</h1>
        {profile.bio && <p className="text-xs text-center max-w-xs mb-1 leading-relaxed" style={{ color: "rgba(0,255,170,0.5)" }}>{profile.bio}</p>}
        {profile.location && <p className="text-xs flex items-center gap-1 mb-6" style={{ color: "rgba(0,255,170,0.4)" }}><MapPin className="w-3 h-3" />{profile.location}</p>}

        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200"
              style={{
                background: "rgba(0,255,170,0.03)", border: "1px solid rgba(0,255,170,0.2)",
                backdropFilter: "blur(10px)"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,255,170,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,170,0.7)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(0,255,170,0.25), inset 0 0 10px rgba(0,255,170,0.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,255,170,0.03)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,255,170,0.2)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <PlatformIcon platform={link.platform} size={18} color="#00ffaa" />
              <span className="flex-1 text-sm font-bold text-center tracking-wider" style={{ color: "#00ffaa" }}>{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#00ffaa" }} />
            </motion.a>
          ))}
        </div>
        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
      </div>
      <style>{`
        @keyframes gridPulse { 0%{opacity:0.5} 100%{opacity:1} }
        @keyframes neonShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   9. ROSE GOLD LUXURY  — React Bits: Shimmer + foil
      Rose gold / champagne palette
      Animated foil shimmer on cards
      Soft noise texture
      Cover photo as glamour bg
═══════════════════════════════════════════════════════════ */
export function RoseGoldLuxury({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#0d0608" }}>
      {profile.coverUrl && (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.15) saturate(1.5) sepia(0.3)",
        }} />
      )}
      {/* Rose gold gradient */}
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(190,100,100,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(200,150,100,0.12) 0%, transparent 50%)"
      }} />
      {/* Sparkle particles */}
      <GoldParticles />

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        <div className="mb-6 text-xs tracking-[0.4em] opacity-60" style={{ color: "#e8b4b8", fontFamily: "serif" }}>
          ✦ ROSE GOLD ✦
        </div>

        {/* Avatar */}
        <div className="relative mb-5">
          <div className="absolute -inset-1 rounded-full" style={{
            background: "linear-gradient(135deg,#c9956b,#e8b4b8,#d4a0a0,#f5d0c0,#c9956b)",
            backgroundSize: "200% 200%", animation: "roseShift 5s ease-in-out infinite",
            filter: "blur(1px)"
          }} />
          <div className="relative w-28 h-28 rounded-full overflow-hidden" style={{
            boxShadow: "0 0 40px rgba(201,149,107,0.4), 0 0 80px rgba(232,180,184,0.15)"
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-bold"
                  style={{ background: "linear-gradient(135deg,#2d0f10,#1a0a0a)", color: "#e8b4b8" }}>
                  {profile.displayName?.[0] ?? "?"}
                </div>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{
          background: "linear-gradient(135deg,#f5d0c0,#ffffff,#e8b4b8,#c9956b)",
          backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "roseText 5s ease-in-out infinite", fontFamily: "serif"
        }}>{profile.displayName || "Name"}</h1>
        {profile.bio && <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "rgba(232,180,184,0.7)", fontFamily: "serif" }}>{profile.bio}</p>}
        {profile.location && <p className="text-xs flex items-center gap-1 mb-7" style={{ color: "rgba(201,149,107,0.7)" }}><MapPin className="w-3 h-3" />{profile.location}</p>}

        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="group relative flex items-center gap-3 w-full px-4 py-3 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(201,149,107,0.07)", border: "1px solid rgba(201,149,107,0.25)",
                backdropFilter: "blur(16px)", transition: "all 0.3s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(232,180,184,0.6)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(201,149,107,0.25)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,149,107,0.25)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              {/* Foil shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none" style={{
                background: "linear-gradient(90deg,transparent,rgba(245,208,192,0.12),transparent)",
                animation: "foilShimmer 1.5s infinite", transition: "opacity 0.3s"
              }} />
              <PlatformIcon platform={link.platform} size={18} color="#c9956b" />
              <span className="flex-1 text-sm font-medium text-center relative z-10" style={{ color: "#f5d0c0", fontFamily: "serif" }}>{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" style={{ color: "#c9956b" }} />
            </motion.a>
          ))}
        </div>
        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
        <p className="mt-10 text-[9px] opacity-20 tracking-[0.4em]" style={{ color: "#c9956b", fontFamily: "serif" }}>✦ LUXE ✦</p>
      </div>
      <style>{`
        @keyframes roseShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes roseText { 0%{background-position:0%} 100%{background-position:200%} }
        @keyframes foilShimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  );
}

function GoldParticles() {
  const sparks = Array.from({ length: 20 }, (_, i) => ({
    id: i, left: Math.random() * 100, top: Math.random() * 100,
    duration: 2 + Math.random() * 3, delay: Math.random() * 4, size: 2 + Math.random() * 3
  }));
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {sparks.map(s => (
        <div key={s.id} style={{
          position: "absolute", left: `${s.left}%`, top: `${s.top}%`,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(245,208,192,0.9),rgba(201,149,107,0.3))",
          animation: `sparkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   10. DEPTH BLUR  — React Bits: Depth of field / Bokeh
       Large soft bokeh orbs behind content
       Minimal clean text on top
       Cover photo blurred as bg
═══════════════════════════════════════════════════════════ */
export function DepthBlur({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  const bokeh = [
    { color: "#f43f5e", x: 5, y: 5, s: 300, op: 0.12, dur: 15 },
    { color: "#8b5cf6", x: 70, y: -10, s: 250, op: 0.14, dur: 12 },
    { color: "#0ea5e9", x: -10, y: 60, s: 280, op: 0.11, dur: 18 },
    { color: "#10b981", x: 65, y: 65, s: 240, op: 0.1, dur: 14 },
    { color: "#f59e0b", x: 40, y: 30, s: 200, op: 0.09, dur: 20 },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: "#07070f" }}>
      {profile.coverUrl && (
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `url(${profile.coverUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.1) blur(8px) saturate(1.4)",
        }} />
      )}
      {/* Bokeh spheres */}
      {bokeh.map((b, i) => (
        <div key={i} className="absolute z-0 pointer-events-none" style={{
          left: `${b.x}%`, top: `${b.y}%`,
          width: `${b.s}px`, height: `${b.s}px`,
          borderRadius: "50%",
          background: `radial-gradient(circle,${b.color}${Math.round(b.op * 255).toString(16).padStart(2, "0")},transparent 70%)`,
          filter: "blur(50px)",
          animation: `bokehDrift ${b.dur}s ${i * 2}s ease-in-out infinite alternate`,
        }} />
      ))}

      <div className="relative z-10 flex flex-col items-center px-4 py-10 min-h-screen">
        {/* Avatar with heavy blur ring */}
        <div className="relative mb-5">
          <div className="absolute -inset-4 rounded-full opacity-40" style={{
            background: "radial-gradient(circle,rgba(255,255,255,0.3),transparent 70%)",
            filter: "blur(16px)",
            animation: "bokehPulse 4s ease-in-out infinite"
          }} />
          <div className="relative w-28 h-28 rounded-full overflow-hidden" style={{
            border: "2px solid rgba(255,255,255,0.15)",
            boxShadow: "0 0 40px rgba(255,255,255,0.08)"
          }}>
            {profile.avatarUrl
              ? <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                  style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}>
                  {profile.displayName?.[0] ?? "?"}
                </div>}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-white mb-1" style={{
          textShadow: "0 0 40px rgba(255,255,255,0.3)"
        }}>{profile.displayName || "Name"}</h1>
        {profile.bio && <p className="text-sm text-center max-w-xs mb-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{profile.bio}</p>}
        {profile.location && <p className="text-xs flex items-center gap-1 mb-6 text-white opacity-40"><MapPin className="w-3 h-3" />{profile.location}</p>}

        <div className="w-full max-w-xs space-y-3">
          {links.map((link, i) => (
            <motion.a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              <PlatformIcon platform={link.platform} size={18} color="rgba(255,255,255,0.65)" />
              <span className="flex-1 text-sm font-medium text-center text-white">{link.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity text-white" />
            </motion.a>
          ))}
        </div>
        <ContactRow profile={profile} copiedId={copiedId} copy={copy} />
      </div>
      <style>{`
        @keyframes bokehDrift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(30px,25px) scale(1.15)} }
        @keyframes bokehPulse { 0%,100%{opacity:0.3} 50%{opacity:0.6} }
      `}</style>
    </div>
  );
}
