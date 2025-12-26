import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Share2, Info, Mail, DollarSign } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "projects", label: "Projects", icon: Share2, path: "/projects" },
  { id: "pricing", label: "Pricing", icon: DollarSign, path: "/pricing" },
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

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeId);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] safe-area-inset-bottom md:hidden">
      {/* Backdrop - modern glassmorphism */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
      
      {/* Premium gradient border top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cyan-400/10 via-cyan-400/5 to-transparent pointer-events-none blur-sm" />
      
      {/* Animated particles effect background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-40 h-40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 20, -20, 0],
              y: [0, 10, -10, 0],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${-50 + i * 30}%`,
            }}
          />
        ))}
      </div>
      
      <div className="relative">
        <div className="max-w-full mx-auto px-2 pt-3 pb-4">
          <div className="flex items-center justify-around gap-0.5">
            {/* Animated highlight background */}
            <motion.div
              className="absolute left-2 right-2 h-14 bg-gradient-to-r from-cyan-500/20 via-blue-500/25 to-cyan-500/20 rounded-xl"
              layoutId="navHighlight"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
                mass: 0.6,
              }}
              style={{
                width: `calc(${100 / NAV_ITEMS.length}% - 4px)`,
                left: `calc(${activeIndex * (100 / NAV_ITEMS.length)}% + 8px)`,
              }}
            />

            {/* Glow effect for active item */}
            <motion.div
              className="absolute left-0 right-0 h-20 bg-gradient-to-b from-cyan-500/10 to-transparent blur-xl pointer-events-none"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              style={{
                top: "-10px",
                left: `${activeIndex * (100 / NAV_ITEMS.length) + 8}%`,
                width: `${100 / NAV_ITEMS.length}%`,
              }}
            />

            {/* Nav items */}
            {NAV_ITEMS.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className="relative flex flex-col items-center justify-center gap-1 flex-1 py-2 px-1 rounded-xl z-10 group cursor-pointer overflow-hidden"
                  whileTap={{ 
                    scale: 0.88,
                  }}
                  whileHover={{ 
                    scale: isActive ? 1 : 1.08,
                  }}
                >
                  {/* Hover ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                  />

                  <div className="relative z-10 flex flex-col items-center gap-1">
                    {/* Icon container */}
                    <motion.div
                      className="relative flex items-center justify-center"
                      animate={{
                        scale: isActive ? 1.25 : 1,
                        y: isActive ? -3 : 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        mass: 0.5,
                      }}
                    >
                      {/* Icon glow */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-cyan-400/40 rounded-full blur-lg"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 0.3, 0.6],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}

                      <motion.div
                        animate={{
                          color: isActive ? "rgb(34, 211, 238)" : "rgb(156, 163, 175)",
                          filter: isActive
                            ? "drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))"
                            : "drop-shadow(0 0 0px)",
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Icon 
                          className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" 
                          strokeWidth={2.2}
                          fill={isActive ? "currentColor" : "none"}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Label with stagger animation */}
                    <motion.span
                      className="text-[9px] sm:text-xs font-bold tracking-wider uppercase block leading-tight h-3"
                      animate={{
                        color: isActive ? "rgb(34, 211, 238)" : "rgb(156, 163, 175)",
                        textShadow: isActive
                          ? "0 0 10px rgba(34, 211, 238, 0.5)"
                          : "none",
                        opacity: isActive ? 1 : 0.7,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
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
