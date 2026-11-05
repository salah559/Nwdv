import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Globe, User, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { SEO } from "@/components/SEO";
import { RESERVED_USERNAMES, usernameRegex } from "@shared/saas-schema";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Onboarding() {
  const { currentUser, userProfile, completeOnboarding, loading } = useAuth();
  const [, setLocation] = useLocation();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        setLocation("/auth/login");
        return;
      }
      if (userProfile) {
        setLocation("/dashboard");
        return;
      }
      // Initialize full name from Google profile
      if (currentUser.displayName) {
        setFullName(currentUser.displayName);
      }
      // Suggest initial username
      const emailBase = currentUser.email ? currentUser.email.split("@")[0] : (currentUser.displayName || "");
      const suggested = emailBase.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);
      if (suggested.length >= 3) {
        setUsername(suggested);
      }
    }
  }, [currentUser, userProfile, loading, setLocation]);

  const cleanUsername = username.trim().toLowerCase();
  const isValidFormat = usernameRegex.test(cleanUsername);
  const isReserved = (RESERVED_USERNAMES as readonly string[]).includes(cleanUsername);

  // Check username availability with debounce
  useEffect(() => {
    if (!cleanUsername || !isValidFormat || isReserved) {
      setIsUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsCheckingUsername(true);
        const ref = doc(db, "usernames", cleanUsername);
        const snap = await getDoc(ref);
        setIsUsernameAvailable(!snap.exists());
      } catch (e) {
        console.error(e);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [cleanUsername, isValidFormat, isReserved]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("يرجى إدخال اسمك الكامل");
      return;
    }

    if (!cleanUsername || !isValidFormat) {
      setError("اسم المستخدم يجب أن يكون من 3 إلى 20 حرفاً (أحرف إنجليزية، أرقام، -، أو _)");
      return;
    }

    if (isReserved) {
      setError(`اسم المستخدم '${cleanUsername}' محجوز من قبل المنصة. يرجى اختيار اسم آخر.`);
      return;
    }

    if (isUsernameAvailable === false) {
      setError(`اسم المستخدم '${cleanUsername}' مأخوذ بالفعل، يرجى اختيار اسم آخر.`);
      return;
    }

    try {
      setIsLoading(true);
      await completeOnboarding(fullName, cleanUsername);
      setLocation("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء إعداد حسابك");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-cyan-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4 pt-24 pb-20 relative selection:bg-cyan-500/30">
      <SEO title="اختيار الرابط والاسم — Novaweb Profile" />

      {/* Ambient background */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          {/* User Google Avatar */}
          {currentUser.photoURL && (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-400 p-1 mx-auto mb-4 bg-black shadow-lg">
              <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-cyan-300 font-ui uppercase tracking-wider">
              مرحباً بك في Novaweb Profile
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-2">
            اختر اسمك ورابط موقعك
          </h1>
          <p className="text-gray-400 text-sm">
            خطوة واحدة أخيرة لتفعيل موقعك الشخصي وتجربتك المجانية لمدة 7 أيام.
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300 font-ui">الاسم الكامل الذي يظهر على موقعك</Label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: صلاح الدين بوعزيز"
                className="bg-black/40 border-white/10 pr-10 text-sm h-12 focus:border-cyan-400 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-300 font-ui">اسم المستخدم (رابط موقعك الفرعي)</Label>
              {isCheckingUsername && (
                <span className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>جارٍ التحقق...</span>
                </span>
              )}
              {!isCheckingUsername && isUsernameAvailable === true && (
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>متاح للطلب!</span>
                </span>
              )}
              {!isCheckingUsername && isUsernameAvailable === false && (
                <span className="text-[11px] text-red-400 font-mono">
                  محجوز مسبقاً
                </span>
              )}
            </div>

            <div className="relative">
              <Globe className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
                placeholder="salah"
                className="bg-black/40 border-white/10 pr-10 text-sm h-12 focus:border-cyan-400 rounded-xl font-mono text-left"
                dir="ltr"
              />
            </div>

            {cleanUsername && (
              <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs mt-2" dir="ltr">
                <span className="text-gray-400 font-mono">رابط موقعك:</span>
                <span className="font-mono font-bold text-cyan-400">
                  https://{cleanUsername}.novawebdv.com
                </span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || isCheckingUsername || isUsernameAvailable === false}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-ui font-extrabold uppercase tracking-wider h-14 rounded-xl shadow-[0_0_25px_rgba(6,255,240,0.4)] text-sm mt-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <span>تفعيل موقعي والتجربة المجانية (7 أيام)</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
