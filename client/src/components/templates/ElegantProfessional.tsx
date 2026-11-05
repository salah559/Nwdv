import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  ExternalLink,
  Award,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function ElegantProfessional({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#070e17] text-[#f1f5f9] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-teal-500/30 relative overflow-hidden">
      {/* Morphing Liquid Ambient Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[550px] h-[550px] bg-teal-500/15 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[550px] h-[550px] bg-slate-600/20 rounded-full blur-[160px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto pt-8 sm:pt-14 pb-12 flex-1"
      >
        {/* Studio Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-xl text-teal-300 text-xs font-medium shadow-sm">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span>Studio Portfolio Edition</span>
          </div>
        </div>

        {/* Visionary Frosted Glass Hero Container */}
        <div className="rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-3xl p-6 sm:p-8 text-center mb-6 shadow-2xl relative overflow-hidden">
          {/* Subtle reflection glare */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border border-white/20 p-1 bg-white/5 shadow-2xl">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-900 border border-white/20 text-teal-400 shadow-md">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1.5">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-sm font-medium text-teal-300/90 tracking-wide mb-2">
              {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-4">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto font-light">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Strip */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {profile.email && (
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${profile.email}`}
              className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-teal-400 hover:bg-white/[0.08] text-gray-200 transition-all shadow-md"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          )}
          {profile.whatsapp && (
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-emerald-400 hover:bg-white/[0.08] text-emerald-400 transition-all shadow-md"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </motion.a>
          )}
          {profile.phone && (
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${profile.phone}`}
              className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-sky-400 hover:bg-white/[0.08] text-sky-400 transition-all shadow-md"
              title="Phone"
            >
              <Phone className="w-4 h-4" />
            </motion.a>
          )}
        </div>

        {/* Links Stack */}
        <div className="space-y-3">
          {activeLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-teal-400/50 hover:bg-white/[0.08] backdrop-blur-2xl transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                    <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-200 group-hover:text-white block">
                      {link.title}
                    </span>
                    
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-teal-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </motion.a>
            ))}
        </div>
      </motion.div>

      <footer className="py-6 text-center text-xs text-gray-500 font-sans">
        <span>Studio Edition • Novaweb Profile</span>
      </footer>
    </div>
  );
}
