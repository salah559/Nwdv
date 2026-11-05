import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { 
  Palette, 
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
  Layers,
  Heart
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  website: Globe,
};

export function CreativeDesigner({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#0e0720] text-[#f8fafc] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-fuchsia-500/30 relative overflow-hidden">
      {/* Playful Ambient Colorful Flares */}
      <div className="fixed top-[-5%] left-[-10%] w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-5%] right-[-10%] w-[450px] h-[450px] bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg mx-auto pt-6 sm:pt-10 pb-12 flex-1">
        {/* Creative Artistic Header */}
        <div className="rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 backdrop-blur-2xl p-6 sm:p-8 text-center mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-pink-400 font-bold px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30">
            <Palette className="w-3.5 h-3.5" />
            <span>Creative</span>
          </div>

          <div className="relative inline-block mb-4 mt-2">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 rotate-2 hover:rotate-0 transition-transform duration-300 shadow-xl">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-[22px]"
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-cyan-300 mb-1.5">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-sm font-semibold text-pink-300 mb-2">
              {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-300/80 mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-200 leading-relaxed max-w-sm mx-auto">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Quick Contact Action Bar */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-400 text-pink-300 transition-all shadow-md"
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
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400 text-emerald-300 transition-all shadow-md"
              title="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400 text-cyan-300 transition-all shadow-md"
              title="Phone"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Dynamic Social Cards */}
        <div className="space-y-3">
          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/[0.07] to-white/[0.03] border border-white/10 hover:border-pink-500/50 hover:from-white/[0.12] transition-all duration-300 group shadow-lg"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-pink-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-white group-hover:text-pink-200">
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors" />
              </a>
            );
          })}
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-purple-400/60 font-sans flex items-center gap-1 justify-center">
        <span>Curated with</span>
        <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
        <span>on Novaweb Profile</span>
      </footer>
    </div>
  );
}
