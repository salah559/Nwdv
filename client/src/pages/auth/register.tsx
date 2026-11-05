import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, User, Mail, Lock, Globe, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { SEO } from "@/components/SEO";
import { RESERVED_USERNAMES, usernameRegex } from "@shared/saas-schema";

export default function Register() {
  const { signUp } = useAuth();
  const { t, isRTL } = useLang();
  const [, setLocation] = useLocation();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cleanUsername = username.trim().toLowerCase();
  const isUsernameValid = usernameRegex.test(cleanUsername);
  const isReserved = (RESERVED_USERNAMES as readonly string[]).includes(cleanUsername);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("يرجى إدخال الاسم الكامل");
      return;
    }

    if (!cleanUsername || !isUsernameValid) {
      setError("اسم المستخدم يجب أن يكون من 3 إلى 20 حرفاً (أحرف إنجليزية، أرقام، -، أو _)");
      return;
    }

    if (isReserved) {
      setError(`اسم المستخدم '${cleanUsername}' محجوز من قِبل المنصة. يرجى اختيار اسم آخر.`);
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("يرجى إدخال بريد إلكتروني صالح");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تتكون من 6 أحرف على الأقل");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password, fullName, cleanUsername);
      setLocation("/dashboard");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("هذا البريد الإلكتروني مستخدم بالفعل.");
      } else {
        setError(err.message || "حدث خطأ أثناء إنشاء الحساب. حاول مجدداً.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4 pt-24 pb-20 relative selection:bg-cyan-500/30">
      <SEO title="إنشاء حساب جديد — Novaweb Profile" />

      {/* Ambient background */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-cyan-300 font-ui uppercase tracking-wider">
              تجربة مجانية كاملة 7 أيام
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            ابدأ بناء هويتك الرقمية
          </h1>
          <p className="text-gray-400 text-sm">
            احصل على رابطك الشخصي في ثوانٍ مع كامل ميزات المنصة
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
            <Label className="text-xs text-gray-300 font-ui">الاسم الكامل</Label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: صلاح الدين بوعزيز"
                className="bg-black/40 border-white/10 pr-10 text-sm h-11 focus:border-cyan-400 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300 font-ui">اسم المستخدم (رابط موقعك الفرعي)</Label>
            <div className="relative">
              <Globe className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="salah"
                className="bg-black/40 border-white/10 pr-10 text-sm h-11 focus:border-cyan-400 rounded-xl font-mono"
                dir="ltr"
              />
            </div>
            {cleanUsername && (
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono mt-1 px-1" dir="ltr">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>https://{cleanUsername}.novawebdv.com</span>
              </div>
            )}
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300 font-ui">كلمة المرور</Label>
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

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300 font-ui">تأكيد كلمة المرور</Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <Input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-black/40 border-white/10 pr-10 text-sm h-11 focus:border-cyan-400 rounded-xl"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-ui font-extrabold uppercase tracking-wider h-12 rounded-xl mt-4 shadow-[0_0_20px_rgba(6,255,240,0.3)]"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <span>تفعيل الحساب والتجربة المجانية</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <span>لديك حساب بالفعل؟ </span>
          <Link href="/auth/login" className="text-cyan-400 hover:underline font-bold">
            تسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
