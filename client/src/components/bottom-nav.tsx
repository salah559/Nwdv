import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, Share2, Settings, Info } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/" },
  { id: "projects", label: "Projects", icon: Share2, path: "/projects" },
  { id: "about", label: "About", icon: Info, path: "/about" },
  { id: "contact", label: "Contact", icon: Settings, path: "/contact" },
];

export function BottomNav() {
  const [location, setLocation] = useLocation();
  const [activeId, setActiveId] = useState(
    NAV_ITEMS.find((item) => item.path === location)?.id || "home"
  );

  const handleNavigate = (path: string, id: string) => {
    setActiveId(id);
    setLocation(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-900/95 backdrop-blur-xl border-t border-slate-700/50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative flex items-center justify-around py-4">
          {/* Animated background pill */}
          <motion.div
            className="absolute inset-y-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full"
            layoutId="activeNavBackground"
            initial={false}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30,
            }}
            style={{
              width: `${100 / NAV_ITEMS.length}%`,
              left: `${(NAV_ITEMS.findIndex((item) => item.id === activeId) * 100) / NAV_ITEMS.length}%`,
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
                className="relative flex flex-col items-center gap-1 flex-1 py-2 z-10"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    color: isActive ? "rgb(6, 182, 212)" : "rgb(148, 163, 184)",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <motion.span
                  className="text-xs font-medium"
                  animate={{
                    color: isActive ? "rgb(6, 182, 212)" : "rgb(148, 163, 184)",
                    fontSize: isActive ? "0.875rem" : "0.75rem",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                >
                  {item.label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
