import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
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
  const { signIn, signInWithGoogle } = useAuth();
  const { t } = useLang();
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      setIsGoogleLoading(true);
      await signInWithGoogle();
      setLocation("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setError("تم إغلاق نافذة تسجيل الدخول عبر Google.");
      } else if (err.code === "auth/configuration-not-found") {
        setError("تنبيه: يجب تفعيل موفر Google في Firebase Console أولاً.");
      } else {
        setError(err.message || "فشل تسجيل الدخول عبر Google.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      setLocation("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError("بيانات الدخول غير صحيحة. يرجى التحقق من البريد أو كلمة المرور.");
      } else if (err.code === "auth/configuration-not-found") {
        setError("تنبيه: يجب تفعيل خدمة Authentication في لوحة Firebase Console لمشروعك.");
      } else {
        setError(err.message || "حدث خطأ أثناء تسجيل الدخول.");
      }
    } finally {
      setIsLoading(false);
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
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            مرحباً بعودتك
          </h1>
          <p className="text-gray-400 text-sm">
            سجّل دخولك للوصول إلى لوحة تحكم موقعك الشخصي
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

        {/* GOOGLE SIGN IN BUTTON */}
        <Button
          type="button"
          disabled={isGoogleLoading || isLoading}
          onClick={handleGoogleSignIn}
          className="w-full bg-white hover:bg-gray-100 text-gray-900 font-ui font-bold h-12 rounded-xl mb-5 shadow-lg flex items-center justify-center gap-3 transition-transform hover:scale-[1.01]"
        >
          {isGoogleLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-900" />
          ) : (
            <>
              <GoogleIcon />
              <span className="text-sm">تسجيل الدخول باستخدام Google</span>
            </>
          )}
        </Button>

        {/* DIVIDER */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0b0e17] px-3 text-[11px] text-gray-500 font-ui uppercase tracking-wider absolute">
            أو عبر البريد
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300 font-ui">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="salah@example.com"
                className="bg-black/40 border-white/10 pr-10 text-sm h-11 focus:border-cyan-400 rounded-xl"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-300 font-ui">كلمة المرور</Label>
              <Link href="/auth/forgot-password" className="text-[11px] text-cyan-400 hover:underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-black/40 border-white/10 pr-10 text-sm h-11 focus:border-cyan-400 rounded-xl"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-ui font-extrabold uppercase tracking-wider h-12 rounded-xl mt-4 shadow-[0_0_20px_rgba(6,255,240,0.3)]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <span>دخول</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <span>ليس لديك حساب بعد؟ </span>
          <Link href="/auth/register" className="text-cyan-400 hover:underline font-bold">
            ابدأ تجربتك المجانية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
