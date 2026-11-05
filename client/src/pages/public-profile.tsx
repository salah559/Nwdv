import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, UserSubscription } from "@shared/saas-schema";
import { ProfileTemplateRenderer } from "@/components/templates/ProfileTemplateRenderer";
import { SEO } from "@/components/SEO";
import { Loader2, AlertCircle, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicProfile({ usernameParam }: { usernameParam?: string }) {
  const [, params] = useRoute("/p/:username");
  const [, uParams] = useRoute("/u/:username");
  
  const targetUsername = usernameParam || params?.username || uParams?.username || "";

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!targetUsername) {
        setError("لم يتم تحديد اسم المستخدم");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 1. Find profile by username
        const q = query(
          collection(db, "profiles"),
          where("username", "==", targetUsername.toLowerCase().trim())
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setError("not_found");
          setLoading(false);
          return;
        }

        const profData = snap.docs[0].data() as UserProfile;
        setProfile(profData);

        // 2. Fetch subscription status
        const subDoc = await getDoc(doc(db, "subscriptions", profData.userId));
        if (subDoc.exists()) {
          const subData = subDoc.data() as UserSubscription;
          
          // Check expiration
          const now = Date.now();
          const trialEnd = subData.trialEndsAt?.toMillis ? subData.trialEndsAt.toMillis() : (subData.trialEndsAt?.seconds ? subData.trialEndsAt.seconds * 1000 : 0);
          const periodEnd = subData.currentPeriodEnd?.toMillis ? subData.currentPeriodEnd.toMillis() : (subData.currentPeriodEnd?.seconds ? subData.currentPeriodEnd.seconds * 1000 : 0);

          if (subData.status === "trial" && trialEnd > 0 && now > trialEnd) {
            subData.status = "expired";
          } else if (subData.status === "active" && periodEnd > 0 && now > periodEnd) {
            subData.status = "expired";
          }

          setSubscription(subData);
        }
      } catch (err) {
        console.error("Error loading public profile:", err);
        setError("حدث خطأ أثناء تحميل الملف الشخصي");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [targetUsername]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-cyan-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
          Loading Novaweb Profile...
        </span>
      </div>
    );
  }

  if (error === "not_found" || !profile) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-gray-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-2">الملف الشخصي غير موجود</h1>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          لم نتمكن من العثور على موقع بهذا الاسم: <span className="text-cyan-400 font-mono">"{targetUsername}"</span>.
        </p>
        <a href="/profiles">
          <Button className="bg-cyan-400 text-black hover:bg-cyan-300 font-bold font-ui text-xs">
            احجز هذا الاسم الآن
          </Button>
        </a>
      </div>
    );
  }

  // Check if profile is unpublished
  if (!profile.isPublished) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-yellow-400">
          <Clock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">الموقع غير متاح حالياً</h1>
        <p className="text-gray-400 text-sm max-w-sm">
          قام صاحب هذا الملف بإيقاف نشره مؤقتاً.
        </p>
      </div>
    );
  }

  // Check if subscription or trial has expired
  if (subscription && (subscription.status === "expired" || subscription.status === "suspended")) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6 text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold mb-2">
          انتهت فترة التجربة المجانية لهذا الموقع
        </h1>
        <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
          انتهت صلاحية الاشتراك الخاص بموقع <span className="text-cyan-400 font-bold">@{profile.username}</span>. 
          يمكن للمالك تسجيل الدخول وتجديد الاشتراك لإعادة تفعيل الموقع فوراً.
        </p>
        <div className="flex gap-4">
          <a href="/auth/login">
            <Button className="bg-cyan-400 text-black hover:bg-cyan-300 font-bold font-ui text-xs">
              تسجيل الدخول للمالك
            </Button>
          </a>
          <a href="/profiles">
            <Button variant="outline" className="border-white/20 text-xs">
              أنشئ موقعك الخاص
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${profile.fullName} — (@${profile.username})`}
        description={profile.bio || `${profile.fullName}'s official personal profile on Novaweb Profile.`}
      />
      <ProfileTemplateRenderer profile={profile} />
    </>
  );
}
