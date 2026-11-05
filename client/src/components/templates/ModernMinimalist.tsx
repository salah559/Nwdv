import React, { useState } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  Copy, 
  Check, 
  Share2
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function ModernMinimalist({ profile }: { profile: UserProfile }) {
  const [copied, setCopied] = useState(false);
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-[#e2e8f0] flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-white/20 relative overflow-hidden">
      {/* Subtle Monochrome Ambient Spotlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-white/[0.04] rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto pt-8 sm:pt-14 pb-12 flex-1"
      >
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono mb-8 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-widest uppercase">Open for opportunities</span>
          </div>
          <button 
            onClick={copyUrl}
            className="hover:text-white transition-colors flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5"
            title="Copy Profile Link"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? "Copied" : "Share"}</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-5 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border border-white/10 p-1 bg-gradient-to-b from-white/10 to-transparent shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
            <div className="absolute -bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-[#08090d] border border-white/20 text-[10px] font-mono text-gray-300">
              @{profile.username}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <p className="text-sm font-medium text-gray-400 tracking-wide mb-3">
              {profile.jobTitle}
            </p>
          )}

          {profile.location && (
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 mb-4 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <p className="text-sm text-gray-300/90 leading-relaxed max-w-sm px-2">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Direct Action Chips */}
        <div className="flex items-center justify-center gap-2.5 mb-8 flex-wrap">
          {profile.email && (
            <a
              href={`mailto:${profile.email}`}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/30 hover:bg-white/[0.08] text-xs font-medium text-gray-300 hover:text-white transition-all flex items-center gap-2 shadow-sm"
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
              className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-950/20 text-xs font-medium text-emerald-400 transition-all flex items-center gap-2 shadow-sm"
            >
              <PlatformIcon platform="whatsapp" className="w-3.5 h-3.5" colored={false} />
              <span>WhatsApp</span>
            </a>
          )}
          {profile.phone && (
            <a
              href={`tel:${profile.phone}`}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-950/20 text-xs font-medium text-cyan-400 transition-all flex items-center gap-2 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
          )}
        </div>

        {/* Social Links List */}
        <div className="space-y-3">
          {activeLinks.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/[0.05] via-white/[0.03] to-transparent border border-white/10 hover:border-white/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-all duration-300">
                  <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white block">
                    {link.title}
                  </span>
                  <span className="text-[11px] text-gray-500 block truncate max-w-[200px]" dir="ltr">
                    {link.url.replace(/^https?:\/\/(www\.)?/, "")}
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all">
                <ExternalLink className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Modern Minimal Footer */}
      <footer className="py-6 text-center text-[11px] text-gray-600 font-mono">
        <a 
          href="https://novawebdv.com/profiles" 
          target="_blank" 
          rel="noreferrer" 
          className="hover:text-white transition-colors"
        >
          {profile.username}.novawebdv.com
        </a>
      </footer>
    </div>
  );
}
