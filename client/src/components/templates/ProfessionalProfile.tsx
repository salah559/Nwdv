import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  Github, 
  Linkedin, 
  Instagram, 
  Globe, 
  MessageCircle,
  Building2,
  CheckCircle2,
  ShieldCheck,
  CalendarCheck,
  Award,
  Share2
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  website: Globe,
};

export function ProfessionalProfile({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#070c18] text-[#f8fafc] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-blue-600/30 relative overflow-hidden">
      {/* Deep Executive Blue Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto pt-6 sm:pt-10 pb-12 flex-1 space-y-4"
      >
        {/* Main Bento Hero Card */}
        <div className="rounded-3xl bg-gradient-to-b from-[#0f172a] to-[#0b1329] border border-blue-900/40 shadow-2xl overflow-hidden relative">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-900/50 via-indigo-950 to-slate-900 relative overflow-hidden">
            {profile.coverUrl ? (
              <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-50" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            )}
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-semibold backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified Executive</span>
              </span>
            </div>
          </div>

          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar */}
            <div className="-mt-14 mb-4 flex justify-between items-end">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-[#0f172a] shadow-2xl bg-[#080d1a]">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {profile.location && (
                <div className="inline-flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              {profile.fullName}
            </h1>

            {profile.jobTitle && (
              <p className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>{profile.jobTitle}</span>
              </p>
            )}

            {profile.bio && (
              <p className="text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Bento Quick Actions & Contact Strip */}
        <div className="grid grid-cols-2 gap-3">
          {profile.email && (
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={`mailto:${profile.email}`}
              className="p-4 rounded-2xl bg-[#0f172a]/90 border border-blue-900/40 hover:border-blue-400/50 hover:bg-[#131d36] transition-all flex items-center gap-3 shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">Direct Email</div>
                <div className="text-[10px] text-gray-400 truncate" dir="ltr">{profile.email}</div>
              </div>
            </motion.a>
          )}

          {profile.whatsapp && (
            <motion.a
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-[#0f172a]/90 border border-blue-900/40 hover:border-emerald-400/50 hover:bg-[#131d36] transition-all flex items-center gap-3 shadow-lg"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">WhatsApp</div>
                <div className="text-[10px] text-emerald-400 font-semibold">Available Now</div>
              </div>
            </motion.a>
          )}
        </div>

        {/* Portfolio & Connected Platforms */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">
            Professional Network & Portfolio
          </div>

          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#0f172a]/80 border border-blue-900/30 hover:border-blue-400/60 hover:bg-[#14213d] transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-100 group-hover:text-blue-300 block">
                      {link.title}
                    </span>
                    <span className="text-[11px] text-gray-500 block truncate max-w-[220px]" dir="ltr">
                      {link.url}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </motion.a>
            );
          })}
        </div>
      </motion.div>

      <footer className="py-6 text-center text-xs text-gray-500 font-sans">
        <span>Official Executive Card • Novaweb Profile</span>
      </footer>
    </div>
  );
}
