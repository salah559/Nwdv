import { useState } from "react";
import { useLang, Lang } from "@/lib/i18n";
import { Globe, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇩🇿" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export function MobileLangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  
  return (
    <div className="fixed bottom-24 right-4 z-[9999] md:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-[#0d1117] border border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[140px]"
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

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-primary text-black shadow-[0_0_20px_rgba(6,255,240,0.4)] hover:scale-105 active:scale-95 transition-all"
        aria-label="Change Language"
      >
        {open ? <ChevronUp className="w-6 h-6 rotate-180 transition-transform" /> : <Globe className="w-7 h-7" />}
      </button>
    </div>
  );
}
