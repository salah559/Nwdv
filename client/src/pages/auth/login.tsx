import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, Loader2, Check, Globe, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/SEO";

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

export default function Login() {
  const { currentUser, userProfile, signInWithGoogle, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (!loading && currentUser) {
      if (userProfile) {
        setLocation("/dashboard");
      } else {
        setLocation("/onboarding");
      }
    }
  }, [currentUser, userProfile, loading, setLocation]);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      setIsGoogleLoading(true);
      const res = await signInWithGoogle();
      if (res.isNewUser) {
        setLocation("/onboarding");
      } else {
        setLocation("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("تم إغلاق نافذة تسجيل الدخول عبر Google.");
      } else if (err.code === "auth/configuration-not-found") {
        setError("تنبيه: يرجى تفعيل موفر Google في Firebase Console أولاً.");
      } else {
        setError(err.message || "فشل تسجيل الدخول عبر Google.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4 pt-24 pb-20 relative selection:bg-cyan-500/30">
      <SEO title="تسجيل الدخول — Novaweb Profile" />

      {/* Ambient background */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-cyan-300 font-ui uppercase tracking-wider">
              تجربة مجانية كاملة 7 أيام
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            مرحباً بك في Novaweb
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            سجّل دخولك الآن بحساب Google لإنشاء موقعك الشخصي وإدارته في ثوانٍ معدودة.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* PROMINENT GOOGLE BUTTON */}
        <Button
          type="button"
          disabled={isGoogleLoading}
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-ui font-extrabold h-14 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] text-sm"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-900" />
          ) : (
            <>
              <GoogleIcon />
              <span>المتابعة باستخدام Google</span>
            </>
          )}
        </Button>

        <div className="mt-8 pt-6 border-t border-white/5 space-y-2.5 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>تسجيل آمن وسريع بدون الحاجة لحفظ كلمات مرور</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>ستختار اسمك ونطاقك الفرعي في الخطوة التالية</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-cyan-400" />
            <span>تجربة مجانية كاملة 7 أيام بدون بطاقة بنكية</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
