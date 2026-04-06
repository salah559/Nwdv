import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Share2, Info, Mail } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "projects", label: "Projects", icon: Share2, path: "/projects" },
  { id: "about", label: "About", icon: Info, path: "/about" },
  { id: "contact", label: "Contact", icon: Mail, path: "/contact" },
];

export function BottomNav() {
  const [location] = useLocation();
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
        <div className="max-w-full mx-auto px-3 sm:px-4 pt-2 pb-3 sm:pb-4">
          <div className="flex items-center justify-around gap-1 sm:gap-2">
            {/* Animated background pill */}
            <motion.div
              className="absolute top-2 sm:top-3 h-12 sm:h-14 bg-gradient-to-br from-cyan-500/15 to-blue-500/10 rounded-2xl blur-md"
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
                  className="relative flex flex-col items-center gap-0.5 sm:gap-1 flex-1 py-2 sm:py-3 px-2 rounded-2xl transition-colors duration-300 group"
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Hover background */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  <div className="relative z-10">
                    <motion.div
                      animate={{
                        scale: isActive ? 1.3 : 1,
                        y: isActive ? -2 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        mass: 0.8,
                      }}
                      className="flex justify-center"
                    >
                      <motion.div
                        animate={{
                          color: isActive ? "rgb(6, 182, 212)" : "rgb(148, 163, 184)",
                          filter: isActive
                            ? "drop-shadow(0 0 12px rgba(6, 182, 212, 0.5))"
                            : "drop-shadow(0 0 0px rgba(6, 182, 212, 0))",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                      </motion.div>
                    </motion.div>

                    <motion.span
                      className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase block mt-0.5"
                      animate={{
                        color: isActive ? "rgb(6, 182, 212)" : "rgb(148, 163, 184)",
                        textShadow: isActive
                          ? "0 0 8px rgba(6, 182, 212, 0.4)"
                          : "0 0 0px rgba(6, 182, 212, 0)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
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
