import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, ExternalLink, Sparkles, User, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang, Lang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ar", label: "عر", flag: "🇩🇿" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

export function DashboardHeader() {
  const { lang, setLang } = useLang();
  const { userProfile, signOut } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGS.find(l => l.code === lang) ?? LANGS[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090e]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <span className="text-base sm:text-lg font-bold font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 cursor-pointer hover:opacity-85 transition-opacity">
              NOVAWEB
            </span>
          </Link>
          <span className="hidden sm:inline-block w-px h-4 bg-white/15" />
          <Link href="/dashboard">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white px-2 py-0.5 rounded-lg bg-white/5 border border-white/5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>لوحة التحكم</span>
            </span>
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Subdomain Preview Badge for Mobile & Desktop */}
          {userProfile && (
            <a
              href={`https://${userProfile.username}.novawebdv.com`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-mono bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-1 rounded-xl transition-all"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{userProfile.username}.novawebdv.com</span>
            </a>
          )}

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-400/40 transition-all text-gray-300 hover:text-white text-xs"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold text-[11px]">{currentLang.flag} {currentLang.label}</span>
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="absolute left-0 mt-2 z-50 bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[120px]"
                >
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3.5 py-2 text-xs transition-colors ${lang === l.code ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                    >
                      <span>{l.flag}</span> <span>{l.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar Pill */}
          {userProfile && (
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-r border-white/10 mr-1">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-cyan-400/40 p-0.5 bg-black">
                <img
                  src={userProfile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"}
                  alt={userProfile.fullName}
                  className="w-full h-full object-cover rounded-[8px]"
                />
              </div>
              <span className="hidden lg:inline-block text-xs font-semibold text-white max-w-[120px] truncate">
                {userProfile.fullName.split(" ")[0]}
              </span>
            </div>
          )}

          {/* Sign Out Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0 rounded-xl"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
