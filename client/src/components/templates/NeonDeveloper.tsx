import React from "react";
import { UserProfile } from "@shared/saas-schema";
import { motion } from "framer-motion";
import { 
  Zap, 
  Terminal, 
  MapPin, 
  Mail, 
  Phone, 
  MessageCircle,
  ExternalLink,
  Radio,
  Binary,
  Cpu,
  Wifi,
  Sparkles
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

export function NeonDeveloper({ profile }: { profile: UserProfile }) {
  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  return (
    <div className="min-h-screen bg-[#02050e] text-[#e0f2fe] flex flex-col items-center justify-between p-4 sm:p-8 font-mono selection:bg-cyan-500/40 relative overflow-hidden">
      {/* High-Voltage Cyberpunk Glows */}
      <div className="fixed top-0 left-1/4 w-[450px] h-[450px] bg-cyan-500/25 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[450px] h-[450px] bg-fuchsia-600/25 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Cyber Grid Pattern Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#06fff00a_1px,transparent_1px),linear-gradient(to_bottom,#06fff00a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg mx-auto pt-6 sm:pt-10 pb-12 flex-1"
      >
        {/* Top Telemetry Bar */}
        <div className="flex items-center justify-between text-[10px] text-cyan-400 font-bold mb-4 px-2" dir="ltr">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NODE // {profile.username.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">SYS_PING: 16ms</span>
            <span className="text-fuchsia-400">ENCRYPTED</span>
          </div>
        </div>

        {/* Cyber Neon HUD Container */}
        <div className="rounded-3xl bg-[#060b17]/90 border-2 border-cyan-400/50 p-6 sm:p-8 text-center mb-6 shadow-[0_0_40px_rgba(6,255,240,0.25)] relative backdrop-blur-2xl">
          {/* Hologram Avatar */}
          <div className="relative inline-block mb-5">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-[3px] bg-gradient-to-tr from-cyan-400 via-sky-400 to-fuchsia-500 shadow-[0_0_30px_rgba(6,255,240,0.5)]">
              <div className="w-full h-full rounded-[21px] overflow-hidden bg-black">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&q=80"}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-black border border-cyan-400 text-cyan-300 text-[9px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(6,255,240,0.5)]">
              ONLINE
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-fuchsia-400 drop-shadow-[0_0_20px_rgba(6,255,240,0.5)] mb-2 tracking-wider">
            {profile.fullName}
          </h1>

          {profile.jobTitle && (
            <div className="inline-block px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-400/30 text-xs font-bold text-cyan-300 tracking-widest uppercase mb-3" dir="ltr">
              &lt; {profile.jobTitle} /&gt;
            </div>
          )}

          {profile.location && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 mb-4">
              <MapPin className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {profile.bio && (
            <div className="p-4 rounded-2xl bg-black/70 border border-cyan-500/20 text-xs text-cyan-100/90 leading-relaxed font-mono relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <p>{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Action Direct Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {profile.email && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`mailto:${profile.email}`}
              className="p-3.5 rounded-2xl bg-black/70 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 transition-all text-center flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(6,255,240,0.15)] group"
            >
              <Mail className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] tracking-wider uppercase font-bold">Mail</span>
            </motion.a>
          )}
          {profile.whatsapp && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl bg-black/70 border border-emerald-500/40 hover:border-emerald-300 text-emerald-300 transition-all text-center flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(16,185,129,0.15)] group"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] tracking-wider uppercase font-bold">WhatsApp</span>
            </motion.a>
          )}
          {profile.phone && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={`tel:${profile.phone}`}
              className="p-3.5 rounded-2xl bg-black/70 border border-fuchsia-500/40 hover:border-fuchsia-300 text-fuchsia-300 transition-all text-center flex flex-col items-center gap-1 shadow-[0_0_20px_rgba(217,70,239,0.15)] group"
            >
              <Phone className="w-4 h-4 text-fuchsia-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] tracking-wider uppercase font-bold">Call</span>
            </motion.a>
          )}
        </div>

        {/* Futuristic Cyber Links */}
        <div className="space-y-3">
          {activeLinks.map((link) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-black via-[#060b17] to-black border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,255,240,0.35)] transition-all group"
                dir="ltr"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center p-2 group-hover:scale-110 transition-all">
                    <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-100 group-hover:text-cyan-300 tracking-wide uppercase">
                      {link.title}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            ))}
        </div>
      </motion.div>

      <footer className="py-6 text-center text-[10px] text-cyan-500/60 font-mono tracking-widest uppercase">
        <span>CYBER_MATRIX // 2025 // NOVAWEB PROFILE</span>
      </footer>
    </div>
  );
}
