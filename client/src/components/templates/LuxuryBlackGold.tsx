import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { 
  Crown, 
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
  Gem
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  website: Globe,
};

export function LuxuryBlackGold({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#050505] text-[#fafafa] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      {/* Radiant Golden Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[450px] h-[350px] bg-gradient-to-b from-amber-500/15 via-yellow-600/5 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg mx-auto pt-8 sm:pt-14 pb-12 flex-1">
        {/* VIP Crown Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 uppercase">
              VIP LUXURY PROFILE
            </span>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-5">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-black p-1">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="absolute bottom-0 right-1 p-1.5 rounded-full bg-black border border-amber-500/60 shadow-lg text-amber-400">
              <Gem className="w-3.5 h-3.5" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-400 mb-2">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-sm font-medium text-amber-400/90 tracking-wider mb-2">
              {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-300 max-w-sm leading-relaxed px-4 py-2 rounded-2xl bg-white/[0.02] border border-amber-500/20">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Quick Contact Buttons with Golden Foil Accent */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-300 transition-all"
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
              className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-300 transition-all"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/40 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] text-amber-300 transition-all"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Links Cards */}
        <div className="space-y-3.5">
          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-black via-zinc-950 to-black border border-amber-500/30 hover:border-amber-400/80 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-gray-100 group-hover:text-amber-200">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-amber-500/60 group-hover:text-amber-400 transition-colors" />
              </a>
            );
          })}
        </div>
      </div>

      <footer className="py-6 text-center text-[11px] text-amber-500/70 font-sans tracking-widest uppercase">
        <span>Exclusive Edition • Novaweb Profile</span>
      </footer>
    </div>
  );
}
