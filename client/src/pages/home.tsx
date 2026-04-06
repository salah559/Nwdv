import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Project } from "@shared/schema";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [, setLocation] = useLocation();

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["home-favorite-projects"],
    queryFn: async () => {
      const q = query(
        collection(db, "projects"), 
        where("isFavorite", "==", true)
      );
      const snap = await getDocs(q);
      const results = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Project[];
      // Sort client-side to avoid needing a Firebase composite index
      return results
        .sort((a, b) => {
          const aTime = (a.createdAt as any)?.toMillis?.() ?? 0;
          const bTime = (b.createdAt as any)?.toMillis?.() ?? 0;
          return bTime - aTime;
        })
        .slice(0, 3);
    }
  });

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
            {isLoadingProjects ? (
              <div className="col-span-1 md:col-span-3 flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : projects && projects.length > 0 ? (
              projects.map((project, idx) => (
                <ProjectCard 
                  key={project.id}
                  index={idx}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  link={project.link}
                />
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center text-muted-foreground py-8">
                No featured projects right now.
              </div>
            )}
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

function ProjectCard({ title, description, image, link, index }: { title: string, description: string, image: string, link: string, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className={`group glass rounded-3xl border border-white/5 hover:border-primary/40 cursor-pointer relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(6,255,240,0.12)] ${index === 1 ? 'md:-translate-y-8' : ''}`}
      onClick={() => window.open(link, '_blank')}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute bottom-3 left-4 text-xs font-ui font-bold text-primary/60 uppercase tracking-[0.3em]">
          Project 0{index + 1}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-2xl font-display font-bold group-hover:text-primary transition-colors duration-300">{title}</h3>
            <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300 ml-3 flex-shrink-0">
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2">{description}</p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/30 rounded-xl text-sm font-ui font-bold text-primary uppercase tracking-widest group-hover:bg-primary group-hover:text-black group-hover:shadow-[0_0_20px_rgba(6,255,240,0.4)] transition-all duration-300">
            Visit Project →
          </div>
        </div>
      </div>
    </motion.div>
  );
}