import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, Loader2, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { Project } from "@shared/schema";
import { useLang } from "@/lib/i18n";

export default function Projects() {
  const { t } = useLang();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const q = query(collection(db, "projects"));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      return results.sort((a, b) => {
        const aTime = (a.createdAt as any)?.toMillis?.() ?? 0;
        const bTime = (b.createdAt as any)?.toMillis?.() ?? 0;
        return bTime - aTime;
      });
    }
  });

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              {t("projects_page_h1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{t("projects_page_h1_accent")}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("projects_page_sub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(projects ?? []).map((project, idx) => (
              <motion.div
                key={project.id ?? idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={() => window.open(project.link, '_blank')}
                className="group glass rounded-2xl border border-white/5 overflow-hidden hover:border-primary/40 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_60px_rgba(6,255,240,0.1)]"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Hover arrow */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                    <div className="p-2 bg-primary rounded-xl shadow-[0_0_15px_rgba(6,255,240,0.6)]">
                      <ArrowUpRight className="w-4 h-4 text-black" />
                    </div>
                  </div>
                  {/* Featured badge */}
                  {project.isFavorite && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-yellow-500/90 rounded-full text-black text-[10px] font-bold uppercase tracking-widest">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs text-primary/60 font-ui uppercase tracking-widest mb-2">{project.type}</p>
                  <h3 className="text-xl font-display font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-5 line-clamp-2 leading-relaxed">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-primary font-ui font-bold uppercase text-xs tracking-wider">
                      {t("projects_page_visit")} <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); window.open(project.link, '_blank'); }}
                      className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300"
                      title={t("projects_page_visit")}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400 hover:text-primary transition-colors" />
                    </button>
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
            {t("projects_page_cta_h2")}
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            {t("projects_page_cta_sub")}
          </p>
          <Button 
            size="lg" 
            className="bg-primary text-black hover:bg-cyan-400 font-ui font-bold uppercase tracking-widest px-8"
            onClick={() => window.open('https://wa.me/213663699433?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%AA%D8%B7%D9%88%D9%8I%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%82%D8%B9', '_blank')}
          >
            {t("projects_page_cta_btn")}
          </Button>
        </div>
      </section>
    </div>
  );
}
;
}