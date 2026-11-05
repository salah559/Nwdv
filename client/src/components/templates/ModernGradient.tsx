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
  Radio
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  website: Globe,
};

export function ModernGradient({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#070b14] text-[#f8fafc] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-purple-500/30 relative overflow-hidden">
      {/* Aurora Mesh Gradient Backgrounds */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-cyan-600/25 via-blue-600/20 to-transparent rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg mx-auto pt-8 sm:pt-14 pb-12 flex-1">
        {/* Profile Card */}
        <div className="rounded-3xl bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/10 backdrop-blur-2xl p-6 sm:p-8 text-center mb-6 shadow-2xl relative">
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#070b14]">
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
            <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-2">
              {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-4">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-200 leading-relaxed max-w-sm mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Floating Quick Action Pills */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-white/10 text-cyan-300 transition-all text-xs font-semibold flex items-center gap-2"
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
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-white/10 text-emerald-300 transition-all text-xs font-semibold flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-purple-400 hover:bg-white/10 text-purple-300 transition-all text-xs font-semibold flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          )}
        </div>

        {/* Aurora Link Pills */}
        <div className="space-y-3">
          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 hover:bg-white/[0.08] backdrop-blur-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/10 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-300 transition-colors" />
              </a>
            );
          })}
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-gray-400 font-sans">
        <span>Aurora Edition • Novaweb Profile</span>
      </footer>
    </div>
  );
}
