import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  Radio,
  ArrowRight
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function ModernGradient({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#070b16] text-[#f8fafc] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Aurora Borealis Ambient Lighting */}
      <div className="fixed top-[-15%] left-[-10%] w-[650px] h-[650px] bg-gradient-to-br from-indigo-500/25 via-purple-600/20 to-transparent rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-15%] right-[-10%] w-[650px] h-[650px] bg-gradient-to-tl from-cyan-500/20 via-blue-600/20 to-transparent rounded-full blur-[160px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto pt-8 sm:pt-14 pb-12 flex-1"
      >
        {/* Profile Aurora Card */}
        <div className="rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 text-center mb-6 shadow-2xl relative overflow-hidden">
          {/* Top subtle flare */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500" />

          <div className="relative inline-block mb-4 mt-2">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#070b16]">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-200 to-purple-300 mb-2">
              {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 mb-4 px-3 py-1 rounded-full bg-white/5 border border-white/5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-200 leading-relaxed max-w-sm mx-auto font-light">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Floating Quick Action Pills */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {profile.email && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${profile.email}`}
              className="px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/10 hover:border-cyan-400 text-cyan-300 transition-all text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </motion.a>
          )}
          {profile.whatsapp && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/10 hover:border-emerald-400 text-emerald-300 transition-all text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </motion.a>
          )}
          {profile.phone && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${profile.phone}`}
              className="px-4 py-2.5 rounded-full bg-white/[0.06] border border-white/10 hover:border-purple-400 text-purple-300 transition-all text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </motion.a>
          )}
        </div>

        {/* Aurora Link Pills */}
        <div className="space-y-3">
          {activeLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08] backdrop-blur-2xl transition-all duration-300 group shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/10 text-white flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                    <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-white block">
                      {link.title}
                    </span>
                    <span className="text-[11px] text-gray-400 block truncate max-w-[200px]" dir="ltr">
                      {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.a>
            ))}
        </div>
      </motion.div>

      <footer className="py-6 text-center text-xs text-gray-500 font-sans">
        <span>Aurora Edition • Novaweb Profile</span>
      </footer>
    </div>
  );
}
