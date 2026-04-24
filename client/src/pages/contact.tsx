import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp, getDoc, doc } from "firebase/firestore";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";
import { SEO } from "@/components/SEO";

const DEFAULT_SITE_INFO = {
  location: "Algiers, Algeria",
  email: "novawebdv@gmail.com",
  phone: "+213 663 699 433",
  phoneRaw: "213663699433",
  whatsappMessage: "مرحباً، أريد الاستفسار عن خدمات تطوير المواقع",
};

export default function Contact() {
  const { t } = useLang();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [siteInfo, setSiteInfo] = useState(DEFAULT_SITE_INFO);

  useEffect(() => {
    getDoc(doc(db, "settings", "siteInfo")).then(snap => {
      if (snap.exists()) setSiteInfo({ ...DEFAULT_SITE_INFO, ...snap.data() as typeof DEFAULT_SITE_INFO });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addDoc(collection(db, "messages"), {
        ...formData,
        createdAt: Timestamp.now(),
        status: "unread"
      });

      toast.success("Message received! We'll be in touch soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error sending message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={t("nav_contact")} />
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              {t("contact_h1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">{t("contact_h1_accent")}</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              {t("contact_sub")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-ui font-bold mb-2 uppercase tracking-wide">{t("contact_name")}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                    placeholder={t("contact_name")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-ui font-bold mb-2 uppercase tracking-wide">{t("contact_email")}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
                    placeholder={t("contact_email")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-ui font-bold mb-2 uppercase tracking-wide">{t("contact_message")}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors resize-none h-32"
                    placeholder={t("contact_message")}
                    required
                  />
                </div>
                <Button type="submit" size="lg" disabled={isLoading} className="w-full bg-primary text-black hover:bg-cyan-400 font-ui font-bold uppercase tracking-widest disabled:opacity-50">
                  {isLoading ? t("contact_sending") : t("contact_send")}
                </Button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="glass-panel p-8 rounded-2xl border border-white/10">
                <h3 className="text-3xl font-display font-bold mb-8">{t("contact_info_title")}</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">{t("contact_location")}</h4>
                      <p className="text-gray-400">{siteInfo.location}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">Email</h4>
                      <a href={`mailto:${siteInfo.email}`} className="text-primary hover:text-cyan-400 transition-colors">
                        {siteInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-lg mb-1">Phone</h4>
                      <a href={`tel:+${siteInfo.phoneRaw}`} className="text-primary hover:text-cyan-400 transition-colors">
                        {siteInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-ui font-bold uppercase tracking-widest h-16 rounded-xl btn-pulse"
                onClick={() => window.open(`https://wa.me/${siteInfo.phoneRaw}?text=${encodeURIComponent(siteInfo.whatsappMessage)}`, '_blank')}
              >
                {t("contact_whatsapp")}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}