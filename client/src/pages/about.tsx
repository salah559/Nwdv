import { Navbar } from "@/components/ui/navbar";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Shield, Box, TrendingUp } from "lucide-react";

export default function About() {
  const team = [
    {
      name: "Bouazza SalahEddine",
      role: "full stack developer",
      icon: Users,
    },
    {
      name: "Madi Mohamed Elhadi",
      role: "3D Designer",
      icon: Box,
    },
    {
      name: "Zerafi Oussama",
      role: "SEO Expert",
      icon: TrendingUp,
    },
    {
      name: "Kebsi Islam",
      role: "full stack developer",
      icon: Users,
    }
  ];

  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Expert Team",
      description: "Dedicated developers and designers with years of experience in modern web technologies."
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Our Mission",
      description: "To empower businesses through innovative digital solutions and exceptional web experiences."
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: "Fast Delivery",
      description: "We value your time, delivering high-quality websites in the shortest time possible."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Quality First",
      description: "No compromises on performance, security, or design quality in any project."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      
      {/* Background elements */}
      <div className="fixed inset-0 bg-black/40 z-[-10]" />
      <div className="fixed inset-0 bg-gradient-to-b from-primary/5 to-transparent z-[-11]" />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Novaweb</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We are a forward-thinking digital agency specializing in creating high-performance web experiences that drive business growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4 text-white">Our Experts</h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {team.map((member, idx) => {
              const IconComponent = member.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="glass-panel p-10 rounded-3xl border border-white/10 hover:border-primary/30 transition-all text-center group"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-2 text-white">{member.name}</h3>
                  <p className="text-primary font-ui uppercase tracking-widest text-sm">{member.role}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 glass rounded-2xl border border-white/5 hover:border-primary/50 transition-all"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-display font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}