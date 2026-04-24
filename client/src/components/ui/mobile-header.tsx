import { Link } from "wouter";
import { MobileLangSwitcher } from "./mobile-lang-switcher";

export function MobileHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 md:hidden">
      <div className="glass-nav rounded-2xl border border-white/10 px-4 h-14 flex items-center justify-between !overflow-visible">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <img 
              src="/assets/logo.png" 
              alt="Novaweb Logo" 
              className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(6,255,240,0.5)]"
            />
            <span className="text-sm font-bold font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              NOVAWEB
            </span>
          </div>
        </Link>
        <div className="relative">
           <MobileLangSwitcher isHeader />
        </div>
      </div>
    </div>
  );
}
