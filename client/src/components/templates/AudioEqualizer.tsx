import React, { useState } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Disc3, 
  Play, 
  Pause, 
  Volume2, 
  ExternalLink, 
  Copy, 
  Check, 
  Radio, 
  Headphones, 
  Music2, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  Share2
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function AudioEqualizer({ profile }: { profile: UserProfile }) {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Studio Ambient Lights */}
      <div className="fixed -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/20 via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-t from-purple-600/20 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto pt-4 sm:pt-8 pb-12 flex-1"
      >
        {/* Main Turntable Deck Container */}
        <div className="relative rounded-[32px] bg-[#12131c]/90 border border-white/10 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Subtle Deck Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Top Audio Player Status Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 relative z-10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-mono text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                ON AIR • 44.1 kHz
              </span>
            </div>
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-gray-300 hover:text-white transition-all font-mono"
              title="Share Studio Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
          </div>

          {/* Vinyl Record Visualizer Centerpiece */}
          <div className="flex flex-col items-center text-center relative z-10 mb-6">
            <div className="relative mb-6">
              {/* Spinning Vinyl Record Disk */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#050507] border-4 border-[#22232e] shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center justify-center relative p-3"
              >
                {/* Vinyl Grooves (Concentric Circles) */}
                <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-4 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-6 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />

                {/* Center Label Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-emerald-400/80 p-0.5 shadow-inner relative z-10">
                  <img
                    src={profile.avatarUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80"}
                    alt={profile.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {/* Center Spindle Hole */}
                  <div className="absolute inset-0 m-auto w-3.5 h-3.5 bg-[#0a0a0f] rounded-full border border-white/30 shadow-md" />
                </div>
              </motion.div>

              {/* Play/Pause Toggle Pill */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] shadow-lg flex items-center gap-1.5 transition-all"
              >
                {isPlaying ? <Pause className="w-3 h-3 fill-black" /> : <Play className="w-3 h-3 fill-black" />}
                <span>{isPlaying ? "33 RPM" : "PAUSED"}</span>
              </button>
            </div>

            {/* Real Animated Equalizer Spectrum Bars */}
            <div className="flex items-end justify-center gap-1.5 h-8 mb-4">
              {[40, 85, 60, 95, 30, 70, 100, 50, 90, 65, 45, 80].map((h, i) => (
                <motion.span
                  key={i}
                  animate={isPlaying ? {
                    height: ["20%", `${h}%`, "30%", `${Math.max(25, (h * 0.75))}%`, "20%"]
                  } : { height: "20%" }}
                  transition={{
                    duration: 0.8 + (i % 4) * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-emerald-500 via-teal-400 to-cyan-400"
                />
              ))}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
              {profile.fullName}
            </h1>

            {profile.jobTitle && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 tracking-wider uppercase mb-2">
                <Music2 className="w-3.5 h-3.5" />
                <span>{profile.jobTitle}</span>
              </div>
            )}

            <p className="text-xs font-mono text-gray-400 mb-3">
              @{profile.username}
            </p>

            {profile.location && (
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.bio && (
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-sm px-2">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Quick Connect Buttons */}
          <div className="flex items-center justify-center gap-2 mb-6 relative z-10 flex-wrap">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-emerald-950/20 text-xs font-medium text-gray-200 hover:text-emerald-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Booking / Mail</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/30 text-xs font-medium text-emerald-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-950/20 text-xs font-medium text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Studio</span>
              </a>
            )}
          </div>

          {/* Tracklist Style Social Media Links */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 px-1 mb-1">
              <span>TRACKLIST / SOCIALS:</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                STREAM NOW
              </span>
            </div>

            {activeLinks.map((link, idx) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-[11px] font-mono text-gray-500 w-4 text-center">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#08080c] border border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform shadow-inner">
                    <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors block">
                      {link.title}
                    </span>
                    
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Bottom Mastering Studio Tag */}
          <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400 relative z-10">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Headphones className="w-3.5 h-3.5" />
              HI-FI MASTERING
            </span>
            <span>NOVAWEB RECORDS</span>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-gray-500">
        <a 
          href="https://novawebdv.com/profiles" 
          target="_blank" 
          rel="noreferrer" 
          className="hover:text-emerald-400 transition-colors"
        >
          {profile.username}.novawebdv.com
        </a>
      </footer>
    </div>
  );
}
