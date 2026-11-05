import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { 
  Zap, 
  Terminal, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  Github, 
  Linkedin, 
  Instagram, 
  Globe, 
  MessageCircle,
  Radio,
  Binary
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  website: Globe,
};

export function NeonDeveloper({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#04060d] text-[#e0f2fe] flex flex-col items-center justify-between p-4 sm:p-8 font-mono selection:bg-cyan-500/40 relative overflow-hidden">
      {/* Neon Cyber Glows */}
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-lg mx-auto pt-6 sm:pt-10 pb-12 flex-1">
        {/* Cyber Neon Container */}
        <div className="rounded-3xl bg-[#090e1d]/90 border-2 border-cyan-400/40 p-6 sm:p-8 text-center mb-6 shadow-[0_0_35px_rgba(6,255,240,0.2)] relative backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-6 text-[10px] text-cyan-400">
            <span className="flex items-center gap-1.5 uppercase font-bold tracking-widest">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>CYBER_NET // NODE #{profile.username}</span>
            </span>
            <span className="text-fuchsia-400 font-bold">STATUS: ACTIVE</span>
          </div>

          {/* Avatar with Dual Neon Glow */}
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-[3px] bg-gradient-to-tr from-cyan-400 via-sky-500 to-fuchsia-500 shadow-[0_0_25px_rgba(6,255,240,0.5)]">
              <div className="w-full h-full rounded-[13px] overflow-hidden bg-black">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black border border-cyan-400 text-cyan-300 text-[9px] font-bold tracking-wider shadow-lg">
              DEV_OPS
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 drop-shadow-[0_0_15px_rgba(6,255,240,0.4)] mb-2 tracking-wider">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-xs font-bold text-cyan-400 tracking-widest uppercase mb-2">
              &gt; {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-4">
              <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-xs text-cyan-100/90 leading-relaxed max-w-sm mx-auto bg-black/50 p-3 rounded-xl border border-cyan-500/20">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Action Direct Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(6,255,240,0.1)]"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] tracking-wider uppercase font-bold">Mail</span>
            </a>
          )}
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] tracking-wider uppercase font-bold">WhatsApp</span>
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="p-3 rounded-xl bg-black/60 border border-fuchsia-500/30 hover:border-fuchsia-400 text-fuchsia-300 hover:text-white transition-all text-center flex flex-col items-center gap-1 shadow-[0_0_15px_rgba(217,70,239,0.1)]"
            >
              <Phone className="w-4 h-4 text-fuchsia-400" />
              <span className="text-[10px] tracking-wider uppercase font-bold">Call</span>
            </a>
          )}
        </div>

        {/* Social / Project Links */}
        <div className="space-y-3">
          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-4 rounded-xl bg-black/70 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,255,240,0.3)] transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-200 group-hover:text-cyan-300 uppercase tracking-wide">
                      {link.title}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </a>
            );
          })}
        </div>
      </div>

      <footer className="py-6 text-center text-[10px] text-cyan-500/60 font-mono tracking-widest uppercase">
        <span>CYBER_NOVAWEB // 2025 // ENCRYPTED</span>
      </footer>
    </div>
  );
}
