import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Share2, Info, Mail, CreditCard } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function BottomNav() {
  const { t } = useLang();
  const [location] = useLocation();
  
  const NAV_ITEMS = [
    { id: "home", label: t("nav_home"), icon: Home, path: "/" },
    { id: "projects", label: t("nav_projects"), icon: Share2, path: "/projects" },
    { id: "about", label: t("nav_about"), icon: Info, path: "/about" },
    { id: "pricing", label: t("nav_pricing"), icon: CreditCard, path: "/pricing" },
    { id: "contact", label: t("nav_contact"), icon: Mail, path: "/contact" },
  ];

  const [activeId, setActiveId] = useState(
    NAV_ITEMS.find((item) => item.path === location)?.id || "home"
  );

  useEffect(() => {
    const newActiveId = NAV_ITEMS.find((item) => item.path === location)?.id || "home";
    setActiveId(newActiveId);
  }, [location]);

  const handleNavigate = (path: string, id: string) => {
    setActiveId(id);
    window.location.href = path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] safe-area-inset-bottom md:hidden">
      {/* Backdrop blur effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/90 to-slate-900/40 backdrop-blur-xl" />
      
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
      
      <div className="relative">
        <div className="max-w-full mx-auto px-2 pt-2 pb-3">
          <div className="flex items-center justify-around gap-0.5">
            {/* Animated background pill */}
            <motion.div
              className="absolute top-2 h-12 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 rounded-2xl blur-md"
              layoutId="navBgPill"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8,
              }}
              style={{
                width: `calc(${100 / NAV_ITEMS.length}% - 8px)`,
                left: `calc(${(NAV_ITEMS.findIndex((item) => item.id === activeId) * 100) / NAV_ITEMS.length}% + 4px)`,
              }}
            />

            {/* Nav items */}
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item.path, item.id)}
                  className="relative flex flex-col items-center gap-0.5 flex-1 py-2 rounded-2xl transition-colors duration-300 group"
                  whileTap={{ scale: 0.92 }}
                >
                  {/* Hover background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  <div className="relative z-10">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        y: isActive ? -1 : 0,
                      }}
                      className="flex justify-center"
                    >
                      <motion.div
                        animate={{
                          color: isActive ? "rgb(6, 182, 212)" : "rgb(148, 163, 184)",
                          filter: isActive
                            ? "drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))"
                            : "drop-shadow(0 0 0px rgba(6, 182, 212, 0))",
                        }}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                      </motion.div>
                    </motion.div>

                    <motion.span
                      className="text-[8px] font-bold tracking-tight uppercase block mt-0.5 text-center"
                      animate={{
                        color: isActive ? "rgb(6, 182, 212)" : "rgb(148, 163, 184)",
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
