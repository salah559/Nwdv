import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Github, 
  Linkedin, 
  Instagram, 
  Facebook, 
  Youtube, 
  MessageCircle,
  Twitter,
  Share2
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  whatsapp: MessageCircle,
  twitter: Twitter,
  website: Globe,
};

export function ModernMinimalist({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#090b10] text-[#f1f5f9] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-white/20">
      <div className="w-full max-w-lg mx-auto pt-8 sm:pt-14 pb-12 flex-1">
        {/* Header / Avatar */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-5 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/20 p-1 bg-white/5 shadow-2xl transition-transform duration-300 group-hover:scale-105">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-sm font-medium text-gray-400 mb-3">
              {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 mb-4">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed px-2">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Action Direct Links (WhatsApp, Email, Call) */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all shadow-sm"
              title="Send Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-all shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-all shadow-sm"
              title="Call Phone"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Social Links List */}
        <div className="space-y-3">
          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Powered by footer */}
      <footer className="py-6 text-center text-[11px] text-gray-500 font-mono">
        <a 
          href="https://novawebdv.com/profiles" 
          target="_blank" 
          rel="noreferrer" 
          className="hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
        >
          <span>Created with</span>
          <span className="font-bold text-gray-400">Novaweb Profile</span>
        </a>
      </footer>
    </div>
  );
}
