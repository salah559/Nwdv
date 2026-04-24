import { useState } from "react";
import { useLang, Lang } from "@/lib/i18n";
import { Globe, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇩🇿" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export function MobileLangSwitcher({ isHeader = false }: { isHeader?: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const current = LANGS.find(l => l.code === lang) ?? LANGS[0];
  
  const containerClass = isHeader 
    ? "relative" 
    : "fixed top-4 right-4 z-[9999] md:hidden";

  return (
    <div className={containerClass}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white shadow-lg active:scale-95 transition-all"
      >
        <Globe className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-wider">{current.flag} {current.code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`absolute ${isHeader ? "top-10" : "top-12"} right-0 bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[120px] z-[200]`}
          >
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${lang === l.code ? "bg-primary/20 text-primary font-bold" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
              >
                <span>{l.label}</span>
                <span className="text-lg">{l.flag}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
