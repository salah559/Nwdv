import { useState, useEffect } from "react";
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
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SALAH_PERMANENT_PROFILE } from "@/lib/permanent-profiles";

interface ExampleProfile {
  name: string;
  username: string;
  role: string;
  template: string;
  avatarUrl?: string | null;
  isPermanent?: boolean;
  badge?: string;
}

const SALAH_EXAMPLE: ExampleProfile = {
  name: SALAH_PERMANENT_PROFILE.fullName,
  username: SALAH_PERMANENT_PROFILE.username,
  role: SALAH_PERMANENT_PROFILE.jobTitle || "Founder & Full-Stack Architect",
  template: SALAH_PERMANENT_PROFILE.templateId,
  avatarUrl: SALAH_PERMANENT_PROFILE.avatarUrl,
  isPermanent: true,
  badge: "🌟 مثال دائم (Founder)",
};

const DEFAULT_FALLBACK_EXAMPLES: ExampleProfile[] = [
  {
    name: "Ahmed Benali",
    username: "ahmed",
    role: "UI/UX Designer",
    template: "creative-designer",
    avatarUrl: null,
    isPermanent: false,
    badge: "Live Demo",
  },
  {
    name: "Amina Kaci",
    username: "amina",
    role: "Business Consultant",
    template: "luxury-black-gold",
    avatarUrl: null,
    isPermanent: false,
    badge: "Live Demo",
  },
];

