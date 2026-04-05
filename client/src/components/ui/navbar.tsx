import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLang();

  const navLinks = [
    { key: "nav_home" as const, href: "/" },
    { key: "nav_about" as const, href: "/about" },
    { key: "nav_projects" as const, href: "/projects" },
    { key: "nav_pricing" as const, href: "/pricing" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-0 hidden md:block">
      <div className="container mx-auto max-w-4xl">
        <div className="relative glass-nav rounded-2xl border border-white/10 px-6 h-14 flex items-center justify-between transition-all duration-300 hover:border-white/20">
          {/* Logo */}
          <Link href="/">
            <span className="text-base font-bold font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 cursor-pointer hover:opacity-80 transition-opacity">
              NOVAWEB
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-[12px] font-semibold text-gray-400 hover:text-white transition-all duration-300 font-ui tracking-[0.2em] uppercase relative group"
              >
                {t(link.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <Link href="/contact">
              <Button className="hidden md:inline-flex bg-primary text-black hover:bg-cyan-400 font-ui text-[12px] uppercase font-bold tracking-widest h-9 px-6 border border-primary/10 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,255,240,0.3)] hover:scale-105">
                {t("nav_contact")}
              </Button>
            </Link>
            <button
              className="md:hidden text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mt-2 container mx-auto max-w-4xl md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="glass-nav rounded-2xl border border-white/10 p-4 flex flex-col gap-2"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/5 font-ui uppercase tracking-widest group"
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)", x: 8 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t(link.key)}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
              >
                <Link href="/contact">
                  <Button
                    className="w-full bg-primary text-black hover:bg-cyan-400 font-ui uppercase font-bold text-xs h-10 rounded-xl mt-2 transition-all duration-300 shadow-[0_0_20px_rgba(6,255,240,0.2)]"
                    onClick={() => setIsOpen(false)}
                  >
                    {t("nav_contact")}
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}