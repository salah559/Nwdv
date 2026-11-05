import React, { useState, useRef } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Check, Flame, Sparkles, Zap } from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

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
   1. BARYON ANIME LIVE (من رابط بنترست بالفيديو الحي والصورة)
───────────────────────────────────────────────────────── */
export function BaryonAnimeLive({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white font-sans">
      {/* Background Video from Pinterest */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="https://i.pinimg.com/736x/6d/0b/91/6d0b91e0dec528e44d5557a8b38ab443.jpg"
          className="w-full h-full object-cover opacity-60 scale-105 filter contrast-125 brightness-90"
        >
          <source
            src="https://v1.pinimg.com/videos/iht/expMp4/c5/bd/96/c5bd96c396dee7bb710d03461cfd94a9_720w.mp4"
            type="video/mp4"
          />
        </video>
        {/* Fire energy overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-orange-950/20 to-black/80" />
      </div>

      {/* Fiery particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-t from-orange-500 to-amber-300 blur-[1px] animate-pulse"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 14 + 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 40}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-12 min-h-screen max-w-lg mx-auto">
        {/* Anime badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 border border-orange-500/50 text-orange-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(234,88,12,0.4)] backdrop-blur-md">
          <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
          <span>Baryon Mode Anime</span>
        </div>

        {/* Glowing Fire Avatar */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-red-600 blur-md opacity-80 group-hover:opacity-100 animate-spin" style={{ animationDuration: "8s" }} />
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-orange-400/80 shadow-[0_0_25px_rgba(249,115,22,0.8)] bg-black">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-black text-orange-400 bg-zinc-900">
                {profile.displayName?.[0] ?? "A"}
              </div>
            )}
          </div>
        </div>

        {/* Name & Bio */}
        <h1 className="text-3xl font-black text-center mb-1 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-red-500 drop-shadow-[0_2px_15px_rgba(249,115,22,0.6)]">
          {profile.displayName || "Anime Master"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center text-zinc-300 max-w-xs mb-2 font-medium leading-relaxed drop-shadow">
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs text-orange-400/90 flex items-center gap-1.5 mb-6 font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            {profile.location}
          </p>
        )}

        {/* Links with fiery glow border */}
        <div className="w-full space-y-3.5 mb-8">
          {links.map((link, idx) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="group relative flex items-center justify-between w-full px-5 py-3.5 rounded-2xl bg-black/60 border border-orange-500/30 backdrop-blur-xl hover:border-orange-400 hover:bg-orange-950/40 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-black transition-colors duration-300">
                  <PlatformIcon platform={link.platform} size={18} />
                </div>
                <span className="font-bold text-sm text-zinc-100 group-hover:text-orange-200 transition-colors">
                  {link.title}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-orange-400/60 group-hover:text-orange-300 group-hover:translate-x-0.5 transition-all relative z-10" />
              {/* Fiery shine on hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-orange-400/10 to-transparent" />
            </motion.a>
          ))}
        </div>

        {/* Contact actions */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-950/40 border border-orange-500/30 text-orange-300 hover:border-orange-400 transition-all backdrop-blur-md"
            >
              {copiedId === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
              <span>{profile.email}</span>
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-950/40 border border-orange-500/30 text-orange-300 hover:border-orange-400 transition-all backdrop-blur-md"
            >
              {copiedId === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Phone className="w-3.5 h-3.5" />}
              <span>{profile.phone}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   2. CUSTOM WALLPAPER HERO (خلفية الزبون هي الخلفية الكاملة)
───────────────────────────────────────────────────────── */
export function CustomWallpaperHero({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white font-sans">
      {/* Full Cover Background */}
      {profile.coverUrl ? (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 filter brightness-75 scale-105"
          style={{ backgroundImage: `url(${profile.coverUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950" />
      )}

      {/* Cinematic dark gradients for legibility */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-black/60 to-black/95 backdrop-blur-[2px]" />

      <div className="relative z-10 flex flex-col items-center px-4 py-14 min-h-screen max-w-md mx-auto justify-center">
        {/* Diamond badge */}
        <div className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-2xl">
          💎 Custom Wallpaper Master
        </div>

        {/* Avatar with luxury frosted border */}
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-2 border-white/40 shadow-[0_15px_35px_rgba(0,0,0,0.6)] bg-white/10 backdrop-blur-2xl p-1">
            <div className="w-full h-full rounded-[22px] overflow-hidden bg-zinc-900">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-white">
                  {profile.displayName?.[0] ?? "U"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile info */}
        <h1 className="text-3xl font-extrabold text-center mb-1 text-white drop-shadow-md">
          {profile.displayName || "My Profile"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center text-zinc-200 max-w-xs mb-2 leading-relaxed drop-shadow font-normal">
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs text-zinc-300 flex items-center gap-1.5 mb-7 drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            {profile.location}
          </p>
        )}

        {/* Floating frosted glass links */}
        <div className="w-full space-y-3 mb-8">
          {links.map((link, idx) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="group flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-xl shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <PlatformIcon platform={link.platform} size={20} color="#ffffff" />
                <span className="font-semibold text-sm text-white">{link.title}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
            </motion.a>
          ))}
        </div>

        {/* Contact actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/40 border border-white/20 text-white hover:bg-black/60 transition-all backdrop-blur-xl"
            >
              {copiedId === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
              <span>{profile.email}</span>
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-black/40 border border-white/20 text-white hover:bg-black/60 transition-all backdrop-blur-xl"
            >
              {copiedId === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Phone className="w-3.5 h-3.5" />}
              <span>{profile.phone}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   3. REACTBITS SPOTLIGHT BENTO (تأثير شعاع الضوء التفاعلي)
───────────────────────────────────────────────────────── */
export function ReactBitsSpotlight({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];
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
      className="relative min-h-screen w-full overflow-hidden bg-[#070709] text-white font-sans py-14 px-4 flex flex-col items-center justify-center"
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

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono mb-6">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>ReactBits Spotlight</span>
        </div>

        {/* Avatar with spotlight ring */}
        <div className="relative mb-4">
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 blur opacity-75 animate-pulse" />
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-violet-400/60 bg-zinc-950 shadow-2xl">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-violet-400">
                {profile.displayName?.[0] ?? "S"}
              </div>
            )}
          </div>
        </div>

        {/* Name & Bio */}
        <h1 className="text-3xl font-extrabold text-center mb-1 text-white tracking-tight">
          {profile.displayName || "Spotlight Creator"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center text-zinc-400 max-w-xs mb-2 leading-relaxed">
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs text-violet-400 flex items-center gap-1 mb-6 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            {profile.location}
          </p>
        )}

        {/* Bento Interactive Cards */}
        <div className="w-full space-y-3 mb-8">
          {links.map((link, idx) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-violet-500/60 transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-black transition-all">
                  <PlatformIcon platform={link.platform} size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-100 group-hover:text-violet-200 transition-colors">
                    {link.title}
                  </h4>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-violet-300 transition-colors relative z-10" />
              {/* Card internal subtle highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          ))}
        </div>

        {/* Contact actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-violet-500/50 transition-all"
            >
              {copiedId === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-violet-400" />}
              <span>{profile.email}</span>
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-violet-500/50 transition-all"
            >
              {copiedId === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Phone className="w-3.5 h-3.5 text-violet-400" />}
              <span>{profile.phone}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   4. REACTBITS AURORA MESH (شفق قطبي مائع ثلاثي الأبعاد)
───────────────────────────────────────────────────────── */
export function ReactBitsAuroraMesh({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white font-sans py-14 px-4 flex flex-col items-center justify-center">
      {/* ReactBits Aurora Mesh Animation */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[30%] -left-[10%] w-[120%] h-[120%] rounded-full opacity-35 filter blur-[100px] animate-spin"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, #38bdf8 0deg, #818cf8 90deg, #c084fc 180deg, #34d399 270deg, #38bdf8 360deg)",
            animationDuration: "25s",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/70 to-[#030712]" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Badge */}
        <div className="px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-xl">
          🌌 Aurora Mesh Gradient
        </div>

        {/* Morphing Avatar */}
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_35px_rgba(56,189,248,0.5)] bg-zinc-900 p-1">
            <div className="w-full h-full rounded-full overflow-hidden">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black text-cyan-400 bg-zinc-950">
                  {profile.displayName?.[0] ?? "A"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name & Bio */}
        <h1 className="text-3xl font-black text-center mb-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-emerald-300">
          {profile.displayName || "Aurora Mind"}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center text-zinc-300 max-w-xs mb-2 leading-relaxed">
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-xs text-cyan-400 flex items-center gap-1.5 mb-7">
            <MapPin className="w-3.5 h-3.5" />
            {profile.location}
          </p>
        )}

        {/* Glass Aurora Links */}
        <div className="w-full space-y-3 mb-8">
          {links.map((link, idx) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
              className="group flex items-center justify-between w-full px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-400/50 backdrop-blur-2xl shadow-xl hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <PlatformIcon platform={link.platform} size={20} color="#38bdf8" />
                <span className="font-semibold text-sm text-zinc-100 group-hover:text-cyan-200 transition-colors">
                  {link.title}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-cyan-400/60 group-hover:text-cyan-300 transition-colors" />
            </motion.a>
          ))}
        </div>

        {/* Contact actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-all backdrop-blur-xl"
            >
              {copiedId === "email" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5" />}
              <span>{profile.email}</span>
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-all backdrop-blur-xl"
            >
              {copiedId === "phone" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Phone className="w-3.5 h-3.5" />}
              <span>{profile.phone}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   5. CYBERPUNK HOLOGRAPHIC HUD (مستقبلي هولوغرافي متقدم)
───────────────────────────────────────────────────────── */
export function CyberpunkHologramHUD({ profile }: { profile: UserProfile }) {
  const { copiedId, copy } = useCopy();
  const links = profile.links?.filter((l) => l.isActive) ?? [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#05090e] text-cyan-400 font-mono py-14 px-4 flex flex-col items-center justify-center">
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

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* HUD Header Status */}
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-500/50 rounded text-[11px] text-cyan-300 mb-6 tracking-widest uppercase">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>STATUS: ONLINE // SYS_HUD.v3</span>
        </div>

        {/* Hologram Avatar Frame */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 border-2 border-cyan-400/40 border-dashed rounded-2xl animate-spin" style={{ animationDuration: "16s" }} />
          <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.4)] bg-black">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full h-full object-cover filter contrast-125" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-cyan-400">
                {profile.displayName?.[0] ?? "H"}
              </div>
            )}
          </div>
        </div>

        {/* Name & Bio */}
        <h1 className="text-2xl font-black text-center mb-1 text-white tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]">
          {profile.displayName || "CYBER_AGENT"}
        </h1>
        {profile.bio && (
          <p className="text-xs text-center text-cyan-300/80 max-w-xs mb-2 leading-relaxed">
            {profile.bio}
          </p>
        )}
        {profile.location && (
          <p className="text-[11px] text-cyan-500 flex items-center gap-1.5 mb-7">
            <MapPin className="w-3 h-3" />
            {profile.location}
          </p>
        )}

        {/* HUD Action Cards */}
        <div className="w-full space-y-3 mb-8">
          {links.map((link, idx) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="group flex items-center justify-between w-full px-4 py-3 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 hover:border-cyan-400 rounded-lg backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-cyan-500 font-bold">[{idx + 1}]</span>
                <PlatformIcon platform={link.platform} size={18} color="#00f0ff" />
                <span className="font-bold text-xs tracking-wider text-zinc-100 group-hover:text-cyan-200 uppercase">
                  {link.title}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400/60 group-hover:text-cyan-300 transition-colors" />
            </motion.a>
          ))}
        </div>

        {/* Contact actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {profile.email && (
            <button
              onClick={() => copy(profile.email!, "email")}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 border border-cyan-500/40 text-[11px] text-cyan-300 hover:border-cyan-400 transition-all"
            >
              {copiedId === "email" ? <Check className="w-3 h-3 text-emerald-400" /> : <Mail className="w-3 h-3 text-cyan-400" />}
              <span>{profile.email}</span>
            </button>
          )}
          {profile.phone && (
            <button
              onClick={() => copy(profile.phone!, "phone")}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-black/60 border border-cyan-500/40 text-[11px] text-cyan-300 hover:border-cyan-400 transition-all"
            >
              {copiedId === "phone" ? <Check className="w-3 h-3 text-emerald-400" /> : <Phone className="w-3 h-3 text-cyan-400" />}
              <span>{profile.phone}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
