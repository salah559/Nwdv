import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Crown, 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  ExternalLink,
  Gem,
  Star,
  Shield
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function LuxuryBlackGold({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#030303] text-[#fafafa] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      {/* 24K Gold Ambient Radial Flares */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[550px] h-[400px] bg-gradient-to-b from-amber-500/20 via-yellow-600/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg mx-auto pt-8 sm:pt-14 pb-12 flex-1"
      >
        {/* VIP Royal Emblem */}
        <div className="flex justify-center mb-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 backdrop-blur-2xl shadow-[0_0_25px_rgba(245,158,11,0.25)] cursor-default"
          >
            <Crown className="w-4 h-4 text-amber-300 animate-pulse" />
            <span className="text-xs font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-500 uppercase">
              ROYAL EDITION • VIP
            </span>
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          </motion.div>
        </div>

        {/* Avatar & Title Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-5 group">
            {/* Double Golden Ring */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-[3px] bg-gradient-to-tr from-amber-500 via-yellow-200 to-amber-600 shadow-[0_0_40px_rgba(245,158,11,0.35)] transition-transform duration-500 group-hover:scale-105">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#050505] p-1.5">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="absolute bottom-1 right-2 p-2 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-black shadow-lg">
              <Gem className="w-4 h-4" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-2">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-sm font-semibold text-amber-300/90 tracking-widest uppercase mb-3 flex items-center gap-1.5">
              <span>✦</span>
              <span>{profile.jobTitle}</span>
              <span>✦</span>
            </p>
          )}

          {profile.location && (
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-200/60 mb-4 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <div className="relative p-5 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-amber-500/25 max-w-md mx-auto shadow-xl backdrop-blur-md">
              <p className="text-sm text-amber-100/90 leading-relaxed font-light">
                "{profile.bio}"
              </p>
            </div>
          )}
        </div>

        {/* Royal Gold Direct Contact Action Strip */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {profile.email && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${profile.email}`}
              className="p-4 rounded-2xl bg-black border border-amber-500/40 hover:border-amber-300 text-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all"
              title="Direct Email"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          )}
          {profile.whatsapp && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-black border border-amber-500/40 hover:border-amber-300 text-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
          )}
          {profile.phone && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${profile.phone}`}
              className="p-4 rounded-2xl bg-black border border-amber-500/40 hover:border-amber-300 text-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all"
              title="Call Phone"
            >
              <Phone className="w-4 h-4" />
            </motion.a>
          )}
        </div>

        {/* Links Cards with Golden Border and Hover Sweep */}
        <div className="space-y-3.5">
          {activeLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-black via-[#0d0d0d] to-black border border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300 group shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-500/40 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300">
                    <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-amber-50 group-hover:text-amber-300 block">
                      {link.title}
                    </span>
                    <span className="text-[11px] text-amber-200/40 block truncate max-w-[200px]" dir="ltr">
                      {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:border-amber-400 group-hover:text-amber-300 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </motion.a>
            ))}
        </div>
      </motion.div>

      <footer className="py-6 text-center text-[10px] text-amber-500/60 font-sans tracking-[0.3em] uppercase">
        <span>EXCLUSIVE ROYAL NOIR • NOVAWEB PROFILE</span>
      </footer>
    </div>
  );
}
