import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, Code, Zap, Rocket, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen text-foreground overflow-hidden selection:bg-primary/30 relative">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-purple-500 z-[60] origin-left"
        style={{ scaleX }}
      />
      {/* Background Video - Hidden on slow devices/mobile for performance if needed, or optimized */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/bg-hero-3d.png"
        className="fixed inset-0 w-full h-full object-cover z-[-20] opacity-60 md:opacity-100"
      >
        <source src="/bg-video-new.mp4" type="video/mp4" />
      </video>
      
      {/* Optional: Dark Overlay to ensure text readability */}
      <div className="fixed inset-0 bg-black/40 z-[-19]" />
      
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
        style={{
          zIndex: 1
        }}
      >
        <div className="container relative z-10 px-4 pt-16 flex flex-col items-start justify-center h-full pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl pointer-events-auto"
          >
            <div className="inline-block px-3 py-1 mb-4 border border-primary/30 rounded-full bg-primary/10">
              <span className="text-xs font-ui font-bold tracking-[0.2em] text-primary uppercase">
                Digital Excellence
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.2] mb-6">
              <div className="inline-block px-2 rounded max-w-full">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 drop-shadow-2xl break-words">
                  Your success deserves
                </span>
              </div>
              <br className="hidden sm:block" />
              <div className="inline-block px-2 rounded mt-2 max-w-full">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-blue-500 drop-shadow-[0_0_15px_rgba(6,255,240,0.5)] break-words">
                  to be measured digitally
                </span>
              </div>
            </h1>
            
            <div className="inline-block px-2 rounded mb-12 max-w-full">
              <p className="text-base sm:text-xl md:text-2xl text-gray-300 font-light leading-relaxed max-w-2xl drop-shadow-md break-words">
                We build high-performance design systems and digital experiences that drive growth through technical excellence.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button 
                size="lg" 
                className="bg-primary text-black hover:bg-cyan-400 font-ui font-bold uppercase tracking-widest px-10 h-16 rounded-xl transition-all duration-300 hover:scale-105 btn-pulse group"
                onClick={() => {
                  setLocation("/contact");
                }}
              >
                Get Your Website <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/10 text-white hover:bg-white/5 font-ui font-bold uppercase tracking-widest px-10 h-16 rounded-xl transition-all duration-300 hover:border-primary/50"
                onClick={() => {
                  const element = document.getElementById('projects');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Projects
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-ui">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent animate-bounce" />
        </motion.div>
      </section>

      {/* What We Do Section */}
      <section id="services" className="relative py-20 md:py-32 z-10 bg-background/40 backdrop-blur-md border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                What we <span className="text-primary">do</span>
              </h2>
              <div className="w-20 h-1 bg-primary" />
            </div>
            <p className="max-w-md text-muted-foreground">
              Design and development services tailored to your business goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              index={0}
              emoji="💻"
              title="Web Design"
              description="Pixel-perfect UI, component libraries, and accessible interfaces."
            />
            <ServiceCard 
              index={1}
              emoji="⚙️"
              title="Web Development"
              description="Scalable, maintainable code, optimized for performance."
            />
            <ServiceCard 
              index={2}
              emoji="🚀"
              title="SEO & Performance"
              description="Speed, structure, and basics to improve discoverability."
            />
          </div>
        </div>
      </section>

      {/* Selected Projects Section */}
      <section id="projects" className="relative py-20 md:py-32 z-10 bg-background/30 backdrop-blur-sm border-b border-white/5 transition-all duration-700 hover:backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Selected <span className="text-primary">projects</span>
              </h2>
              <div className="w-20 h-1 bg-primary" />
            </div>
            <p className="max-w-md text-muted-foreground">
              Demo websites — our clients get more professional sites with custom domain and professional hosting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <ProjectCard 
              index={0}
              title="Nova Restaurant"
              description="Demo restaurant website • 2025"
              link="https://salah559.github.io/Nova-restaurants-/"
            />
            <ProjectCard 
              index={1}
              title="Enova"
              description="Demo e-commerce store • 2025"
              link="https://enova-tau.vercel.app/"
            />
            <ProjectCard 
              index={2}
              title="Sweet"
              description="Demo candy shop • 2025"
              link="https://snaky666.github.io/sweet-/#products"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-32 z-10 overflow-hidden bg-background/50 backdrop-blur-md">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="glass-panel p-12 md:p-24 rounded-2xl border border-white/10 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">start your project?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Get your website in the shortest time with the highest professionalism and lowest prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 font-ui font-bold uppercase tracking-widest px-10 h-14 rounded-lg relative overflow-hidden"
                onClick={() => setLocation("/contact")}
              >
                Let's Talk
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10 font-ui font-bold uppercase tracking-widest px-10 h-14 rounded-lg"
                onClick={() => window.open('https://wa.me/213663699433?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%AA%D8%B7%D9%88%D9%8A%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%82%D8%B9', '_blank')}
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 z-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-panel rounded-3xl p-12 md:p-16 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                <div className="text-3xl font-bold font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                  NOVAWEB
                </div>
                <p className="text-gray-400 leading-relaxed font-ui tracking-wide">
                  Building the digital future with precision, performance, and passion.
                </p>
              </div>
              
              <div className="space-y-6">
                <h4 className="text-white font-display font-bold text-lg uppercase tracking-widest">Navigation</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-400 hover:text-primary transition-colors font-ui uppercase tracking-widest text-sm">Home</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-primary transition-colors font-ui uppercase tracking-widest text-sm">Services</a></li>
                  <li><a href="#projects" className="text-gray-400 hover:text-primary transition-colors font-ui uppercase tracking-widest text-sm">Projects</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-display font-bold text-lg uppercase tracking-widest">Connect</h4>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-gray-400 group cursor-pointer hover:text-white transition-colors">
                    <Mail size={18} className="text-primary" />
                    <span className="font-ui tracking-widest text-sm">hello@novaweb.digital</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 group cursor-pointer hover:text-white transition-colors">
                    <Phone size={18} className="text-primary" />
                    <span className="font-ui tracking-widest text-sm">+213 (0) 555 000 000</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-display font-bold text-lg uppercase tracking-widest">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                    <span className="sr-only">Twitter</span>
                    <div className="w-5 h-5 bg-gray-400 rounded-sm" />
                  </a>
                  <a href="#" className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                    <span className="sr-only">LinkedIn</span>
                    <div className="w-5 h-5 bg-gray-400 rounded-sm" />
                  </a>
                  <a href="https://wa.me/213663699433" target="_blank" className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300">
                    <span className="sr-only">WhatsApp</span>
                    <div className="w-5 h-5 bg-gray-400 rounded-sm" />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-gray-500 text-sm font-ui tracking-widest">
                © 2025 NOVAWEB. ALL RIGHTS RESERVED.
              </p>
              <div className="flex gap-8">
                <a href="#" className="text-xs text-gray-500 hover:text-white font-ui uppercase tracking-[0.2em]">Privacy Policy</a>
                <a href="#" className="text-xs text-gray-500 hover:text-white font-ui uppercase tracking-[0.2em]">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ emoji, title, description, index }: { emoji: string, title: string, description: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group p-10 glass rounded-3xl border border-white/5 card-hover cursor-default overflow-hidden relative ${index % 2 === 1 ? 'md:mt-12' : ''}`}
    >
      <div className="absolute top-6 right-8 text-4xl font-display font-bold text-white/5 group-hover:text-primary/10 transition-colors">
        0{index + 1}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="text-6xl mb-8 inline-flex items-center justify-center w-20 h-20">
          {emoji}
        </div>
        <h3 className="text-3xl font-display font-bold mb-4 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-gray-400 text-lg leading-relaxed group-hover:text-gray-300 font-light">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

function ProjectCard({ title, description, link, index }: { title: string, description: string, link: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`group p-10 glass rounded-3xl border border-white/5 card-hover cursor-pointer relative overflow-hidden ${index === 1 ? 'md:-translate-y-8' : ''}`}
      onClick={() => window.open(link, '_blank')}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-xs font-ui font-bold text-primary/40 mb-2 uppercase tracking-[0.3em]">Project 0{index + 1}</div>
            <h3 className="text-3xl font-display font-bold group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-base text-gray-500 mt-3 font-light">{description}</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/20 transition-all duration-300 group-hover:rotate-12">
            <ExternalLink className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
          </div>
        </div>
        <div className="inline-block mt-4 px-6 py-3 bg-primary/10 border border-primary/30 rounded-xl text-sm font-ui font-bold text-primary uppercase tracking-widest group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_20px_rgba(6,255,240,0.5)] transition-all">
          Explore Case Study →
        </div>
      </div>
    </motion.div>
  );
}