import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Palette, 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  ExternalLink,
  Heart,
  Flame,
  Zap,
  Smile
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function CreativeDesigner({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#0d0718] text-[#f8fafc] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-pink-500/30 relative overflow-hidden">
      {/* Dynamic Colorful Flares */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/25 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/30 rounded-full blur-[150px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto pt-6 sm:pt-10 pb-12 flex-1"
      >
        {/* Floating Creative Badges */}
        <div className="flex items-center justify-between mb-4 px-2">
          <motion.div 
            whileHover={{ rotate: -5, scale: 1.05 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500 text-white font-extrabold text-[11px] shadow-[3px_3px_0px_#000]"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>CREATIVE SPACE</span>
          </motion.div>

          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-400 text-black font-extrabold text-[11px] shadow-[3px_3px_0px_#000]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AVAILABLE</span>
          </motion.div>
        </div>

        {/* Artistic Card Header */}
        <div className="rounded-3xl bg-gradient-to-b from-white/10 via-white/[0.04] to-black/40 border-2 border-white/20 p-6 sm:p-8 text-center mb-6 shadow-[8px_8px_0px_rgba(236,72,153,0.3)] backdrop-blur-2xl relative">
          {/* Avatar with offset border */}
          <div className="relative inline-block mb-4">
            <motion.div 
              whileHover={{ rotate: 4, scale: 1.05 }}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-2xl rotate-2"
            >
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </motion.div>
            <div className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-yellow-400 text-black shadow-[2px_2px_0px_#000] rotate-6">
              <Flame className="w-4 h-4 fill-black" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-300 mb-1.5 tracking-tight">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-sm font-bold text-pink-300 mb-2">
              {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-200/70 mb-4 px-3 py-0.5 rounded-full bg-purple-950/40 border border-purple-500/20">
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-200 leading-relaxed max-w-sm mx-auto font-medium bg-black/40 p-4 rounded-2xl border border-white/5">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Quick Contact Chips */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {profile.email && (
            <motion.a
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${profile.email}`}
              className="p-3.5 rounded-2xl bg-white/10 border-2 border-white/20 hover:border-pink-400 text-pink-300 shadow-[3px_3px_0px_rgba(0,0,0,0.5)] transition-all"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          )}
          {profile.whatsapp && (
            <motion.a
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-white/10 border-2 border-white/20 hover:border-emerald-400 text-emerald-300 shadow-[3px_3px_0px_rgba(0,0,0,0.5)] transition-all"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
          )}
          {profile.phone && (
            <motion.a
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${profile.phone}`}
              className="p-3.5 rounded-2xl bg-white/10 border-2 border-white/20 hover:border-cyan-400 text-cyan-300 shadow-[3px_3px_0px_rgba(0,0,0,0.5)] transition-all"
              title="Phone"
            >
              <Phone className="w-4 h-4" />
            </motion.a>
          )}
        </div>

        {/* Dynamic Social Cards */}
        <div className="space-y-3">
          {activeLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ x: 4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/[0.08] to-white/[0.02] border-2 border-white/10 hover:border-pink-400 hover:shadow-[4px_4px_0px_rgba(236,72,153,0.4)] transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                    <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white group-hover:text-pink-300 block">
                      {link.title}
                    </span>
                    
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors" />
              </motion.a>
            ))}
        </div>
      </motion.div>

      <footer className="py-6 text-center text-xs text-pink-400/60 font-sans flex items-center gap-1 justify-center">
        <span>Handcrafted with</span>
        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
        <span>on Novaweb Profile</span>
      </footer>
    </div>
  );
}
