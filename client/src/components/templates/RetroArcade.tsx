import React, { useState } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Gamepad2, 
  ExternalLink, 
  Copy, 
  Check, 
  Heart, 
  Zap, 
  Trophy, 
  Coins, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  Terminal
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function RetroArcade({ profile }: { profile: UserProfile }) {
  const [copied, setCopied] = useState(false);
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0718] text-[#f7fafc] flex flex-col items-center justify-between p-4 sm:p-8 font-mono selection:bg-[#ff007f] selection:text-white relative overflow-hidden">
      {/* CRT Scanline Filter Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-30 opacity-20"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45) 1px, transparent 1px, transparent 3px)"
        }}
      />

      {/* Retro Arcade Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-purple-700/25 via-pink-600/15 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-t from-cyan-600/20 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto pt-4 sm:pt-8 pb-12 flex-1 relative z-20"
      >
        {/* Arcade Cabinet Screen Housing */}
        <div className="relative rounded-3xl bg-[#140b26] border-4 border-[#3b1b63] shadow-[0_0_50px_rgba(168,85,247,0.3),inset_0_0_30px_rgba(0,0,0,0.8)] p-6 sm:p-7">
          
          {/* Top Marquee Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-dashed border-[#582994] text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-sm animate-ping" />
              <span className="text-[#00ffcc] font-black tracking-widest uppercase flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4" />
                PLAYER 1 READY
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-400 font-bold bg-[#241142] px-2 py-0.5 rounded border border-amber-500/30">
                <Coins className="w-3 h-3" />
                <span>CREDITS: 99</span>
              </div>
              <button
                onClick={copyUrl}
                className="bg-[#241142] hover:bg-[#3d1c70] border border-[#ff007f]/50 text-[#ff007f] hover:text-white px-2 py-0.5 rounded transition-colors text-[11px] font-bold flex items-center gap-1"
                title="Copy Profile"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "OK!" : "SHARE"}</span>
              </button>
            </div>
          </div>

          {/* Player Stats HUD */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-[11px] font-bold">
            <div className="bg-[#1b0d33] p-2 rounded-xl border border-rose-500/30 flex items-center justify-between">
              <span className="text-rose-400 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                HP
              </span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-2 bg-black rounded overflow-hidden">
                  <div className="w-[90%] h-full bg-gradient-to-r from-red-500 to-rose-400 animate-pulse" />
                </div>
                <span className="text-white text-[10px]">90/100</span>
              </div>
            </div>

            <div className="bg-[#1b0d33] p-2 rounded-xl border border-cyan-500/30 flex items-center justify-between">
              <span className="text-cyan-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                MP
              </span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-2 bg-black rounded overflow-hidden">
                  <div className="w-[100%] h-full bg-gradient-to-r from-cyan-500 to-blue-400" />
                </div>
                <span className="text-white text-[10px]">MAX</span>
              </div>
            </div>
          </div>

          {/* Player Avatar Box with 8-bit Frame */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-4 group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-b from-[#ff007f] via-purple-600 to-[#00ffcc] shadow-[0_0_25px_rgba(255,0,127,0.5)]">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#ff007f] text-black font-black text-[10px] px-3 py-0.5 rounded shadow-lg uppercase tracking-wider">
                LVL. 99 BOSS
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2 mb-1 drop-shadow-[0_2px_10px_rgba(255,0,127,0.6)]">
              {profile.fullName}
            </h1>

            {profile.jobTitle && (
              <p className="text-xs font-bold text-[#00ffcc] uppercase tracking-wider mb-2">
                &lt;{profile.jobTitle} /&gt;
              </p>
            )}

            <p className="text-xs text-purple-300 font-mono mb-3">
              @{profile.username}
            </p>

            {profile.location && (
              <div className="inline-flex items-center gap-1 text-[11px] text-gray-300 mb-3 px-3 py-1 rounded bg-[#1b0d33] border border-[#582994]">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>ZONE: {profile.location}</span>
              </div>
            )}

            {profile.bio && (
              <div className="bg-[#190c30] p-3 rounded-xl border border-white/10 text-xs text-gray-200 leading-relaxed max-w-sm mb-2 text-start">
                <span className="text-amber-400 block mb-1 text-[10px]">// QUEST LOG:</span>
                {profile.bio}
              </div>
            )}
          </div>

          {/* Quick Contact Buttons */}
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3 py-2 rounded-xl bg-[#241142] border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500 hover:text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>MAIL</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-[#241142] border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500 hover:text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>CHAT</span>
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="px-3 py-2 rounded-xl bg-[#241142] border border-rose-400/40 text-rose-300 hover:bg-rose-500 hover:text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>CALL</span>
              </a>
            )}
          </div>

          {/* Social Inventory Slots */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold px-1 mb-1">
              <span>SELECT QUEST LINK:</span>
              <span className="text-[#ff007f] animate-pulse">PRESS [A] TO VISIT</span>
            </div>

            {activeLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1b0d33] hover:bg-[#2b1452] border-2 border-[#582994] hover:border-[#ff007f] transition-all group shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#0d0718] border border-white/10 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-[#00ffcc] block transition-colors">
                      {link.title}
                    </span>
                    <span className="text-[10px] text-gray-400 block truncate max-w-[190px]" dir="ltr">
                      {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  </div>
                </div>
                <div className="text-[#ff007f] group-hover:text-white font-bold text-xs flex items-center gap-1">
                  <span>GO</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* High Score Footer */}
          <div className="mt-6 pt-4 border-t-2 border-dashed border-[#582994] flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Trophy className="w-3.5 h-3.5" />
              HI-SCORE: 999,990
            </span>
            <span className="text-cyan-400">STAGE 1-1 COMPLETE</span>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-gray-500 z-20">
        <a 
          href="https://novawebdv.com/profiles" 
          target="_blank" 
          rel="noreferrer" 
          className="hover:text-[#ff007f] transition-colors"
        >
          {profile.username}.novawebdv.com
        </a>
      </footer>
    </div>
  );
}
