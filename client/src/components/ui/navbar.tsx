import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Projects", href: "/projects" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4 md:px-0">
      <div className="container mx-auto max-w-4xl">
        <div className="relative glass-nav rounded-2xl border border-white/10 px-6 h-14 flex items-center justify-between transition-all duration-300 hover:border-white/20">
          {/* Logo */}
          <Link href="/">
            <span className="text-base font-bold font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 cursor-pointer hover:opacity-80 transition-opacity">
              NOVAWEB
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-[12px] font-semibold text-gray-400 hover:text-white transition-all duration-300 font-ui tracking-[0.2em] uppercase relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Right Side - CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/contact">
              <Button 
                className="hidden md:inline-flex bg-primary text-black hover:bg-cyan-400 font-ui text-[12px] uppercase font-bold tracking-widest h-9 px-6 border border-primary/10 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(6,255,240,0.3)] hover:scale-105"
              >
                Contact Us
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
      {isOpen && (
        <div className="mt-2 container mx-auto max-w-4xl md:hidden">
          <div className="glass-nav rounded-2xl border border-white/10 p-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold text-gray-300 hover:text-white transition-colors py-3 px-4 rounded-xl hover:bg-white/5 font-ui uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Link href="/contact">
              <Button 
                className="w-full bg-primary text-black hover:bg-cyan-400 font-ui uppercase font-bold text-xs h-10 rounded-xl mt-2 transition-all duration-300 shadow-[0_0_20px_rgba(6,255,240,0.2)]"
                onClick={() => setIsOpen(false)}
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}