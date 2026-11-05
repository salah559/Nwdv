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

export default function Login() {
  const { signIn } = useAuth();
  const { t } = useLang();
  const [, setLocation] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        <div className="text-center mb-8">
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
            disabled={isLoading}
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
