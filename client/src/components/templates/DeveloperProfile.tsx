import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { 
  Terminal, 
  Code, 
  Globe, 
  Mail, 
  Phone, 
  ExternalLink,
  Github, 
  Linkedin, 
  Instagram, 
  Twitter, 
  MessageCircle,
  FolderGit2,
  Cpu
} from "lucide-react";

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  twitter: Twitter,
  website: Globe,
};

export function DeveloperProfile({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#050811] text-[#e2e8f0] flex flex-col items-center justify-between p-4 sm:p-8 font-mono selection:bg-emerald-500/30">
      <div className="w-full max-w-lg mx-auto pt-6 sm:pt-10 pb-12 flex-1">
        {/* Terminal Header */}
        <div className="rounded-2xl border border-emerald-500/30 bg-[#080d1a] shadow-[0_0_35px_rgba(16,185,129,0.1)] overflow-hidden mb-6">
          <div className="px-4 py-2.5 bg-black/60 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <Terminal className="w-3 h-3" />
              <span>~/dev/{profile.username}</span>
            </span>
            <div className="text-[10px] text-gray-500">zsh - 80x24</div>
          </div>

          <div className="p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-emerald-400/50 p-1 bg-black/40 shadow-lg">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                online
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
              <span className="text-emerald-400">$</span>
              <span>{profile.fullName}</span>
            </h1>

            <div className="text-xs text-emerald-300/80 mb-3 flex items-center justify-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>{profile.jobTitle || "Full-Stack Engineer"}</span>
            </div>

            {profile.bio && (
              <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Quick Commands / Contacts */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-xs">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500 text-center text-emerald-300 hover:text-white transition-all flex flex-col items-center gap-1"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px]">Email</span>
            </a>
          )}
          {profile.whatsapp && (
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500 text-center text-emerald-300 hover:text-white transition-all flex flex-col items-center gap-1"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px]">WhatsApp</span>
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 hover:border-emerald-500 text-center text-emerald-300 hover:text-white transition-all flex flex-col items-center gap-1"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px]">Call</span>
            </a>
          )}
        </div>

        {/* Social / Repositories Links */}
        <div className="space-y-2.5">
          <div className="text-[11px] text-gray-500 uppercase tracking-widest px-1 flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>Connected Repositories & Links</span>
          </div>

          {activeLinks.map((link) => {
            const Icon = PLATFORM_ICONS[link.platform] || Globe;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#080d1a] border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-950/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-200 group-hover:text-emerald-300">
                      {link.title}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate max-w-[200px]" dir="ltr">
                      {link.url}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500/60 group-hover:text-emerald-400" />
              </a>
            );
          })}
        </div>
      </div>

      <footer className="py-6 text-center text-[10px] text-gray-500 font-mono">
        <span className="text-emerald-500">root@novaweb:</span>
        <span className="text-gray-400"> profile loaded in 0.04s</span>
      </footer>
    </div>
  );
}
