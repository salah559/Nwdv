import React, { useState } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Flame, 
  Award,
  Layers,
  MapPin,
  Mail,
  Phone,
  MessageCircle
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function HologramCard({ profile }: { profile: UserProfile }) {
  const [copied, setCopied] = useState(false);
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col items-center justify-between p-4 sm:p-8 font-sans relative overflow-hidden selection:bg-purple-500/30">
      {/* Dynamic Animated Cosmic / Prism Aura Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.55, 0.35],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-indigo-600/30 via-fuchsia-600/25 to-cyan-500/30 blur-[130px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            rotate: [360, 270, 180, 90, 0]
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-emerald-500/20 via-sky-600/25 to-pink-600/30 blur-[140px]"
        />
        {/* Holographic grid scan lines */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-[#070913]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
        className="w-full max-w-md mx-auto pt-4 sm:pt-8 pb-12 flex-1"
      >
        {/* 3D Hologram Trading Card Master Container */}
        <div className="relative group">
          {/* Animated Rainbow Iridescent Border Shimmer */}
          <div className="absolute -inset-[2px] rounded-[36px] bg-gradient-to-r from-red-500 via-yellow-400 via-emerald-400 via-cyan-400 via-blue-500 via-fuchsia-500 to-red-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity duration-700 animate-pulse" />

          {/* Main Card Shell */}
          <div className="relative rounded-[34px] bg-[#0c1021]/90 backdrop-blur-2xl border border-white/20 p-6 sm:p-7 shadow-[0_20px_60px_-15px_rgba(79,70,229,0.35)] overflow-hidden">
            {/* Holographic foil diagonal reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent opacity-60 pointer-events-none" />

            {/* Top Collector Card Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-rose-500 text-black shadow-lg flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  SSR EDITION
                </span>
                <span className="text-[11px] font-mono text-cyan-400 font-bold">#001/ORIGINAL</span>
              </div>
              <button
                onClick={copyUrl}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white/90 hover:text-white transition-all backdrop-blur-md"
                title="Share Card"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-medium">{copied ? "Copied!" : "Share"}</span>
              </button>
            </div>

            {/* Hologram Avatar Stage */}
            <div className="flex flex-col items-center text-center relative z-10 mb-6">
              <motion.div
                whileHover={{ rotateY: 15, rotateX: -10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative mb-5"
                style={{ perspective: 1000 }}
              >
                {/* Concentric rotating holographic rings */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-4 rounded-full border border-dashed border-cyan-400/40 pointer-events-none"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 rounded-full border border-dotted border-fuchsia-400/50 pointer-events-none"
                />
                
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-300 shadow-[0_0_35px_rgba(168,85,247,0.5)] overflow-hidden">
                  <img
                    src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"}
                    alt={profile.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#070913] border border-cyan-400/50 text-[10px] font-mono text-cyan-300 shadow-md">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                    LVL 99 FOIL
                  </span>
                </div>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-fuchsia-200 mb-1">
                {profile.fullName}
              </h1>

              {profile.jobTitle && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 tracking-wide uppercase mb-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.jobTitle}</span>
                </div>
              )}

              <p className="text-[12px] font-mono text-fuchsia-300/80 mb-3">
                @{profile.username}
              </p>

              {profile.location && (
                <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 mb-3 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.bio && (
                <p className="text-xs sm:text-sm text-gray-300/90 leading-relaxed max-w-sm px-2">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Quick Contact Badges */}
            <div className="flex items-center justify-center gap-2 mb-6 relative z-10 flex-wrap">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="px-3.5 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/40 text-xs font-medium text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </a>
              )}
              {profile.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/40 text-xs font-medium text-emerald-300 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="px-3.5 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-900/40 text-xs font-medium text-purple-300 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              )}
            </div>

            {/* Social Links Cards with Branded Colors */}
            <div className="space-y-3 relative z-10">
              {activeLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/50 transition-all duration-300 group shadow-lg backdrop-blur-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#090d1c] border border-white/10 flex items-center justify-center p-2.5 shadow-md group-hover:scale-110 transition-transform">
                      <PlatformIcon platform={link.platform} className="w-6 h-6" colored={true} />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors block">
                        {link.title}
                      </span>
                      <span className="text-[11px] font-mono text-gray-400 block truncate max-w-[190px]" dir="ltr">
                        {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/20 transition-all">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Bottom Card Footer Hologram Seal */}
            <div className="mt-7 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400 relative z-10">
              <span className="flex items-center gap-1 text-cyan-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                VERIFIED PROFILE
              </span>
              <span className="text-fuchsia-300">NOVAWEB SaaS</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-gray-500">
        <a 
          href="https://novawebdv.com/profiles" 
          target="_blank" 
          rel="noreferrer" 
          className="hover:text-cyan-400 transition-colors"
        >
          {profile.username}.novawebdv.com
        </a>
      </footer>
    </div>
  );
}
