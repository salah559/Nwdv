import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Nova Restaurant",
      description: "Modern restaurant website featuring elegant design and menu showcase",
      type: "Demo restaurant website • 2025",
      image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=400&fit=crop",
      link: "https://salah559.github.io/Nova-restaurants-/",
    },
    {
      title: "Enova",
      description: "E-commerce platform with shopping cart and product catalog",
      type: "Demo e-commerce store • 2025",
      image: "https://images.unsplash.com/photo-1661956600684-38aa08e340d0?w=600&h=400&fit=crop",
      link: "https://enova-tau.vercel.app/",
    },
    {
      title: "Sweet",
      description: "Candy shop website with product gallery and online ordering",
      type: "Demo candy shop • 2025",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
      link: "https://snaky666.github.io/sweet-/#products",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Projects</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Demo projects • Click any project to visit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                onClick={() => window.open(project.link, '_blank')}
                className="group glass rounded-xl border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-300 hover:bg-white/5 cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{project.type}</p>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex items-center gap-2 text-primary font-ui font-bold uppercase text-sm tracking-wider group-hover:gap-3 transition-all">
                    Visit Project <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl" />
        
        <div className="container mx-auto max-w-2xl relative text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Have a project in mind?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Let's talk about your next big idea.
          </p>
          <Button 
            size="lg" 
            className="bg-primary text-black hover:bg-cyan-400 font-ui font-bold uppercase tracking-widest px-8"
            onClick={() => window.open('https://wa.me/213663699433?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%AA%D8%B7%D9%88%D9%8A%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%82%D8%B9', '_blank')}
          >
            Chat on WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
}