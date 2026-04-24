import { motion } from "framer-motion";
import { Users, Target, Rocket, Shield } from "lucide-react";
import { useLang } from "@/lib/i18n";

export default function About() {
  const { t } = useLang();
  const features = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: t("about_f1_title"),
      description: t("about_f1_desc")
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: t("about_f2_title"),
      description: t("about_f2_desc")
    },
    {
      icon: <Rocket className="w-8 h-8 text-primary" />,
      title: t("about_f3_title"),
      description: t("about_f3_desc")
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: t("about_f4_title"),
      description: t("about_f4_desc")
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative">
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
              {t("about_h1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Novaweb</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("about_sub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4 text-white">{t("about_team")}</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-12" />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto glass-panel p-8 rounded-3xl border border-white/10"
            >
              {t("about_sub")}
            </motion.p>
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