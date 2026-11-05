import React, { useState } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Clapperboard, 
  Film, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Award, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  Star
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function CinematicDirector({ profile }: { profile: UserProfile }) {
  const [copied, setCopied] = useState(false);
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#e8e6e3] flex flex-col items-center justify-between p-4 sm:p-8 font-serif selection:bg-amber-500/20 relative overflow-hidden">
      {/* Cinematic Golden Overhead Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-amber-500/15 via-amber-700/5 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[550px] h-[250px] bg-gradient-to-t from-red-950/20 to-transparent rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Film Letterbox Crop Accent Lines */}
      <div className="fixed top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none z-30" />
      <div className="fixed bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent pointer-events-none z-30" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md mx-auto pt-6 sm:pt-10 pb-12 flex-1 relative z-20 font-sans"
      >
        {/* Premiere Poster Frame */}
        <div className="relative rounded-3xl bg-[#0f0f14]/90 border border-amber-500/20 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Subtle Golden Foil Trim */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Festival Selection Header */}
          <div className="flex flex-col items-center text-center pb-5 mb-6 border-b border-amber-500/15 relative z-10">
            <div className="flex items-center justify-between w-full mb-3 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clapperboard className="w-3.5 h-3.5" />
                PREMIERE EDITION
              </span>
              <button
                onClick={copyUrl}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs transition-all"
                title="Share Profile"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Share"}</span>
              </button>
            </div>

            {/* Laurel Wreath Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-serif tracking-widest uppercase shadow">
              <span>✦ OFFICIAL SELECTION 2025 ✦</span>
            </div>
          </div>

          {/* Director / Actor Portrait */}
          <div className="flex flex-col items-center text-center relative z-10 mb-7">
            <div className="relative mb-5 group">
              <div className="w-32 h-40 sm:w-36 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-500/40 p-1 bg-gradient-to-b from-amber-500/20 to-black shadow-2xl group-hover:border-amber-400 transition-colors">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-xl filter contrast-105"
                />
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black border border-amber-500/50 text-[10px] font-mono text-amber-400 tracking-wider whitespace-nowrap shadow-md">
                A PRODUCTION BY @{profile.username}
              </div>
            </div>

            <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400/80 uppercase mb-1">
              STARRING
            </span>

            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white mb-2">
              {profile.fullName}
            </h1>

            {profile.jobTitle && (
              <p className="text-xs font-mono text-amber-200/90 tracking-widest uppercase mb-3">
                {profile.jobTitle}
              </p>
            )}

            {profile.location && (
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 font-sans">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.bio && (
              <p className="text-xs sm:text-sm text-gray-300 font-serif italic leading-relaxed max-w-sm px-2">
                &ldquo;{profile.bio}&rdquo;
              </p>
            )}
          </div>

          {/* Direct Agency / Contact Buttons */}
          <div className="flex items-center justify-center gap-2 mb-7 relative z-10 flex-wrap font-sans">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-medium text-amber-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Agency Inquiries</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-900/30 text-xs font-medium text-emerald-300 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/40 text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Direct Line</span>
              </a>
            )}
          </div>

          {/* Film Credits Styled Links */}
          <div className="space-y-3 relative z-10 font-sans">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 px-1 mb-1">
              <span>FEATURED CREDITS & LINKS:</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" />
                PREVIEW
              </span>
            </div>

            {activeLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-amber-500/20 hover:border-amber-400/50 transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#08080c] border border-amber-500/20 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                    <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors block">
                      {link.title}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400 block truncate max-w-[190px]" dir="ltr">
                      {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* End Credits Footer */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-500 relative z-10">
            <span className="flex items-center gap-1 text-amber-400/90">
              <Film className="w-3.5 h-3.5" />
              CINEMASCOPE 2.39:1
            </span>
            <span>NOVAWEB PICTURES</span>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-gray-500 font-sans z-20">
        <a 
          href="https://novawebdv.com/profiles" 
          target="_blank" 
          rel="noreferrer" 
          className="hover:text-amber-400 transition-colors"
        >
          {profile.username}.novawebdv.com
        </a>
      </footer>
    </div>
  );
}
