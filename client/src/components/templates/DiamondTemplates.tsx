import React, { useState, useRef } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Check, 
  Copy, 
  Flame, 
  Sparkles, 
  Zap,
  Globe,
  Share2
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

function useShareCopy(profile: UserProfile) {
  const [copied, setCopied] = useState(false);
  const copyProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return { copied, copyProfile };
}

/* ─────────────────────────────────────────────────────────
   1. BARYON ANIME LIVE (من رابط بنترست بالفيديو الحي والصورة)
───────────────────────────────────────────────────────── */
export function BaryonAnimeLive({ profile }: { profile: UserProfile }) {
  const { copied, copyProfile } = useShareCopy(profile);
  const activeLinks = (profile.socialLinks || []).filter((l) => l.enabled);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans selection:bg-orange-500/30">
      {/* Background Video from Pinterest */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://i.pinimg.com/736x/6d/0b/91/6d0b91e0dec528e44d5557a8b38ab443.jpg"
          className="w-full h-full object-cover opacity-65 scale-105 filter contrast-125 brightness-95"
        >
          <source
            src="https://v1.pinimg.com/videos/iht/expMp4/c5/bd/96/c5bd96c396dee7bb710d03461cfd94a9_720w.mp4"
            type="video/mp4"
          />
        </video>
        {/* Fire energy overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-orange-950/25 to-black/85" />
      </div>

      {/* Floating Fiery Embers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 blur-[1px] animate-pulse"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 12 + 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 50}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12 min-h-screen max-w-md mx-auto">
        {/* Top Control Bar with Share */}
        <div className="w-full flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-600/20 border border-orange-500/50 text-orange-400 text-[11px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(234,88,12,0.4)] backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
            <span>Baryon Anime</span>
          </div>

          <button
            onClick={copyProfile}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-orange-500/30 hover:border-orange-400 text-xs text-orange-200 transition-all backdrop-blur-md"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-orange-400" />}
            <span>{copied ? "تم النسخ" : "مشاركة"}</span>
          </button>
        </div>

        {/* Glowing Fire Avatar */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 blur-md opacity-80 group-hover:opacity-100 animate-spin" style={{ animationDuration: "8s" }} />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.8)] bg-black">
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={profile.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          {profile.username && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/90 border border-orange-500/50 text-[10px] font-mono text-orange-300 whitespace-nowrap shadow-md">
              @{profile.username}
            </div>
          )}
        </div>

        {/* Full Name */}
        <h1 className="text-2xl sm:text-3xl font-black text-center mb-1 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-red-500 drop-shadow-[0_2px_15px_rgba(249,115,22,0.6)]">
          {profile.fullName || "Anime Master"}
        </h1>

        {/* Job Title */}
        {profile.jobTitle && (
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300/90 mb-2 drop-shadow">
            {profile.jobTitle}
          </p>
        )}

        {/* Location (المنطقة) */}
        {profile.location && (
          <div className="flex items-center gap-1.5 text-xs text-orange-300/90 bg-orange-950/50 px-3 py-1 rounded-full border border-orange-500/30 mb-3 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{profile.location}</span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm text-center text-zinc-200/90 max-w-sm mb-5 leading-relaxed drop-shadow font-normal px-2">
            {profile.bio}
          </p>
        )}

        {/* Direct Action Chips (Email, WhatsApp, Phone, Website) */}
        {(profile.email || profile.whatsapp || profile.phone || profile.website) && (
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap w-full">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3.5 py-1.5 rounded-xl bg-orange-950/40 border border-orange-500/40 hover:border-orange-400 hover:bg-orange-900/40 text-xs font-semibold text-orange-200 transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm"
              >
                <Mail className="w-3.5 h-3.5 text-orange-400" />
                <span>إيميل</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/40 text-xs font-semibold text-emerald-300 transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm"
              >
                <PlatformIcon platform="whatsapp" className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-3.5 py-1.5 rounded-xl bg-orange-950/40 border border-orange-500/40 hover:border-orange-400 hover:bg-orange-900/40 text-xs font-semibold text-orange-200 transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>اتصال</span>
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/40 hover:border-amber-400 hover:bg-amber-900/40 text-xs font-semibold text-amber-200 transition-all flex items-center gap-1.5 backdrop-blur-md shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>موقع</span>
              </a>
            )}
          </div>
        )}

        {/* Links List with fiery borders */}
        <div className="w-full space-y-3 mb-8">
          {activeLinks.map((link, idx) => (
            <motion.a
              key={link.id || idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl bg-black/65 border border-orange-500/35 backdrop-blur-xl hover:border-orange-400 hover:bg-orange-950/45 hover:shadow-[0_0_30px_rgba(249,115,22,0.45)] transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center p-2 shrink-0 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-black transition-all">
                  <PlatformIcon platform={link.platform} className="w-5 h-5 text-orange-300 group-hover:text-black" />
                </div>
                <div className="truncate">
                  <span className="font-bold text-sm text-zinc-100 group-hover:text-orange-200 transition-colors block truncate">
                    {link.title}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
                <ExternalLink className="w-4 h-4 text-orange-400" />
              </div>
              {/* Fiery shine on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-orange-400/15 to-transparent" />
            </motion.a>
          ))}
        </div>

        {/* Powered by */}
        <div className="mt-auto pt-4 text-center">
          <a
            href="https://novawebdv.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-orange-400/60 hover:text-orange-300 transition-colors"
          >
            {profile.username}.novawebdv.com
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   2. CUSTOM WALLPAPER HERO (خلفية الزبون كاملة الشاشة)
───────────────────────────────────────────────────────── */
export function CustomWallpaperHero({ profile }: { profile: UserProfile }) {
  const { copied, copyProfile } = useShareCopy(profile);
  const activeLinks = (profile.socialLinks || []).filter((l) => l.enabled);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white font-sans selection:bg-white/20">
      {/* Full Cover Background */}
      {profile.coverUrl ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 filter brightness-75 scale-105"
          style={{ backgroundImage: `url(${profile.coverUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950" />
      )}

      {/* Cinematic dark gradients for crystal-clear readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95 backdrop-blur-[2px]" />

      <div className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12 min-h-screen max-w-md mx-auto">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between mb-6 px-1">
          <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-white text-[11px] font-bold tracking-widest uppercase shadow-xl">
            💎 Wallpaper Hero
          </div>
          <button
            onClick={copyProfile}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 border border-white/20 text-xs text-white transition-all backdrop-blur-md"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-white" />}
            <span>{copied ? "تم النسخ" : "مشاركة"}</span>
          </button>
        </div>

        {/* Avatar with luxury frosted border */}
        <div className="relative mb-4 group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-white/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)] bg-white/10 backdrop-blur-2xl p-1">
            <div className="w-full h-full rounded-[20px] overflow-hidden bg-zinc-900">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {profile.username && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/80 border border-white/20 text-[10px] font-mono text-zinc-300 whitespace-nowrap shadow-md">
              @{profile.username}
            </div>
          )}
        </div>

        {/* Full Name */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-1 text-white drop-shadow-md">
          {profile.fullName || "My Profile"}
        </h1>

        {/* Job Title */}
        {profile.jobTitle && (
          <p className="text-xs sm:text-sm font-medium text-zinc-200 tracking-wide mb-2 drop-shadow">
            {profile.jobTitle}
          </p>
        )}

        {/* Location (المنطقة) */}
        {profile.location && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-200 bg-white/10 px-3 py-1 rounded-full border border-white/15 mb-3 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{profile.location}</span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm text-center text-zinc-200/90 max-w-sm mb-5 leading-relaxed drop-shadow font-normal px-2">
            {profile.bio}
          </p>
        )}

        {/* Direct Action Chips (Email, WhatsApp, Phone, Website) */}
        {(profile.email || profile.whatsapp || profile.phone || profile.website) && (
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap w-full">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5 backdrop-blur-md"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>إيميل</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 hover:bg-emerald-500/30 text-xs font-semibold text-emerald-300 transition-all flex items-center gap-1.5 backdrop-blur-md"
              >
                <PlatformIcon platform="whatsapp" className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5 backdrop-blur-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>اتصال</span>
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all flex items-center gap-1.5 backdrop-blur-md"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>موقع</span>
              </a>
            )}
          </div>
        )}

        {/* Floating frosted glass links */}
        <div className="w-full space-y-3 mb-8">
          {activeLinks.map((link, idx) => (
            <motion.a
              key={link.id || idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform">
                  <PlatformIcon platform={link.platform} className="w-5 h-5 text-white" />
                </div>
                <div className="truncate">
                  <span className="font-semibold text-sm text-white block truncate">
                    {link.title}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white transition-colors shrink-0" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 text-center">
          <a
            href="https://novawebdv.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
          >
            {profile.username}.novawebdv.com
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   3. REACTBITS SPOTLIGHT BENTO (شعاع الضوء التفاعلي)
───────────────────────────────────────────────────────── */
export function ReactBitsSpotlight({ profile }: { profile: UserProfile }) {
  const { copied, copyProfile } = useShareCopy(profile);
  const activeLinks = (profile.socialLinks || []).filter((l) => l.enabled);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden bg-[#070709] text-white font-sans py-8 sm:py-12 px-4 flex flex-col items-center justify-between"
    >
      {/* ReactBits Dynamic Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 500px at ${pos.x}% ${pos.y}%, rgba(120, 119, 198, 0.22), transparent 80%)`,
        }}
      />

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, #4f4f4f2e 1px, transparent 1px), linear-gradient(to bottom, #4f4f4f2e 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center flex-1">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between mb-6 px-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Spotlight Bento</span>
          </div>
          <button
            onClick={copyProfile}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-violet-400" />}
            <span>{copied ? "تم النسخ" : "مشاركة"}</span>
          </button>
        </div>

        {/* Avatar with spotlight ring */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 blur opacity-75 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-violet-400/60 bg-zinc-950 shadow-2xl">
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={profile.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          {profile.username && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-zinc-900 border border-violet-500/40 text-[10px] font-mono text-violet-300 whitespace-nowrap shadow-md">
              @{profile.username}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-1 text-white tracking-tight">
          {profile.fullName || "Spotlight Creator"}
        </h1>

        {/* Job Title */}
        {profile.jobTitle && (
          <p className="text-xs sm:text-sm font-semibold text-violet-300 uppercase tracking-wider mb-2">
            {profile.jobTitle}
          </p>
        )}

        {/* Location (المنطقة) */}
        {profile.location && (
          <div className="flex items-center gap-1.5 text-xs text-violet-300/90 bg-violet-950/40 px-3 py-1 rounded-full border border-violet-500/30 mb-3 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-violet-400" />
            <span>{profile.location}</span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm text-center text-zinc-400 max-w-sm mb-5 leading-relaxed px-2">
            {profile.bio}
          </p>
        )}

        {/* Direct Action Chips */}
        {(profile.email || profile.whatsapp || profile.phone || profile.website) && (
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap w-full">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 text-xs font-mono text-zinc-200 transition-all flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-violet-400" />
                <span>إيميل</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs font-mono text-emerald-400 transition-all flex items-center gap-1.5"
              >
                <PlatformIcon platform="whatsapp" className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 text-xs font-mono text-zinc-200 transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-violet-400" />
                <span>اتصال</span>
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 text-xs font-mono text-zinc-200 transition-all flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-violet-400" />
                <span>موقع</span>
              </a>
            )}
          </div>
        )}

        {/* Bento Interactive Cards */}
        <div className="w-full space-y-3 mb-8">
          {activeLinks.map((link, idx) => (
            <motion.a
              key={link.id || idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-violet-500/60 transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center p-2 shrink-0 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-black transition-all">
                  <PlatformIcon platform={link.platform} className="w-5 h-5 text-violet-300 group-hover:text-black" />
                </div>
                <div className="truncate">
                  <span className="font-bold text-sm text-zinc-100 group-hover:text-violet-200 transition-colors block truncate">
                    {link.title}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-violet-300 transition-colors relative z-10 shrink-0" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 text-center">
          <a
            href="https://novawebdv.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {profile.username}.novawebdv.com
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   4. REACTBITS AURORA MESH (شفق قطبي مائع ثلاثي الأبعاد)
───────────────────────────────────────────────────────── */
export function ReactBitsAuroraMesh({ profile }: { profile: UserProfile }) {
  const { copied, copyProfile } = useShareCopy(profile);
  const activeLinks = (profile.socialLinks || []).filter((l) => l.enabled);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white font-sans py-8 sm:py-12 px-4 flex flex-col items-center justify-between">
      {/* ReactBits Aurora Mesh Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[30%] -left-[10%] w-[120%] h-[120%] rounded-full opacity-35 filter blur-[100px] animate-spin"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, #38bdf8 0deg, #818cf8 90deg, #c084fc 180deg, #34d399 270deg, #38bdf8 360deg)",
            animationDuration: "25s",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/75 to-[#030712]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center flex-1">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between mb-6 px-1">
          <div className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-widest uppercase backdrop-blur-xl">
            🌌 Aurora Mesh
          </div>
          <button
            onClick={copyProfile}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 text-xs text-cyan-200 transition-all backdrop-blur-md"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? "تم النسخ" : "مشاركة"}</span>
          </button>
        </div>

        {/* Morphing Avatar */}
        <div className="relative mb-4 group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_35px_rgba(56,189,248,0.5)] bg-zinc-900 p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {profile.username && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#030712] border border-cyan-400/40 text-[10px] font-mono text-cyan-300 whitespace-nowrap shadow-md">
              @{profile.username}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-2xl sm:text-3xl font-black text-center mb-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-emerald-300">
          {profile.fullName || "Aurora Mind"}
        </h1>

        {/* Job Title */}
        {profile.jobTitle && (
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-cyan-200/90 mb-2">
            {profile.jobTitle}
          </p>
        )}

        {/* Location (المنطقة) */}
        {profile.location && (
          <div className="flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-400/30 mb-3 backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>{profile.location}</span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm text-center text-zinc-300 max-w-sm mb-5 leading-relaxed px-2">
            {profile.bio}
          </p>
        )}

        {/* Direct Action Chips */}
        {(profile.email || profile.whatsapp || profile.phone || profile.website) && (
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap w-full">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-cyan-200 transition-all flex items-center gap-1.5 backdrop-blur-xl"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>إيميل</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-xs font-medium text-emerald-300 transition-all flex items-center gap-1.5 backdrop-blur-xl"
              >
                <PlatformIcon platform="whatsapp" className="w-3.5 h-3.5" />
                <span>واتساب</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-cyan-200 transition-all flex items-center gap-1.5 backdrop-blur-xl"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>اتصال</span>
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 text-xs font-medium text-cyan-200 transition-all flex items-center gap-1.5 backdrop-blur-xl"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>موقع</span>
              </a>
            )}
          </div>
        )}

        {/* Glass Aurora Links */}
        <div className="w-full space-y-3 mb-8">
          {activeLinks.map((link, idx) => (
            <motion.a
              key={link.id || idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex items-center justify-between w-full p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-400/50 backdrop-blur-2xl shadow-xl hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform">
                  <PlatformIcon platform={link.platform} className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="truncate">
                  <span className="font-semibold text-sm text-zinc-100 group-hover:text-cyan-200 transition-colors block truncate">
                    {link.title}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-cyan-400/60 group-hover:text-cyan-300 transition-colors shrink-0" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 text-center">
          <a
            href="https://novawebdv.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-cyan-400/60 hover:text-cyan-300 transition-colors"
          >
            {profile.username}.novawebdv.com
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   5. CYBERPUNK HOLOGRAPHIC HUD (واجهة سايبرنتك هولوغرافية)
───────────────────────────────────────────────────────── */
export function CyberpunkHologramHUD({ profile }: { profile: UserProfile }) {
  const { copied, copyProfile } = useShareCopy(profile);
  const activeLinks = (profile.socialLinks || []).filter((l) => l.enabled);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05090e] text-cyan-400 font-mono py-8 sm:py-12 px-4 flex flex-col items-center justify-between selection:bg-cyan-500/30">
      {/* Sci-Fi HUD Grid & Scanlines */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #00f0ff 0, #00f0ff 1px, transparent 1px, transparent 4px)",
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(#00f0ff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center flex-1">
        {/* HUD Top Control Bar */}
        <div className="w-full flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500/50 rounded text-[11px] text-cyan-300 tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>SYS_HUD.v3</span>
          </div>

          <button
            onClick={copyProfile}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-xs text-cyan-300 hover:border-cyan-400 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? "COPIED" : "SHARE"}</span>
          </button>
        </div>

        {/* Hologram Avatar Frame */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-2 border-2 border-cyan-400/40 border-dashed rounded-2xl animate-spin" style={{ animationDuration: "16s" }} />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] bg-black">
            <img
              src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
              alt={profile.fullName}
              className="w-full h-full object-cover filter contrast-125"
            />
          </div>
          {profile.username && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-black border border-cyan-400 text-[10px] text-cyan-300 whitespace-nowrap shadow-md">
              USR://{profile.username}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="text-2xl sm:text-3xl font-black text-center mb-1 text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
          {profile.fullName || "CYBER_AGENT"}
        </h1>

        {/* Job Title */}
        {profile.jobTitle && (
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-300/90 mb-2">
            [{profile.jobTitle}]
          </p>
        )}

        {/* Location (المنطقة) */}
        {profile.location && (
          <div className="flex items-center gap-1.5 text-xs text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/40 mb-3">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>LOC: {profile.location}</span>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-sm text-center text-cyan-300/80 max-w-sm mb-5 leading-relaxed px-2">
            {profile.bio}
          </p>
        )}

        {/* Direct Action Chips */}
        {(profile.email || profile.whatsapp || profile.phone || profile.website) && (
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap w-full">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3 py-1.5 rounded bg-black/60 border border-cyan-500/40 hover:border-cyan-400 text-xs text-cyan-300 transition-all flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>EMAIL</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-black/60 border border-emerald-500/40 hover:border-emerald-400 text-xs text-emerald-400 transition-all flex items-center gap-1.5"
              >
                <PlatformIcon platform="whatsapp" className="w-3.5 h-3.5" />
                <span>WHATSAPP</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-3 py-1.5 rounded bg-black/60 border border-cyan-500/40 hover:border-cyan-400 text-xs text-cyan-300 transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>CALL</span>
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-black/60 border border-cyan-500/40 hover:border-cyan-400 text-xs text-cyan-300 transition-all flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>WEB</span>
              </a>
            )}
          </div>
        )}

        {/* HUD Action Cards (التطبيقات والروابط) */}
        <div className="w-full space-y-3 mb-8">
          {activeLinks.map((link, idx) => (
            <motion.a
              key={link.id || idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group flex items-center justify-between w-full p-3.5 sm:p-4 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/35 hover:border-cyan-400 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-200"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="text-xs text-cyan-500 font-bold shrink-0">[{idx + 1}]</span>
                <div className="w-9 h-9 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform">
                  <PlatformIcon platform={link.platform} className="w-4 h-4 text-cyan-300" />
                </div>
                <div className="truncate">
                  <span className="font-bold text-xs tracking-wider text-zinc-100 group-hover:text-cyan-200 uppercase block truncate">
                    {link.title}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400/60 group-hover:text-cyan-300 transition-colors shrink-0" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 text-center">
          <a
            href="https://novawebdv.com"
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-cyan-500/60 hover:text-cyan-400 transition-colors"
          >
            {profile.username}.novawebdv.com
          </a>
        </div>
      </div>
    </div>
  );
}
