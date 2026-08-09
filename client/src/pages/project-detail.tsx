import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink, ArrowLeft, Loader2, Tag, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Project } from "@shared/schema";
import { useLocation } from "wouter";
import { SEO } from "@/components/SEO";

interface ProjectDetailProps {
  params: { id: string };
}

export default function ProjectDetail({ params }: ProjectDetailProps) {
  const [, setLocation] = useLocation();
  const { id } = params;

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const snap = await getDoc(doc(db, "projects", id));
      if (!snap.exists()) throw new Error("Project not found");
      return { id: snap.id, ...snap.data() } as Project;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-4 text-center">
        <p className="text-2xl text-gray-400">Project not found.</p>
        <Button onClick={() => setLocation("/projects")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title={project.title} 
        description={project.description} 
        image={project.image} 
      />
      <Navbar />

      {/* Background */}
      <div className="fixed inset-0 bg-black/50 z-[-10]" />
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 via-transparent to-purple-500/5 z-[-11]" />

      {/* Hero Image */}
      <div className="relative h-[55vh] w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => setLocation("/projects")}
          className="absolute top-28 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 hover:border-primary/50 text-sm font-ui tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Content */}
      <section className="relative z-10 -mt-24 pb-32 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="glass-panel rounded-3xl border border-white/10 p-10 md:p-16"
          >
            {/* Type badge */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-ui font-bold text-primary uppercase tracking-widest">
                  {project.type}
                </span>
              </div>
              {project.isFavorite && (
                <div className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
                  <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">⭐ Featured</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              {project.title}
            </h1>

            {/* Divider */}
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-purple-500 mb-8 rounded-full" />

            {/* Description */}
            <p className="text-xl text-gray-300 leading-relaxed mb-12 max-w-2xl">
              {project.description}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-primary text-black hover:bg-cyan-400 font-ui font-bold uppercase tracking-widest px-10 h-14 rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(6,255,240,0.3)] group"
                onClick={() => window.open(project.link, "_blank")}
              >
                Visit Project <ExternalLink className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 font-ui font-bold uppercase tracking-widest px-10 h-14 rounded-xl"
                onClick={() => setLocation("/projects")}
              >
                <ArrowLeft className="mr-2 w-5 h-5" /> All Projects
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
