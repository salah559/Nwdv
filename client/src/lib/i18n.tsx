import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "ar" | "fr";

const translations = {
  en: {
    nav_home: "Home", nav_about: "About", nav_projects: "Projects", nav_pricing: "Pricing", nav_contact: "Contact Us",
    hero_badge: "Digital Excellence", hero_h1a: "Your success deserves", hero_h1b: "to be measured digitally",
    hero_sub: "We build high-performance design systems and digital experiences that drive growth through technical excellence.",
    hero_cta_get: "Get Your Website", hero_cta_view: "View Projects", hero_scroll: "Scroll",
    services_title: "What we", services_title_accent: "do", services_sub: "Design and development services tailored to your business goals.",
    service1_title: "Web Design", service1_desc: "Pixel-perfect UI, component libraries, and accessible interfaces.",
    service2_title: "Web Development", service2_desc: "Scalable, maintainable code, optimized for performance.",
    service3_title: "SEO & Performance", service3_desc: "Speed, structure, and basics to improve discoverability.",
    projects_title: "Selected", projects_title_accent: "projects",
    projects_sub: "Demo websites — our clients get more professional sites with custom domain and professional hosting.",
    project_explore: "Explore Case Study →",
    cta_h2a: "Ready to", cta_h2b: "start your project?",
    cta_sub: "Get your website in the shortest time with the highest professionalism and lowest prices.",
    cta_talk: "Let's Talk", cta_whatsapp: "Chat on WhatsApp",
    footer_tagline: "Building the digital future with precision, performance, and passion.",
    footer_nav: "Navigation", footer_connect: "Connect", footer_follow: "Follow Us", footer_services: "Services",
    footer_privacy: "Privacy Policy", footer_terms: "Terms of Service", footer_rights: "© 2025 NOVAWEB. ALL RIGHTS RESERVED.",
    about_h1: "About", about_sub: "We are a forward-thinking digital agency specializing in creating high-performance web experiences that drive business growth.",
    about_team: "Our Experts",
    about_f1_title: "Expert Team", about_f1_desc: "Dedicated developers and designers with years of experience in modern web technologies.",
    about_f2_title: "Our Mission", about_f2_desc: "To empower businesses through innovative digital solutions and exceptional web experiences.",
    about_f3_title: "Fast Delivery", about_f3_desc: "We value your time, delivering high-quality websites in the shortest time possible.",
    about_f4_title: "Quality First", about_f4_desc: "No compromises on performance, security, or design quality in any project.",
    pricing_h1: "Transparent", pricing_h1_accent: "Pricing",
    pricing_sub: "Choose the perfect plan for your business needs. All prices in DA (Algerian Dinar).",
    pricing_popular: "Most Popular", pricing_getstarted: "Get Started",
    pricing_faq_h2: "Frequently Asked", pricing_faq_accent: "Questions",
    pricing_cta_h2: "Ready to get started?", pricing_cta_sub: "Contact us today for a free consultation about your project.", pricing_cta_btn: "Contact Us on WhatsApp",
    faq_q1: "Can prices be customized?", faq_a1: "Yes, the listed prices are base prices. We can customize packages according to your specific needs.",
    faq_q2: "How long does the project take?", faq_a2: "Typically: Portfolio 1-2 weeks, Store 2-3 weeks, Grand Business 1-2 months.",
    faq_q3: "Do you provide post-launch support?", faq_a3: "Yes, we provide full technical support and periodic maintenance depending on the package type.",
    faq_q4: "What payment methods are available?", faq_a4: "We accept bank transfer, electronic payment, and various other payment methods.",
    plan1_title: "Portfolio", plan1_desc: "Perfect for showcase websites and portfolios",
    plan1_f1: "Responsive Design", plan1_f2: "Contact Form", plan1_f3: "SEO Optimized", plan1_f4: "Fast Loading", plan1_f5: "Mobile Friendly",
    plan2_title: "Store Website", plan2_desc: "E-commerce solution for online selling",
    plan2_f1: "Product Catalog", plan2_f2: "Shopping Cart", plan2_f3: "Payment Integration", plan2_f4: "Inventory Management", plan2_f5: "Customer Dashboard", plan2_f6: "Order Tracking",
    plan3_title: "Grand Business Website + App", plan3_desc: "Complete business solution with web and mobile app",
    plan3_f1: "Custom Design", plan3_f2: "Web Application", plan3_f3: "Mobile App (iOS/Android)", plan3_f4: "Advanced Features", plan3_f5: "API Integration", plan3_f6: "Analytics Dashboard", plan3_f7: "Dedicated Support", plan3_f8: "Hosting & Maintenance",
    projects_page_h1: "All", projects_page_h1_accent: "Projects", projects_page_sub: "Demo projects • Click any project to visit.",
    projects_page_cta_h2: "Have a project in mind?", projects_page_cta_sub: "Let's talk about your next big idea.", projects_page_cta_btn: "Chat on WhatsApp", projects_page_visit: "Visit Project",
    contact_h1: "Contact", contact_h1_accent: "Us", contact_sub: "Tell us about your project — we usually reply within 24 hours.",
    contact_name: "Your Name", contact_email: "Your Email", contact_message: "Message", contact_send: "Send Message", contact_sending: "Sending...",
    contact_info_title: "Our Contacts", contact_location: "Location", contact_whatsapp: "Chat on WhatsApp",
  },
  ar: {
    nav_home: "الرئيسية", nav_about: "من نحن", nav_projects: "المشاريع", nav_pricing: "الأسعار", nav_contact: "تواصل معنا",
    hero_badge: "التميز الرقمي", hero_h1a: "نجاحك يستحق", hero_h1b: "أن يُقاس رقمياً",
    hero_sub: "نبني أنظمة تصميم عالية الأداء وتجارب رقمية تدفع النمو من خلال التميز التقني.",
    hero_cta_get: "احصل على موقعك", hero_cta_view: "استعرض المشاريع", hero_scroll: "تمرير",
    services_title: "ما نقوم", services_title_accent: "به", services_sub: "خدمات التصميم والتطوير مصممة لأهداف عملك.",
    service1_title: "تصميم الويب", service1_desc: "واجهات مثالية، مكتبات مكونات، وتصاميم متاحة.",
    service2_title: "تطوير الويب", service2_desc: "كود قابل للتوسع والصيانة، محسّن للأداء.",
    service3_title: "تحسين محركات البحث", service3_desc: "السرعة والبنية والأساسيات لتحسين ظهور موقعك.",
    projects_title: "مشاريع", projects_title_accent: "مختارة",
    projects_sub: "مواقع تجريبية — عملاؤنا يحصلون على مواقع أكثر احترافية مع نطاق خاص واستضافة.",
    project_explore: "استكشف →",
    cta_h2a: "هل أنت مستعد", cta_h2b: "لبدء مشروعك؟",
    cta_sub: "احصل على موقعك في أسرع وقت بأعلى احترافية وأقل الأسعار.",
    cta_talk: "تحدث معنا", cta_whatsapp: "تواصل عبر واتساب",
    footer_tagline: "نبني المستقبل الرقمي بدقة وأداء وشغف.",
    footer_nav: "التنقل", footer_connect: "تواصل", footer_follow: "تابعنا", footer_services: "الخدمات",
    footer_privacy: "سياسة الخصوصية", footer_terms: "شروط الخدمة", footer_rights: "© 2025 NOVAWEB. جميع الحقوق محفوظة.",
    about_h1: "عن", about_sub: "نحن وكالة رقمية متقدمة متخصصة في إنشاء تجارب ويب عالية الأداء تدفع نمو الأعمال.",
    about_team: "خبراؤنا",
    about_f1_title: "فريق خبراء", about_f1_desc: "مطورون ومصممون متخصصون بسنوات من الخبرة في تقنيات الويب الحديثة.",
    about_f2_title: "مهمتنا", about_f2_desc: "تمكين الشركات من خلال حلول رقمية مبتكرة وتجارب ويب استثنائية.",
    about_f3_title: "تسليم سريع", about_f3_desc: "نحن نقدر وقتك، نسلم مواقع عالية الجودة في أقصر وقت ممكن.",
    about_f4_title: "الجودة أولاً", about_f4_desc: "لا تنازل عن الأداء أو الأمان أو جودة التصميم في أي مشروع.",
    pricing_h1: "أسعار", pricing_h1_accent: "شفافة",
    pricing_sub: "اختر الخطة المثالية لاحتياجات عملك. جميع الأسعار بالدينار الجزائري.",
    pricing_popular: "الأكثر شعبية", pricing_getstarted: "ابدأ الآن",
    pricing_faq_h2: "أسئلة", pricing_faq_accent: "شائعة",
    pricing_cta_h2: "هل أنت مستعد للبدء؟", pricing_cta_sub: "تواصل معنا اليوم للحصول على استشارة مجانية حول مشروعك.", pricing_cta_btn: "تواصل عبر واتساب",
    faq_q1: "هل يمكن تخصيص الأسعار؟", faq_a1: "نعم، الأسعار المذكورة هي الأسعار الأساسية. يمكننا تخصيص الحزم حسب احتياجاتك الخاصة.",
    faq_q2: "كم وقت يستغرق المشروع؟", faq_a2: "عادة ما يستغرق: Portfolio 1-2 أسبوع، Store 2-3 أسابيع، Grand Business 1-2 أشهر.",
    faq_q3: "هل توفرون الدعم بعد الإطلاق؟", faq_a3: "نعم، نوفر دعم تقني كامل وصيانة دورية حسب نوع الحزمة.",
    faq_q4: "ما طرق الدفع المتاحة؟", faq_a4: "نقبل التحويل البنكي والدفع الإلكتروني وطرق دفع أخرى متعددة.",
    plan1_title: "بورتفوليو", plan1_desc: "مثالي لمواقع العرض والمحافظ",
    plan1_f1: "تصميم متجاوب", plan1_f2: "نموذج تواصل", plan1_f3: "محسّن لمحركات البحث", plan1_f4: "تحميل سريع", plan1_f5: "ملائم للموبايل",
    plan2_title: "متجر إلكتروني", plan2_desc: "حل للبيع عبر الإنترنت",
    plan2_f1: "كتالوج المنتجات", plan2_f2: "سلة التسوق", plan2_f3: "تكامل الدفع", plan2_f4: "إدارة المخزون", plan2_f5: "لوحة العميل", plan2_f6: "تتبع الطلبات",
    plan3_title: "موقع أعمال + تطبيق", plan3_desc: "حل أعمال كامل مع ويب وتطبيق موبايل",
    plan3_f1: "تصميم مخصص", plan3_f2: "تطبيق ويب", plan3_f3: "تطبيق موبايل (iOS/Android)", plan3_f4: "ميزات متقدمة", plan3_f5: "تكامل API", plan3_f6: "لوحة تحليلات", plan3_f7: "دعم مخصص", plan3_f8: "استضافة وصيانة",
    projects_page_h1: "جميع", projects_page_h1_accent: "المشاريع", projects_page_sub: "مشاريع تجريبية • انقر على أي مشروع للزيارة.",
    projects_page_cta_h2: "لديك مشروع في ذهنك؟", projects_page_cta_sub: "لنتحدث عن فكرتك الكبيرة القادمة.", projects_page_cta_btn: "تواصل عبر واتساب", projects_page_visit: "زيارة المشروع",
    contact_h1: "تواصل", contact_h1_accent: "معنا", contact_sub: "أخبرنا عن مشروعك — عادةً ما نرد خلال 24 ساعة.",
    contact_name: "اسمك", contact_email: "بريدك الإلكتروني", contact_message: "الرسالة", contact_send: "إرسال الرسالة", contact_sending: "جارٍ الإرسال...",
    contact_info_title: "معلومات التواصل", contact_location: "الموقع", contact_whatsapp: "تواصل عبر واتساب",
  },
  fr: {
    nav_home: "Accueil", nav_about: "À propos", nav_projects: "Projets", nav_pricing: "Tarifs", nav_contact: "Contactez-nous",
    hero_badge: "Excellence Numérique", hero_h1a: "Votre succès mérite", hero_h1b: "d'être mesuré numériquement",
    hero_sub: "Nous construisons des systèmes de design haute performance et des expériences numériques qui stimulent la croissance.",
    hero_cta_get: "Obtenir votre site", hero_cta_view: "Voir les projets", hero_scroll: "Défiler",
    services_title: "Ce que nous", services_title_accent: "faisons", services_sub: "Services de design et développement adaptés à vos objectifs.",
    service1_title: "Design Web", service1_desc: "UI pixel-perfect, bibliothèques de composants et interfaces accessibles.",
    service2_title: "Développement Web", service2_desc: "Code évolutif et maintenable, optimisé pour les performances.",
    service3_title: "SEO & Performance", service3_desc: "Vitesse, structure et bases pour améliorer la visibilité.",
    projects_title: "Projets", projects_title_accent: "sélectionnés",
    projects_sub: "Sites de démonstration — nos clients obtiennent des sites plus professionnels avec domaine et hébergement.",
    project_explore: "Explorer →",
    cta_h2a: "Prêt à", cta_h2b: "démarrer votre projet?",
    cta_sub: "Obtenez votre site web dans les meilleurs délais avec le plus grand professionnalisme.",
    cta_talk: "Parlons-en", cta_whatsapp: "Discuter sur WhatsApp",
    footer_tagline: "Construire l'avenir numérique avec précision, performance et passion.",
    footer_nav: "Navigation", footer_connect: "Contact", footer_follow: "Suivez-nous", footer_services: "Services",
    footer_privacy: "Politique de confidentialité", footer_terms: "Conditions d'utilisation", footer_rights: "© 2025 NOVAWEB. TOUS DROITS RÉSERVÉS.",
    about_h1: "À propos de", about_sub: "Nous sommes une agence numérique spécialisée dans la création d'expériences web haute performance.",
    about_team: "Nos Experts",
    about_f1_title: "Équipe d'experts", about_f1_desc: "Développeurs et designers dédiés avec des années d'expérience.",
    about_f2_title: "Notre mission", about_f2_desc: "Autonomiser les entreprises grâce à des solutions numériques innovantes.",
    about_f3_title: "Livraison rapide", about_f3_desc: "Nous respectons votre temps, livrant des sites de qualité en un minimum de temps.",
    about_f4_title: "Qualité d'abord", about_f4_desc: "Aucun compromis sur les performances, la sécurité ou la qualité du design.",
    pricing_h1: "Tarifs", pricing_h1_accent: "transparents",
    pricing_sub: "Choisissez le plan parfait pour votre entreprise. Prix en DA (Dinar Algérien).",
    pricing_popular: "Le plus populaire", pricing_getstarted: "Commencer",
    pricing_faq_h2: "Questions", pricing_faq_accent: "fréquentes",
    pricing_cta_h2: "Prêt à commencer?", pricing_cta_sub: "Contactez-nous aujourd'hui pour une consultation gratuite sur votre projet.", pricing_cta_btn: "Nous contacter sur WhatsApp",
    faq_q1: "Les prix peuvent-ils être personnalisés?", faq_a1: "Oui, les prix indiqués sont les prix de base. Nous pouvons personnaliser les packages selon vos besoins.",
    faq_q2: "Combien de temps prend le projet?", faq_a2: "Généralement: Portfolio 1-2 semaines, Store 2-3 semaines, Grand Business 1-2 mois.",
    faq_q3: "Fournissez-vous un support après lancement?", faq_a3: "Oui, nous fournissons un support technique complet et une maintenance périodique.",
    faq_q4: "Quels modes de paiement sont disponibles?", faq_a4: "Nous acceptons les virements bancaires, paiements électroniques et autres méthodes.",
    plan1_title: "Portfolio", plan1_desc: "Parfait pour les sites vitrines et portfolios",
    plan1_f1: "Design responsive", plan1_f2: "Formulaire de contact", plan1_f3: "SEO optimisé", plan1_f4: "Chargement rapide", plan1_f5: "Mobile friendly",
    plan2_title: "Site boutique", plan2_desc: "Solution e-commerce pour la vente en ligne",
    plan2_f1: "Catalogue produits", plan2_f2: "Panier d'achat", plan2_f3: "Intégration paiement", plan2_f4: "Gestion des stocks", plan2_f5: "Tableau de bord client", plan2_f6: "Suivi des commandes",
    plan3_title: "Grand Business + App", plan3_desc: "Solution complète avec web et application mobile",
    plan3_f1: "Design personnalisé", plan3_f2: "Application web", plan3_f3: "App mobile (iOS/Android)", plan3_f4: "Fonctionnalités avancées", plan3_f5: "Intégration API", plan3_f6: "Tableau de bord analytique", plan3_f7: "Support dédié", plan3_f8: "Hébergement & Maintenance",
    projects_page_h1: "Tous les", projects_page_h1_accent: "Projets", projects_page_sub: "Projets de démo • Cliquez sur un projet pour le visiter.",
    projects_page_cta_h2: "Vous avez un projet en tête?", projects_page_cta_sub: "Parlons de votre prochaine grande idée.", projects_page_cta_btn: "Discuter sur WhatsApp", projects_page_visit: "Visiter le projet",
    contact_h1: "Contactez", contact_h1_accent: "nous", contact_sub: "Parlez-nous de votre projet — nous répondons généralement dans les 24 heures.",
    contact_name: "Votre nom", contact_email: "Votre email", contact_message: "Message", contact_send: "Envoyer le message", contact_sending: "Envoi en cours...",
    contact_info_title: "Nos contacts", contact_location: "Localisation", contact_whatsapp: "Discuter sur WhatsApp",
  }
} as const;

export type TranslationKey = keyof typeof translations.en;

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  isRTL: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) || "en";
  });

  const isRTL = lang === "ar";

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: TranslationKey): string => {
    return (translations[lang] as Record<string, string>)[key] ?? (translations.en as Record<string, string>)[key] ?? key;
  };

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
