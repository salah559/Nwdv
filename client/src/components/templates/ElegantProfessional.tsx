import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { 
  Sparkles, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  Github, 
  Linkedin, 
  Instagram, 
  Globe, 
  MessageCircle,
  Award
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  website: Globe,
};

export function ElegantProfessional({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#070d18] text-[#f1f5f9] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-slate-500/30 relative overflow-hidden">
      {/* Liquid Frosted Background Blobs */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-800/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg mx-auto pt-8 sm:pt-14 pb-12 flex-1">
        {/* Sleek Glassmorphic Container */}
        <div className="rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-3xl p-6 sm:p-8 text-center mb-6 shadow-2xl relative">
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border border-white/20 p-1 bg-white/5 shadow-2xl">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-white/20 text-teal-400">
              <Award className="w-4 h-4" />
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
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Contact Strip */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-400 hover:bg-white/10 text-gray-200 transition-all shadow-md"
              title="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-white/10 text-emerald-400 transition-all shadow-md"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-400 hover:bg-white/10 text-sky-400 transition-all shadow-md"
              title="Phone"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Links Stack */}
        <div className="space-y-3">
          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-teal-400/40 hover:bg-white/[0.07] backdrop-blur-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-300 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-teal-300 transition-colors" />
              </a>
            );
          })}
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-gray-500 font-sans">
        <span>Studio Edition • Novaweb Profile</span>
      </footer>
    </div>
  );
}
