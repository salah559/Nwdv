import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang, Lang } from "@/lib/i18n";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ar", label: "عر", flag: "🇩🇿" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

function LangSwitcher({ mobile = false }: { mobile?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGS.find(l => l.code === lang) ?? LANGS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/30 transition-all text-gray-300 hover:text-white ${mobile ? "w-full justify-center text-sm" : "text-xs"}`}
      >
        <Globe className="w-3.5 h-3.5 text-primary" />
        <span className="font-bold">{current.flag} {current.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className={`absolute ${mobile ? "left-1/2 -translate-x-1/2" : "right-0"} mt-2 z-[200] bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[120px]`}
          >
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${lang === l.code ? "bg-primary/20 text-primary font-bold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
              >
                <span>{l.flag}</span> <span>{l.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { t } = useLang();
  const [location] = useLocation();

  const navLinks = [
    { key: "nav_home" as const, href: "/" },
    { key: "nav_about" as const, href: "/about" },
    { key: "nav_projects" as const, href: "/projects" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-0 hidden md:block">
      <div className="container mx-auto max-w-5xl">
        <div className="relative glass-nav rounded-2xl border border-white/10 px-6 h-14 flex items-center justify-between transition-all duration-300 hover:border-white/20 !overflow-visible">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img 
                  src="/assets/logo.png" 
                  alt="Novaweb Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(6,255,240,0.5)] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-base font-bold font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 hover:opacity-80 transition-opacity">
                NOVAWEB
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
              >
                <span className={`text-[11px] font-semibold transition-all duration-300 font-ui tracking-[0.2em] uppercase relative group cursor-pointer ${location === link.href ? "text-primary" : "text-gray-400 hover:text-white"}`}>
                  {t(link.key)}
                  <span className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 ${location === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
                </span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Link href="/contact">
              <Button className="hidden md:inline-flex bg-primary text-black hover:bg-cyan-400 font-ui text-[11px] uppercase font-bold tracking-widest h-9 px-5 border border-primary/10 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,255,240,0.3)] hover:scale-105">
                {t("nav_contact")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}