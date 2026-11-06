import { UserProfile, UserSubscription } from "@shared/saas-schema";

/**
 * Permanent Profile for Salah (Founder of Novaweb)
 * Accessible permanently at SALAH.NOVAWEBDV.COM and /p/salah
 */
export const SALAH_PERMANENT_PROFILE: UserProfile = {
  userId: "salah-founder-permanent",
  username: "salah",
  fullName: "Salah Eddine",
  jobTitle: "Founder & Full-Stack Architect",
  bio: "مؤسس وكالة Novaweb. متخصص في هندسة تطبيقات الويب فائقة الأداء، أنظمة الـ SaaS، والواجهات الرقمية التفاعلية الحديثة.",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  coverUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  location: "الجزائر 🇩🇿 (Algeria)",
  email: "novawebdv@gmail.com",
  phone: "+213550000000",
  whatsapp: "+213550000000",
  website: "https://www.novawebdv.com",
  templateId: "reactbits-spotlight",
  customTheme: {
    primaryColor: "#06b6d4",
    backgroundColor: "#07090e",
    fontFamily: "Space Grotesk",
    backgroundStyle: "particles",
  },
  socialLinks: [
    {
      id: "sl-salah-1",
      platform: "website",
      title: "Novaweb Agency — الموقع الرسمي",
      url: "https://www.novawebdv.com",
      enabled: true,
      order: 1,
    },
    {
      id: "sl-salah-2",
      platform: "github",
      title: "GitHub @salah559",
      url: "https://github.com/salah559",
      enabled: true,
      order: 2,
    },
    {
      id: "sl-salah-3",
      platform: "linkedin",
      title: "LinkedIn Profile",
      url: "https://linkedin.com",
      enabled: true,
      order: 3,
    },
    {
      id: "sl-salah-4",
      platform: "whatsapp",
      title: "تواصل عبر واتساب مباشرة",
      url: "https://wa.me/213550000000",
      enabled: true,
      order: 4,
    },
  ],
  isPublished: true,
};

export const SALAH_PERMANENT_SUBSCRIPTION: UserSubscription = {
  userId: "salah-founder-permanent",
  status: "active",
  planId: "yearly",
  trialStartsAt: null,
  trialEndsAt: null,
  amountDZD: 4000,
};

export function isPermanentUsername(username?: string): boolean {
  if (!username) return false;
  return username.toLowerCase().trim() === "salah";
}

export function getPermanentProfile(username?: string): UserProfile | null {
  if (isPermanentUsername(username)) {
    return SALAH_PERMANENT_PROFILE;
  }
  return null;
}
