import React, { useState } from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Terminal, 
  Code, 
  Globe, 
  Mail, 
  Phone, 
  MessageCircle,
  ExternalLink,
  Cpu,
  GitBranch,
  FolderTree,
  Command,
  FileCode2,
  Check
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function DeveloperProfile({ profile }: { profile: UserProfile }) {
  const [activeTab, setActiveTab] = useState<"code" | "links">("links");
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#030712] text-[#e2e8f0] flex flex-col items-center justify-between p-4 sm:p-8 font-mono selection:bg-emerald-500/30 relative overflow-hidden">
      {/* Background Matrix/Code Glow */}
      <div className="fixed top-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto pt-6 sm:pt-10 pb-12 flex-1"
      >
        {/* IDE Window Frame */}
        <div className="rounded-3xl border border-emerald-500/30 bg-[#080d1a]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.12)] overflow-hidden mb-6">
          {/* Top Window Bar */}
          <div className="px-4 py-3 bg-black/70 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>

            <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>developer@{profile.username}:~</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-white/5 bg-black/40 text-xs">
            <button
              onClick={() => setActiveTab("links")}
              className={`px-4 py-2.5 flex items-center gap-1.5 font-mono border-r border-white/5 transition-colors ${activeTab === "links" ? "bg-[#080d1a] text-emerald-400 border-t-2 border-t-emerald-400 font-bold" : "text-gray-500 hover:text-gray-300"}`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>profile.tsx</span>
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-4 py-2.5 flex items-center gap-1.5 font-mono border-r border-white/5 transition-colors ${activeTab === "code" ? "bg-[#080d1a] text-cyan-400 border-t-2 border-t-cyan-400 font-bold" : "text-gray-500 hover:text-gray-300"}`}
            >
              <Command className="w-3.5 h-3.5" />
              <span>config.json</span>
            </button>
          </div>

          {/* Main IDE Body */}
          <div className="p-6 sm:p-8">
            {/* Avatar & Terminal Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 pb-6 border-b border-white/5">
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-400/50 p-1 bg-black shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <img
                    src={profile.avatarUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80"}
                    alt={profile.fullName}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded bg-emerald-500 text-black text-[9px] font-bold uppercase tracking-wider">
                  v2.0
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left" dir="ltr">
                <div className="text-xs text-emerald-400 font-mono mb-1 flex items-center justify-center sm:justify-start gap-1">
                  <span>const</span>
                  <span className="text-white font-bold">engineer</span>
                  <span>=</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1.5 tracking-tight">
                  "{profile.fullName}"
                </h1>
                <div className="text-xs text-emerald-300/80 mb-2 flex items-center justify-center sm:justify-start gap-1.5">
                  <Code className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{profile.jobTitle || "Full-Stack Engineer"}</span>
                </div>
                {profile.location && (
                  <div className="text-[11px] text-gray-400 flex items-center justify-center sm:justify-start gap-1">
                    <span>📍</span>
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terminal Bio Output */}
            {profile.bio && (
              <div className="mb-6 rounded-2xl bg-black/60 p-4 border border-emerald-500/20 text-xs text-gray-300 leading-relaxed font-mono relative">
                <div className="text-[10px] text-emerald-500 font-bold mb-1">// README.md</div>
                <p>{profile.bio}</p>
              </div>
            )}

            {/* Quick Terminal Contact Badges */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-950/20 text-center text-emerald-300 transition-all flex flex-col items-center gap-1 group"
                >
                  <Mail className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">email.send()</span>
                </a>
              )}
              {profile.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-950/20 text-center text-emerald-300 transition-all flex flex-col items-center gap-1 group"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">whatsapp.chat()</span>
                </a>
              )}
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-950/20 text-center text-emerald-300 transition-all flex flex-col items-center gap-1 group"
                >
                  <Phone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold">phone.call()</span>
                </a>
              )}
            </div>

            {/* Mode: Links View */}
            {activeTab === "links" ? (
              <div className="space-y-3">
                <div className="text-[11px] text-emerald-400/80 uppercase tracking-widest flex items-center justify-between pb-1" dir="ltr">
                  <span>// ACTIVE_ENDPOINTS ({activeLinks.length})</span>
                  <span className="text-gray-500 text-[10px]">HTTP 200 OK</span>
                </div>

                {activeLinks.map((link, idx) => (
                    <motion.a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-black/60 border border-emerald-500/20 hover:border-emerald-400 hover:bg-emerald-950/30 transition-all group"
                      dir="ltr"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-xs font-mono select-none">0{idx + 1}</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center p-1.5 group-hover:scale-110 transition-transform">
                          <PlatformIcon platform={link.platform} className="w-4 h-4" colored={true} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-200 group-hover:text-emerald-300">
                            {link.title}
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                    </motion.a>
                  ))}
              </div>
            ) : (
              /* Mode: JSON Config Code View */
              <div className="rounded-xl bg-black p-4 border border-white/10 text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto" dir="ltr">
                <pre>{JSON.stringify({
                  username: profile.username,
                  fullName: profile.fullName,
                  role: profile.jobTitle,
                  location: profile.location,
                  status: "Available",
                  endpoints: activeLinks.map(l => ({ title: l.title, url: l.url })),
                }, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Terminal Bottom Status Bar */}
          <div className="px-4 py-2 bg-emerald-950/50 border-t border-emerald-500/20 text-[10px] text-emerald-300/80 flex items-center justify-between" dir="ltr">
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3 h-3 text-emerald-400" />
              <span>main* (all tests passing)</span>
            </span>
            <span>UTF-8 • TSX</span>
          </div>
        </div>
      </motion.div>

      <footer className="py-6 text-center text-[10px] text-gray-600 font-mono">
        <span>sys.exit(0) • Powered by Novaweb Profile</span>
      </footer>
    </div>
  );
}
