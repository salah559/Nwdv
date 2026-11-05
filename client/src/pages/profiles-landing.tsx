import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Sparkles, 
  Globe, 
  Palette, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  Check, 
  ExternalLink, 
  Star,
  Layers,
  Crown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SEO } from "@/components/SEO";
import { useLang } from "@/lib/i18n";
import { TEMPLATES } from "@/lib/templates-data";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

export default function ProfilesLanding() {
  const { t, isRTL } = useLang();
  const [, setLocation] = useLocation();

  const previewUsernames = [
    { name: "Salah Eddine", username: "salah", role: "Full-Stack Dev", template: "neon-developer" },
    { name: "Ahmed Benali", username: "ahmed", role: "UI/UX Designer", template: "creative-designer" },
    { name: "Amina Kaci", username: "amina", role: "Business Consultant", template: "luxury-black-gold" },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-cyan-500/30 overflow-hidden relative">
      <SEO 
        title="Novaweb Profile — هويتك الرقمية في رابط واحد" 
        description="أنشئ موقعك الشخصي بنطاق فرعي مخصص username.novawebdv.com وقوالب عصرية فائقة السرعة."
      />

      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[10%] right-[10%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 relative z-10">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-ui font-bold tracking-widest text-cyan-300 uppercase">
                {t("saas_hero_badge")}
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight mb-8 leading-[1.15]"
          >
            <span>{t("saas_hero_title")}</span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 drop-shadow-[0_0_30px_rgba(6,255,240,0.3)]">
              {t("saas_hero_title_accent")}
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed mb-10"
          >
            {t("saas_hero_desc")}
          </motion.p>

          {/* Subdomain Input Simulation */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto mb-10 p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center px-4 py-2 w-full text-left" dir="ltr">
              <span className="text-cyan-400 font-mono font-bold">https://</span>
              <span className="text-white font-mono font-bold mx-1">yourname</span>
              <span className="text-gray-500 font-mono">.novawebdv.com</span>
            </div>
            <Button
              size="lg"
              onClick={() => setLocation("/auth/register")}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-90 font-ui font-bold uppercase tracking-wider rounded-xl h-12 px-6 shadow-[0_0_20px_rgba(6,255,240,0.4)]"
            >
              {t("saas_cta_start")}
            </Button>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400"
          >
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>تجربة مجانية 7 أيام</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>بدون بطاقة بنكية</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>جاهز في أقل من 60 ثانية</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Subdomain Showcase / Examples */}
      <section className="py-16 px-4 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              أمثلة على نطاقات ومواقع مستخدمينا
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              كل عضو يحصل على نطاق شخصي احترافي جاهز للمشاركة على السيرة الذاتية وإنستغرام ولينكد إن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previewUsernames.map((u, i) => (
              <motion.div
                key={u.username}
                whileHover={{ y: -6 }}
                className="rounded-2xl p-6 bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center font-bold text-black text-sm">
                      {u.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{u.name}</h4>
                      <p className="text-xs text-cyan-400">{u.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-white/20 text-gray-300">
                    Live Demo
                  </Badge>
                </div>

                <div 
                  className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-gray-300 mb-4 flex items-center justify-between cursor-pointer group-hover:border-cyan-500/40 transition-colors"
                  dir="ltr"
                  onClick={() => setLocation(`/p/${u.username}`)}
                >
                  <span className="truncate">{u.username}.novawebdv.com</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-white/10 hover:border-cyan-400 text-xs font-ui"
                  onClick={() => setLocation(`/p/${u.username}`)}
                >
                  معاينة الموقع الشخصي
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              {t("saas_features_title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {t("saas_features_accent")}
              </span>
            </h2>
            <div className="w-16 h-1 bg-cyan-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/[0.03] border-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{t("saas_feat1_title")}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t("saas_feat1_desc")}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-400">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{t("saas_feat2_title")}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t("saas_feat2_desc")}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/10 hover:border-cyan-500/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4 text-cyan-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{t("saas_feat3_title")}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t("saas_feat3_desc")}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.03] border-white/10 hover:border-teal-500/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-4 text-teal-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{t("saas_feat4_title")}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{t("saas_feat4_desc")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Templates Showcase Section */}
      <section className="py-20 px-4 bg-white/[0.01] border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4" />
                <span>8 قوالب عالمية متميزة</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                اختر المظهر الذي يعكس تميزك
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              قوالب صُممت لتتوافق مع شخصيتك، سواء كنت مطوراً، مصمماً، رائد أعمال أو صانع محتوى.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEMPLATES.map((tmpl) => (
              <motion.div
                key={tmpl.id}
                whileHover={{ y: -6 }}
                className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={tmpl.thumbnail} 
                      alt={tmpl.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 right-3">
                      {tmpl.isPremium ? (
                        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold border-none shadow-lg flex items-center gap-1 text-[11px]">
                          <Crown className="w-3 h-3" />
                          <span>Premium • {tmpl.priceDZD} دج</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-cyan-500/90 text-black font-bold border-none text-[11px]">
                          مجاني Free
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base text-white mb-1">{tmpl.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                      {tmpl.description}
                    </p>
                    <div className="space-y-1">
                      {tmpl.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                          <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-white/10 hover:border-cyan-400"
                    onClick={() => setLocation("/auth/register")}
                  >
                    استخدم هذا القالب
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-display font-bold mb-4">
              {t("saas_pricing_title")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                {t("saas_pricing_accent")}
              </span>
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              {t("saas_pricing_trial_badge")}
            </p>
          </div>

          <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-white/10 to-white/[0.03] border border-cyan-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,255,240,0.15)]">
            <div className="absolute -top-4 right-8">
              <Badge className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold px-4 py-1.5 text-xs uppercase tracking-widest shadow-lg">
                خطة شاملة
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">عضوية Novaweb Profile</h3>
                <p className="text-gray-300 text-sm max-w-md">
                  ابدأ بـ 7 أيام تجربة مجانية تامة، ثم استمر بسعر بسيط وفي متناول الجميع.
                </p>
              </div>

              <div className="text-right" dir="ltr">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">
                    {t("saas_pricing_amount")}
                  </span>
                  <span className="text-gray-400 font-ui text-sm">{t("saas_pricing_period")}</span>
                </div>
                <div className="text-xs text-cyan-400 mt-1 font-semibold">
                  طرق دفع محلية: BaridiMob & CCP
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t("saas_pricing_f1")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t("saas_pricing_f2")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t("saas_pricing_f3")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{t("saas_pricing_f4")}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-200 sm:col-span-2">
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Star className="w-3.5 h-3.5" />
                </div>
                <span>{t("saas_pricing_f5")}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                size="lg"
                onClick={() => setLocation("/auth/register")}
                className="w-full sm:flex-1 h-14 bg-cyan-400 hover:bg-cyan-300 text-black font-ui font-extrabold uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(6,255,240,0.4)] text-base"
              >
                {t("saas_cta_start")}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setLocation("/auth/login")}
                className="w-full sm:w-auto h-14 px-8 border-white/20 text-white hover:bg-white/10 font-ui font-bold rounded-xl"
              >
                {t("saas_cta_login")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