export default function ProfilesLanding() {
  const { t, isRTL } = useLang();
  const [, setLocation] = useLocation();

  const [examples, setExamples] = useState<ExampleProfile[]>([
    SALAH_EXAMPLE,
    ...DEFAULT_FALLBACK_EXAMPLES,
  ]);

  // Dynamically load real published accounts from Firestore
  useEffect(() => {
    let isMounted = true;
    async function loadRealAccounts() {
      try {
        const q = query(
          collection(db, "profiles"),
          where("isPublished", "==", true),
          limit(12)
        );
        const snap = await getDocs(q);
        const realUsers: ExampleProfile[] = [];

        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.username && data.username.toLowerCase().trim() !== "salah") {
            realUsers.push({
              name: data.fullName || data.username,
              username: data.username.toLowerCase().trim(),
              role: data.jobTitle || "صانع محتوى / محترف",
              template: data.templateId || "modern-minimalist",
              avatarUrl: data.avatarUrl || null,
              isPermanent: false,
              badge: "🟢 عضو حقيقي Live",
            });
          }
        });

        if (isMounted) {
          // Always Salah as permanent example #1, followed by real accounts, then fallbacks if fewer than 3
          const combined: ExampleProfile[] = [
            SALAH_EXAMPLE,
            ...realUsers,
            ...(realUsers.length < 2 ? DEFAULT_FALLBACK_EXAMPLES.slice(realUsers.length) : []),
          ];
          setExamples(combined);
        }
      } catch (err) {
        console.warn("Could not load dynamic real accounts from Firestore:", err);
      }
    }

    loadRealAccounts();
    return () => {
      isMounted = false;
    };
  }, []);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>نماذج وأمثلة حقيقية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
              أمثلة حية على نطاقات ومواقع مستخدمينا
            </h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              كل حساب يتم إنشاؤه ونشره يصبح مثالاً حياً في المنصة. تصفح موقع المؤسس الدائم ومواقع الأعضاء الحقيقيين:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examples.map((u) => {
              const fullSubdomainUrl = `https://${u.username}.novawebdv.com`;
              return (
                <motion.div
                  key={u.username}
                  whileHover={{ y: -6 }}
                  className={`rounded-2xl p-6 border backdrop-blur-md relative overflow-hidden group transition-all duration-300 ${
                    u.isPermanent 
                      ? "bg-gradient-to-b from-amber-500/15 via-white/5 to-white/5 border-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.15)]" 
                      : "bg-gradient-to-b from-white/10 to-white/5 border-white/10 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img 
                          src={u.avatarUrl} 
                          alt={u.name} 
                          className={`w-11 h-11 rounded-full object-cover border-2 ${u.isPermanent ? "border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]" : "border-cyan-400/50"}`} 
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center font-bold text-black text-sm">
                          {u.name[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.isPermanent && <span className="text-amber-400 text-xs">👑</span>}
                        </h4>
                        <p className="text-xs text-cyan-400 font-medium">{u.role}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-[10px] ${
                        u.isPermanent 
                          ? "bg-amber-400/20 text-amber-300 border-amber-400/60 font-bold" 
                          : "border-cyan-500/30 text-cyan-300 bg-cyan-500/10"
                      }`}
                    >
                      {u.badge}
                    </Badge>
                  </div>

                  <a
                    href={fullSubdomainUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-gray-300 mb-4 flex items-center justify-between cursor-pointer group-hover:border-cyan-500/50 transition-colors block"
                    dir="ltr"
                  >
                    <span className="truncate font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {u.username}.novawebdv.com
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />
                  </a>

                  <Button 
                    variant={u.isPermanent ? "default" : "outline"}
                    size="sm" 
                    className={`w-full text-xs font-ui ${
                      u.isPermanent 
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold hover:opacity-95 shadow-md shadow-amber-500/20" 
                        : "border-white/15 hover:border-cyan-400 hover:bg-cyan-500/10 text-white"
                    }`}
                    onClick={() => setLocation(`/p/${u.username}`)}
                  >
                    معاينة الموقع الشخصي
                  </Button>
                </motion.div>
              );
            })}
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
                <span>{TEMPLATES.length} قالباً عالمياً متميزاً</span>
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
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                      {tmpl.isPremium ? (
                        <>
                          <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold border-none shadow-lg flex items-center gap-1 text-[11px]">
                            <Crown className="w-3 h-3" />
                            <span>Premium • {tmpl.priceDZD} دج</span>
                          </Badge>
                          {tmpl.originalPriceDZD && (
                            <span className="text-[10px] font-bold text-amber-300 bg-black/85 px-1.5 py-0.5 rounded border border-amber-400/40 line-through">
                              {tmpl.originalPriceDZD} دج (-10%)
                            </span>
                          )}
                        </>
                      ) : (
                        <Badge className="bg-emerald-500 text-black font-extrabold border-none text-[11px] shadow-md shadow-emerald-500/20">
                          مجاني Free (0 دج)
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base text-white mb-1">{tmpl.name}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                      {tmpl.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {tmpl.features.slice(0, 2).map((feat, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-300 border border-white/5">
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation("/auth/register")}
                    className="w-full border-white/10 hover:border-cyan-400 hover:bg-cyan-500/10 text-xs font-ui group-hover:text-cyan-300 transition-colors"
                  >
                    استخدم هذا القالب
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Plan Section */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,255,240,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8 pb-8 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">عضوية Novaweb Profile</h3>
                <p className="text-gray-300 text-sm max-w-md">
                  ابدأ بـ 7 أيام تجربة مجانية تامة، ثم استمر بسعر بسيط وفي متناول الجميع.
                </p>
              </div>

              <div className="text-right flex flex-col sm:flex-row items-end gap-3" dir="ltr">
                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-right">
                  <div className="text-xs text-cyan-400 font-bold uppercase mb-0.5">شهري Monthly</div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white">500 دج</span>
                    <span className="text-gray-400 font-ui text-xs">/ شهر</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.2)] text-right relative">
                  <div className="text-[10px] font-black text-amber-300 uppercase mb-0.5 flex items-center justify-end gap-1">
                    <span>سنوي VIP</span>
                    <span className="bg-amber-400 text-black px-1 rounded text-[9px] font-extrabold">وفر 2000 دج</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-amber-300">4,000 دج</span>
                    <span className="text-amber-200/70 font-ui text-xs">/ سنة</span>
                  </div>
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
