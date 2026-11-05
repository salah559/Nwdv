import React from "react";
import { UserProfile } from "@shared/saas-schema";
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
  CheckCircle,
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
    <div className="min-h-screen bg-[#0b1120] text-[#f8fafc] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-lg mx-auto pt-8 sm:pt-12 pb-12 flex-1">
        {/* Cover Photo if present or sleek header */}
        <div className="rounded-3xl bg-[#111a2e] border border-blue-900/40 shadow-xl overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-900/60 via-indigo-900/40 to-slate-900 relative">
            {profile.coverUrl && (
              <img 
                src={profile.coverUrl} 
                alt="Cover" 
                className="w-full h-full object-cover opacity-60" 
              />
            )}
          </div>

          <div className="px-6 pb-6 pt-0 relative">
            {/* Avatar overlapping cover */}
            <div className="-mt-14 mb-4 flex justify-between items-end">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#111a2e] shadow-2xl bg-[#0b1120]">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Verified Identity</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-1">
              {profile.fullName}
            </h1>

            {profile.jobTitle && (
              <p className="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>{profile.jobTitle}</span>
              </p>
            )}

            {profile.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>{profile.location}</span>
              </div>
            )}

            {profile.bio && (
              <p className="text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Executive Direct Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-blue-950/20 text-white transition-all flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <Mail className="w-4 h-4 text-blue-400" />
              <span>Contact via Email</span>
            </a>
          )}
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-950/20 text-white transition-all flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Direct</span>
            </a>
          )}
        </div>

        {/* Social and Professional Portfolio Links */}
        <div className="space-y-3">
          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#111a2e] border border-blue-900/30 hover:border-blue-500/50 hover:bg-[#14213d] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              </a>
            );
          })}
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-gray-500 font-sans">
        <span>© {new Date().getFullYear()} {profile.fullName} • Powered by Novaweb</span>
      </footer>
    </div>
  );
}
