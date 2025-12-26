import { Navbar } from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Pricing() {
  const pricingPlans = [
    {
      title: "Portfolio",
      price: "7,000",
      description: "Perfect for showcase websites and portfolios",
      features: [
        "Responsive Design",
        "Contact Form",
        "SEO Optimized",
        "Fast Loading",
        "Mobile Friendly",
      ],
    },
    {
      title: "Store Website",
      price: "17,000 - 25,000",
      description: "E-commerce solution for online selling",
      features: [
        "Product Catalog",
        "Shopping Cart",
        "Payment Integration",
        "Inventory Management",
        "Customer Dashboard",
        "Order Tracking",
      ],
      featured: true,
    },
    {
      title: "Grand Business Website + App",
      price: "35,000 - 400,000",
      description: "Complete business solution with web and mobile app",
      features: [
        "Custom Design",
        "Web Application",
        "Mobile App (iOS/Android)",
        "Advanced Features",
        "API Integration",
        "Analytics Dashboard",
        "Dedicated Support",
        "Hosting & Maintenance",
      ],
    },
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
              Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your business needs. All prices in DA (Algerian Dinar).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-panel p-10 rounded-3xl border transition-all ${
                  plan.featured 
                    ? "border-primary/50 bg-primary/5 md:scale-105" 
                    : "border-white/10"
                } hover:border-primary/30`}
              >
                {plan.featured && (
                  <div className="inline-block px-3 py-1 mb-4 bg-primary/20 border border-primary/50 rounded-full">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Most Popular</span>
                  </div>
                )}
                <h3 className="text-3xl font-display font-bold mb-2 text-white">{plan.title}</h3>
                <p className="text-muted-foreground mb-6 text-sm">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-5xl font-display font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">DA</span>
                </div>

                <Button 
                  className={`w-full mb-8 font-ui font-bold uppercase tracking-widest h-12 rounded-xl transition-all ${
                    plan.featured
                      ? "bg-primary text-black hover:bg-cyan-400"
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }`}
                  onClick={() => window.open('https://wa.me/213663699433', '_blank')}
                >
                  Get Started
                </Button>

                <ul className="space-y-4">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-background/50 backdrop-blur-sm border-y border-white/5">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4 text-white">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "هل يمكن تخصيص الأسعار؟",
                a: "نعم، الأسعار المذكورة هي الأسعار الأساسية. يمكننا تخصيص الحزم حسب احتياجاتك الخاصة.",
              },
              {
                q: "كم وقت يستغرق المشروع؟",
                a: "عادة ما يستغرق: Portfolio 1-2 أسبوع، Store 2-3 أسابيع، Grand Business 1-2 أشهر.",
              },
              {
                q: "هل توفرون الدعم بعد الإطلاق؟",
                a: "نعم، نوفر دعم تقني كامل وصيانة دورية حسب نوع الحزمة.",
              },
              {
                q: "ما طرق الدفع المتاحة؟",
                a: "نقبل التحويل البنكي والدفع الإلكتروني وطرق دفع أخرى متعددة.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass-panel p-6 rounded-2xl border border-white/5"
              >
                <h4 className="text-lg font-display font-bold text-white mb-3">{item.q}</h4>
                <p className="text-gray-400 leading-relaxed">{item.a}</p>
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
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Contact us today for a free consultation about your project.
          </p>
          <Button 
            size="lg" 
            className="bg-primary text-black hover:bg-cyan-400 font-ui font-bold uppercase tracking-widest px-8"
            onClick={() => window.open('https://wa.me/213663699433?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%AA%D8%B7%D9%88%D9%8A%D8%B1%20%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%82%D8%B9', '_blank')}
          >
            Contact Us on WhatsApp
          </Button>
        </div>
      </section>
    </div>
  );
}
