import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Globe, 
  Palette, 
  CreditCard, 
  Layout, 
  Eye, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Plus, 
  Trash2, 
  Upload, 
  Save, 
  LogOut, 
  Smartphone, 
  Monitor, 
  Crown, 
  CheckCircle2, 
  Loader2,
  Lock,
  ArrowRight,
  Share2,
  Receipt,
  FileText,
  QrCode,
  Download,
  Search,
  Filter,
  Coins,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/i18n";
import { SEO } from "@/components/SEO";
import { TEMPLATES, getTemplateById } from "@/lib/templates-data";
import { ProfileTemplateRenderer } from "@/components/templates/ProfileTemplateRenderer";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { UserProfile, SocialLink, PaymentRecord, TemplateDefinition } from "@shared/saas-schema";
import { SUPPORTED_PLATFORMS, PlatformIcon } from "@/components/ui/PlatformIcon";
import { collection, addDoc, Timestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

export default function Dashboard() {
  const { currentUser, userProfile, subscription, unlockedTemplates, loading, signOut, updateUserProfileData, refreshUserData } = useAuth();
  const { t } = useLang();
  const [, setLocation] = useLocation();

  const [activeTab, setActiveTab] = useState("overview");
  const [profileForm, setProfileForm] = useState<UserProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Preview Modal State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);

  // QR Code Modal State
  const [showQR, setShowQR] = useState(false);

  // Templates Search & Filter State
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateCategory, setTemplateCategory] = useState<string>("all");
  const [templatePriceFilter, setTemplatePriceFilter] = useState<"all" | "free" | "premium">("all");

  // Buy Template Modal State
  const [buyTemplateModal, setBuyTemplateModal] = useState<TemplateDefinition | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"baridimob" | "usdt">("baridimob");
  const [copiedUsdt, setCopiedUsdt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [selectedBillingPlan, setSelectedBillingPlan] = useState<"monthly" | "yearly">("monthly");
  const USDT_WALLET_ADDRESS = "0x7be61b899f9c5f30d1f50b463e13e68dd218c10d";

  // User Payment History
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        setLocation("/auth/login");
      } else if (!userProfile) {
        setLocation("/onboarding");
      }
    }
  }, [currentUser, userProfile, loading, setLocation]);

  useEffect(() => {
    if (userProfile) {
      setProfileForm({ ...userProfile });
    }
  }, [userProfile]);

  useEffect(() => {
    async function loadPayments() {
      if (!currentUser) return;
      try {
        const q = query(collection(db, "payments"), where("userId", "==", currentUser.uid));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PaymentRecord[];
        setPaymentHistory(list.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)));
      } catch (err) {
        console.error("Error loading payments:", err);
      }
    }
    loadPayments();
  }, [currentUser]);

  if (loading || !userProfile || !profileForm) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-cyan-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
          Loading Dashboard...
        </span>
      </div>
    );
  }

  // Calculate Trial Remaining Time
  const now = Date.now();
  const trialEnd = subscription?.trialEndsAt?.toMillis ? subscription.trialEndsAt.toMillis() : (subscription?.trialEndsAt?.seconds ? subscription.trialEndsAt.seconds * 1000 : 0);
  const periodEnd = subscription?.currentPeriodEnd?.toMillis ? subscription.currentPeriodEnd.toMillis() : 0;
  
  const isTrial = subscription?.status === "trial";
  const isExpired = subscription?.status === "expired" || (isTrial && now > trialEnd);
  
  const remainingMillis = Math.max(0, (isTrial ? trialEnd : periodEnd) - now);
  const remainingDays = Math.floor(remainingMillis / (1000 * 60 * 60 * 24));
  const remainingHours = Math.floor((remainingMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  const profileUrl = `${window.location.origin}/p/${userProfile.username}`;
  const subdomainUrl = `https://${userProfile.username}.novawebdv.com`;

  const copyProfileLink = () => {
    navigator.clipboard.writeText(subdomainUrl);
    setCopiedLink(true);
    toast.success("تم نسخ رابط موقعك الشخصي!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await updateUserProfileData(profileForm);
      toast.success("تم حفظ التعديلات بنجاح!");
    } catch (err: any) {
      console.error(err);
      toast.error("فشل حفظ التعديلات: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: "website",
      title: "New Link",
      url: "https://",
      enabled: true,
      order: profileForm.socialLinks.length,
    };
    setProfileForm({
      ...profileForm,
      socialLinks: [...profileForm.socialLinks, newLink],
    });
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: any) => {
    const updated = [...profileForm.socialLinks];
    if (field === "platform" && SUPPORTED_PLATFORMS[value]) {
      const meta = SUPPORTED_PLATFORMS[value];
      const currentTitle = updated[index]?.title;
      const isDefaultOrEmpty = !currentTitle || currentTitle === "New Link" || Object.values(SUPPORTED_PLATFORMS).some(p => p.defaultTitle === currentTitle || p.name === currentTitle);
      updated[index] = {
        ...updated[index],
        platform: value,
        title: isDefaultOrEmpty ? meta.defaultTitle : currentTitle,
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setProfileForm({ ...profileForm, socialLinks: updated });
  };

  const removeSocialLink = (index: number) => {
    const updated = profileForm.socialLinks.filter((_, i) => i !== index);
    setProfileForm({ ...profileForm, socialLinks: updated });
  };

  const handleSelectTemplate = async (templateId: string) => {
    const isUnlocked = unlockedTemplates.includes(templateId);
    if (!isUnlocked) {
      const tmpl = getTemplateById(templateId);
      setBuyTemplateModal(tmpl);
      return;
    }

    setProfileForm({ ...profileForm, templateId });
    try {
      await updateUserProfileData({ templateId });
      toast.success("تم تغيير القالب بنجاح!");
    } catch (err) {
      toast.error("حدث خطأ أثناء تغيير القالب");
    }
  };

  const handleCopyUsdt = () => {
    navigator.clipboard.writeText(USDT_WALLET_ADDRESS);
    setCopiedUsdt(true);
    toast.success("تم نسخ عنوان محفظة USDT بنجاح!");
    setTimeout(() => setCopiedUsdt(false), 2500);
  };

  // Submit Manual Payment Proof (for subscription or template)
  // الزبون يرفع الوصل فقط بدون كتابة رقم العملية
  const handleSubmitPayment = async (type: "subscription" | "template", targetId?: string, amountDZD: number = 500) => {
    if (!currentUser || !userProfile) return;
    if (!receiptUrl || !receiptUrl.trim()) {
      toast.error(
        selectedPaymentMethod === "usdt"
          ? "يرجى رفع صورة إيصال أو لقطة شاشة تحويل USDT أولاً"
          : "يرجى رفع صورة وصل بريديموب أولاً"
      );
      return;
    }

    try {
      setIsSubmittingPayment(true);
      const newPayment: PaymentRecord = {
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        username: userProfile.username,
        type: type,
        targetId: targetId || "",
        amountDZD: amountDZD,
        paymentMethod: selectedPaymentMethod,
        transactionReference: `${selectedPaymentMethod.toUpperCase()}-RECEIPT`,
        receiptUrl: receiptUrl,
        status: "pending",
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "payments"), newPayment);
      toast.success("تم إرسال وصل الدفع بنجاح! سيتم مراجعته وتفعيل طلبك في أقرب وقت.");
      setReceiptUrl("");
      setBuyTemplateModal(null);
      // Reload payments
      setPaymentHistory((prev) => [newPayment, ...prev]);
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إرسال الدفع");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-cyan-500/30 flex flex-col">
      <SEO title={`لوحة التحكم — ${userProfile.fullName}`} />

      {/* Official Dashboard Sticky Header */}
      <DashboardHeader />

      <main className="flex-1 pt-6 pb-28 md:pb-16 px-3 sm:px-6">
        {/* Top Banner Alert for Trial / Expiration */}
        <div className="max-w-6xl mx-auto mb-6">
        {isExpired ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-red-300">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">انتهت فترة التجربة المجانية لموقعك الشخصي!</p>
                <p className="text-xs text-red-300/80">موقعك غير منشور حالياً للزوار حتى تجديد الاشتراك (500 دج شهرياً).</p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => setActiveTab("billing")}
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs"
            >
              تجديد الاشتراك الآن
            </Button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <p className="font-bold text-sm text-white">
                  {isTrial ? "التجربة المجانية نشطة" : "اشتراكك نشط"}
                </p>
                <p className="text-xs text-gray-400">
                  متبقي <span className="text-cyan-400 font-bold">{remainingDays} يوم و {remainingHours} ساعة</span>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("billing")}
                className="text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
              >
                تفاصيل الاشتراك
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dashboard Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* User Quick Info Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-cyan-400/50 p-0.5 bg-black shrink-0">
              <img
                src={userProfile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                alt={userProfile.fullName}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-bold font-display text-white truncate">
                  {userProfile.fullName}
                </h1>
                <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 font-mono text-[10px]">
                  @{userProfile.username}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1.5 truncate" dir="ltr">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{userProfile.username}.novawebdv.com</span>
              </p>
            </div>
          </div>

          {/* Action Buttons Grid on Mobile, Flex on Desktop */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 pt-2 border-t border-white/5 md:pt-0 md:border-none">
            <Button
              variant="outline"
              size="sm"
              onClick={copyProfileLink}
              className="border-white/10 hover:border-cyan-400 text-xs gap-1.5 h-9 justify-center"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? "تم النسخ" : "نسخ الرابط"}</span>
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setPreviewTemplateId(profileForm.templateId);
                setPreviewOpen(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs gap-1.5 border border-white/10 h-9 justify-center"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة حية</span>
            </Button>

            <a href={subdomainUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button
                size="sm"
                className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs gap-1.5 h-9 justify-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>زيارة موقعك</span>
              </Button>
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQR(true)}
              className="border-purple-500/30 text-purple-300 hover:border-purple-400 text-xs gap-1.5 h-9 justify-center"
            >
              <QrCode className="w-3.5 h-3.5 text-purple-400" />
              <span>QR Code</span>
            </Button>
          </div>
        </div>

        {/* Tabs System */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
            <TabsList className="bg-white/[0.04] border border-white/10 p-1 rounded-2xl w-full sm:w-auto justify-start h-auto flex flex-nowrap min-w-max gap-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-bold font-ui gap-2 shrink-0"
              >
                <Layout className="w-4 h-4" />
                <span>نظرة عامة</span>
              </TabsTrigger>

              <TabsTrigger
                value="builder"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-bold font-ui gap-2 shrink-0"
              >
                <User className="w-4 h-4" />
                <span>منشئ الموقع</span>
              </TabsTrigger>

              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-bold font-ui gap-2 shrink-0"
              >
                <Palette className="w-4 h-4" />
                <span>القوالب (35)</span>
              </TabsTrigger>

              <TabsTrigger
                value="billing"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl px-4 sm:px-5 py-2.5 text-xs font-bold font-ui gap-2 shrink-0"
              >
                <CreditCard className="w-4 h-4" />
                <span>الاشتراك والدفع</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400 font-ui font-semibold">حالة النطاق الفرعي</span>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px]">
                      نشط Active
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1" dir="ltr">
                    {userProfile.username}.novawebdv.com
                  </h3>
                  <p className="text-xs text-gray-400">
                    رابطك مخصص ومحمي بشهادة أمان SSL تلقائية.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                  <Button size="sm" variant="outline" onClick={copyProfileLink} className="text-xs flex-1">
                    نسخ الرابط
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowQR(true)} className="text-xs flex-1 border-purple-500/30 text-purple-400 hover:border-purple-400">
                    <QrCode className="w-3.5 h-3.5 mr-1" />
                    QR Code
                  </Button>
                  <a href={subdomainUrl} target="_blank" rel="noreferrer" className="flex-1">
                    <Button size="sm" className="text-xs w-full bg-cyan-400 text-black font-bold">
                      زيارة
                    </Button>
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400 font-ui font-semibold">القالب المطبق حالياً</span>
                    <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 text-[10px]">
                      {getTemplateById(userProfile.templateId).isPremium ? "Premium" : "Free"}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {getTemplateById(userProfile.templateId).name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {getTemplateById(userProfile.templateId).description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("templates")} className="text-xs w-full">
                    تغيير القالب
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveTab("templates");
                      setTimeout(() => {
                        const el = document.querySelector("[data-customizer]");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 200);
                    }}
                    className="text-xs w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 gap-1.5"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    تخصيص الألوان والخط
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-400 font-ui font-semibold">حالة النشر للعامة</span>
                    <span className={`w-2 h-2 rounded-full ${profileForm.isPublished ? "bg-emerald-400 animate-ping" : "bg-gray-500"}`} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white">
                      {profileForm.isPublished ? "منشور للعامة" : "غير منشور (مسودة)"}
                    </h3>
                    <Switch
                      checked={profileForm.isPublished}
                      onCheckedChange={(checked) => {
                        setProfileForm({ ...profileForm, isPublished: checked });
                        updateUserProfileData({ isPublished: checked });
                        toast.success(checked ? "تم نشر الموقع للعامة!" : "تم إلغاء نشر الموقع.");
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    يمكنك إيقاف نشر موقعك مؤقتاً في أي وقت تريده.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("builder")} className="text-xs w-full">
                    تعديل المحتوى والروابط
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: PROFILE BUILDER */}
          <TabsContent value="builder" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Form: Info & Social Links */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>المعلومات الأساسية</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-300">الاسم الكامل</Label>
                      <Input
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="bg-black/40 border-white/10 text-sm h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-300">المسمى الوظيفي</Label>
                      <Input
                        value={profileForm.jobTitle || ""}
                        onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                        placeholder="مثال: مطور برمجيات / مصمم واجهات"
                        className="bg-black/40 border-white/10 text-sm h-10 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* IMGBB DIRECT IMAGE UPLOADS FOR AVATAR & COVER */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <ImageUploadInput
                      label="الصورة الشخصية (Avatar)"
                      value={profileForm.avatarUrl || ""}
                      onChange={(url) => setProfileForm({ ...profileForm, avatarUrl: url })}
                      placeholder="https://i.ibb.co/..."
                      aspectRatio="square"
                    />

                    <ImageUploadInput
                      label="صورة الغلاف (Cover Photo)"
                      value={profileForm.coverUrl || ""}
                      onChange={(url) => setProfileForm({ ...profileForm, coverUrl: url })}
                      placeholder="https://i.ibb.co/..."
                      aspectRatio="cover"
                    />
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <Label className="text-xs text-gray-300">النبذة التعريفية (Bio)</Label>
                    <Textarea
                      rows={3}
                      value={profileForm.bio || ""}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="اكتب نبذة مختصرة عن نفسك، مهاراتك أو ما تقدمه..."
                      className="bg-black/40 border-white/10 text-sm rounded-xl resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-300">الموقع الجغرافي</Label>
                      <Input
                        value={profileForm.location || ""}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="الجزائر العاصمة"
                        className="bg-black/40 border-white/10 text-sm h-10 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-300">رقم الهاتف</Label>
                      <Input
                        value={profileForm.phone || ""}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+213 660 00 00 00"
                        className="bg-black/40 border-white/10 text-sm h-10 rounded-xl"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-gray-300">رقم الواتساب</Label>
                      <Input
                        value={profileForm.whatsapp || ""}
                        onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                        placeholder="213660000000"
                        className="bg-black/40 border-white/10 text-sm h-10 rounded-xl"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links Manager */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-cyan-400" />
                      <span>روابط التواصل والمواقع</span>
                    </h3>

                    <Button
                      size="sm"
                      onClick={addSocialLink}
                      className="bg-white/10 hover:bg-white/20 text-white text-xs gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة رابط</span>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {profileForm.socialLinks.map((link, idx) => (
                      <div
                        key={link.id || idx}
                        className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center gap-3"
                      >
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="w-9 h-9 rounded-xl bg-[#0d1117] border border-white/10 flex items-center justify-center p-2 shrink-0">
                            <PlatformIcon platform={link.platform} className="w-5 h-5" colored={true} />
                          </div>
                          <select
                            value={link.platform}
                            onChange={(e) => updateSocialLink(idx, "platform", e.target.value)}
                            className="w-full sm:w-40 bg-[#0d1117] border border-white/10 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                          >
                            {Object.values(SUPPORTED_PLATFORMS).map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name}
                              </option>
                            ))}
                            <option value="other">أخرى / Custom</option>
                          </select>
                        </div>

                        <div className="w-full sm:w-40">
                          <Input
                            value={link.title}
                            onChange={(e) => updateSocialLink(idx, "title", e.target.value)}
                            placeholder="عنوان الرابط"
                            className="bg-[#0d1117] border-white/10 text-xs h-9 rounded-xl"
                          />
                        </div>

                        <div className="w-full sm:flex-1">
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(idx, "url", e.target.value)}
                            placeholder="https://..."
                            className="bg-[#0d1117] border-white/10 text-xs h-9 rounded-xl font-mono"
                            dir="ltr"
                          />
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <Switch
                            checked={link.enabled}
                            onCheckedChange={(checked) => updateSocialLink(idx, "enabled", checked)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSocialLink(idx)}
                            className="text-gray-400 hover:text-red-400 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button Floating Bar */}
                <div className="sticky bottom-4 z-20 p-2 sm:p-0 rounded-2xl bg-[#07090e]/80 sm:bg-transparent backdrop-blur-lg sm:backdrop-blur-none border border-white/10 sm:border-none flex items-center justify-between sm:justify-end gap-3 shadow-2xl sm:shadow-none">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPreviewTemplateId(profileForm.templateId);
                      setPreviewOpen(true);
                    }}
                    className="sm:hidden border-white/20 text-xs gap-1.5 h-11 px-4 flex-1"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>معاينة</span>
                  </Button>

                  <Button
                    size="lg"
                    disabled={isSaving}
                    onClick={handleSaveProfile}
                    className="bg-cyan-400 hover:bg-cyan-300 text-black font-ui font-extrabold uppercase tracking-wider px-6 sm:px-8 h-11 sm:h-12 rounded-xl shadow-[0_0_25px_rgba(6,255,240,0.4)] gap-2 flex-[2] sm:flex-initial"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>حفظ التعديلات</span>
                  </Button>
                </div>
              </div>

              {/* Right Mini Live Preview */}
              <div className="hidden lg:block">
                <div className="sticky top-24 rounded-3xl bg-black border border-white/10 p-4 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      <span>معاينة الجوال المباشرة</span>
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setPreviewTemplateId(profileForm.templateId);
                        setPreviewOpen(true);
                      }}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 h-7 px-2"
                    >
                      تكبير الشاشة
                    </Button>
                  </div>

                  <div className="h-[620px] rounded-2xl overflow-y-auto border border-white/5 scrollbar-thin scrollbar-thumb-white/10">
                    <ProfileTemplateRenderer profile={profileForm} />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: TEMPLATES GALLERY */}
          <TabsContent value="templates" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>معرض القوالب الاحترافية</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-none font-mono text-xs">
                    30 قالب
                  </Badge>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  جميع القوالب تستخدم نفس بياناتك المحفوظة دون فقدان أي معلومات عند التبديل بينها.
                </p>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════
                🎨 QUICK CUSTOMIZATION PANEL
            ═══════════════════════════════════════════════════════ */}
            <div data-customizer className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-900/20 via-cyan-900/10 to-black border border-purple-500/20 backdrop-blur-xl space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-bold text-white">تخصيص سريع للقالب</h4>
                  <Badge className="bg-purple-500/20 text-purple-300 border-none text-[10px]">مباشر</Badge>
                </div>
                <Button
                  size="sm"
                  disabled={isSaving}
                  onClick={handleSaveProfile}
                  className="bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs gap-1.5 h-8 px-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>حفظ التخصيص</span>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                {/* Primary Color Picker */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                    اللون الرئيسي
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { color: "#06fff0", label: "سيان" },
                      { color: "#a855f7", label: "بنفسجي" },
                      { color: "#f59e0b", label: "ذهبي" },
                      { color: "#ec4899", label: "وردي" },
                      { color: "#10b981", label: "أخضر" },
                      { color: "#3b82f6", label: "أزرق" },
                      { color: "#f97316", label: "برتقالي" },
                      { color: "#ef4444", label: "أحمر" },
                    ].map(({ color, label }) => (
                      <button
                        key={color}
                        title={label}
                        onClick={() =>
                          setProfileForm({
                            ...profileForm,
                            customTheme: { ...(profileForm.customTheme || {}), primaryColor: color },
                          })
                        }
                        className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                          (profileForm.customTheme?.primaryColor || "#06fff0") === color
                            ? "border-white scale-110 shadow-lg"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    {/* Custom color input */}
                    <div className="relative">
                      <input
                        type="color"
                        value={profileForm.customTheme?.primaryColor || "#06fff0"}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            customTheme: { ...(profileForm.customTheme || {}), primaryColor: e.target.value },
                          })
                        }
                        className="w-7 h-7 rounded-full cursor-pointer border-2 border-dashed border-white/30 hover:border-white/60 bg-transparent p-0 overflow-hidden"
                        title="لون مخصص"
                      />
                    </div>
                  </div>
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${profileForm.customTheme?.primaryColor || "#06fff0"}44, ${profileForm.customTheme?.primaryColor || "#06fff0"})`,
                    }}
                  />
                </div>

                {/* Background Style */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
                    نمط الخلفية
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "solid", icon: "■", label: "صلبة" },
                      { id: "gradient", icon: "◑", label: "متدرجة" },
                      { id: "mesh", icon: "⬡", label: "شبكية" },
                      { id: "particles", icon: "✦", label: "جسيمات" },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() =>
                          setProfileForm({
                            ...profileForm,
                            customTheme: {
                              ...(profileForm.customTheme || {}),
                              backgroundStyle: style.id as "solid" | "gradient" | "mesh" | "particles",
                            },
                          })
                        }
                        className={`p-2 rounded-xl border text-center transition-all text-xs ${
                          (profileForm.customTheme?.backgroundStyle || "solid") === style.id
                            ? "border-purple-400 bg-purple-500/20 text-white font-bold shadow-md"
                            : "border-white/10 bg-black/30 text-gray-400 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        <div className="text-lg mb-0.5">{style.icon}</div>
                        <div>{style.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    نوع الخط
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { id: "inter", label: "Inter", preview: "Modern" },
                      { id: "space-grotesk", label: "Space Grotesk", preview: "Creative" },
                      { id: "poppins", label: "Poppins", preview: "Friendly" },
                      { id: "mono", label: "JetBrains Mono", preview: "Developer" },
                      { id: "playfair", label: "Playfair Display", preview: "Elegant" },
                    ].map((font) => (
                      <button
                        key={font.id}
                        onClick={() =>
                          setProfileForm({
                            ...profileForm,
                            customTheme: { ...(profileForm.customTheme || {}), fontFamily: font.id },
                          })
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-left transition-all flex items-center justify-between ${
                          (profileForm.customTheme?.fontFamily || "inter") === font.id
                            ? "border-amber-400 bg-amber-500/10 text-white"
                            : "border-white/10 bg-black/30 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span className="text-xs font-semibold">{font.label}</span>
                        <span className="text-[10px] text-gray-500">{font.preview}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background Color Row */}
              <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label className="text-xs font-bold text-gray-300 shrink-0 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" />
                  لون الخلفية الأساسي:
                </label>
                <div className="flex flex-wrap gap-2 items-center">
                  {[
                    { color: "#07090e", label: "أسود داكن" },
                    { color: "#0a0a0a", label: "أسود نقي" },
                    { color: "#0d1117", label: "رمادي GitHub" },
                    { color: "#1a0533", label: "بنفسجي داكن" },
                    { color: "#001a1a", label: "فيروزي داكن" },
                    { color: "#0a0a1a", label: "أزرق داكن" },
                    { color: "#1a0a00", label: "بني داكن" },
                    { color: "#ffffff", label: "أبيض" },
                  ].map(({ color, label }) => (
                    <button
                      key={color}
                      title={label}
                      onClick={() =>
                        setProfileForm({
                          ...profileForm,
                          customTheme: { ...(profileForm.customTheme || {}), backgroundColor: color },
                        })
                      }
                      className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                        (profileForm.customTheme?.backgroundColor || "#07090e") === color
                          ? "border-white scale-110 shadow-lg ring-2 ring-white/20"
                          : "border-white/10 opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={profileForm.customTheme?.backgroundColor || "#07090e"}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        customTheme: { ...(profileForm.customTheme || {}), backgroundColor: e.target.value },
                      })
                    }
                    className="w-7 h-7 rounded-lg cursor-pointer border-2 border-dashed border-white/30 hover:border-white/60 bg-transparent p-0"
                    title="لون مخصص"
                  />
                  <span className="text-[11px] text-gray-500 font-mono">
                    {profileForm.customTheme?.backgroundColor || "#07090e"}
                  </span>
                </div>
              </div>

              {/* Live preview color bar */}
              <div
                className="h-2 rounded-full overflow-hidden opacity-60"
                style={{
                  background: `linear-gradient(135deg, ${profileForm.customTheme?.backgroundColor || "#07090e"} 0%, ${profileForm.customTheme?.primaryColor || "#06fff0"}66 50%, ${profileForm.customTheme?.primaryColor || "#06fff0"} 100%)`,
                }}
              />
            </div>

            {/* Smart Search & Filter Bar */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="ابحث بالاسم أو النمط (مثل: cyberpunk, minimal, luxury, ذهبي, مطور...)"
                    className="bg-black/40 border-white/10 pr-10 pl-9 text-xs h-10 rounded-xl focus:border-cyan-400"
                  />
                  {templateSearch && (
                    <button
                      onClick={() => setTemplateSearch("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Free / Premium Filter Toggle */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 shrink-0">
                  <button
                    onClick={() => setTemplatePriceFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${templatePriceFilter === "all" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"}`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setTemplatePriceFilter("free")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${templatePriceFilter === "free" ? "bg-cyan-500/30 text-cyan-300" : "text-gray-400 hover:text-white"}`}
                  >
                    مجاني
                  </button>
                  <button
                    onClick={() => setTemplatePriceFilter("premium")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${templatePriceFilter === "premium" ? "bg-amber-500/30 text-amber-300" : "text-gray-400 hover:text-white"}`}
                  >
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </button>
                </div>
              </div>

              {/* Category Pills with horizontal scroll on small screens */}
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
                  <span className="text-[11px] text-gray-400 ml-1 font-ui flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3" />
                    <span>التصنيف:</span>
                  </span>
                  {[
                    { id: "all", label: "جميع التصنيفات" },
                    { id: "diamond", label: "💎 الماسية النادرة" },
                    { id: "developer", label: "💻 مطورين وبرمجة" },
                    { id: "creative", label: "🎨 إبداعي وفن" },
                    { id: "luxury", label: "👑 فاخر و VIP" },
                    { id: "business", label: "💼 أعمال وشركات" },
                    { id: "minimal", label: "✨ بسيط ونظيف" },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setTemplateCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all shrink-0 ${
                        templateCategory === cat.id
                          ? cat.id === "diamond"
                            ? "bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 text-black font-extrabold shadow-lg shadow-rose-500/20"
                            : "bg-cyan-400 text-black font-bold shadow-md shadow-cyan-500/20"
                          : cat.id === "diamond"
                          ? "bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-cyan-500/10 text-amber-200 border border-amber-500/30 hover:border-amber-400/60"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filtered Templates Grid */}
            {(() => {
              const filtered = TEMPLATES.filter((tmpl) => {
                const matchesSearch =
                  !templateSearch.trim() ||
                  tmpl.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                  tmpl.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
                  tmpl.category.toLowerCase().includes(templateSearch.toLowerCase()) ||
                  tmpl.features.some((f) => f.toLowerCase().includes(templateSearch.toLowerCase()));

                const matchesCategory =
                  templateCategory === "all" || tmpl.category === templateCategory;

                const matchesPrice =
                  templatePriceFilter === "all" ||
                  (templatePriceFilter === "free" && !tmpl.isPremium) ||
                  (templatePriceFilter === "premium" && tmpl.isPremium);

                return matchesSearch && matchesCategory && matchesPrice;
              });

              if (filtered.length === 0) {
                return (
                  <div className="text-center py-16 px-4 bg-white/[0.02] border border-white/10 rounded-3xl">
                    <Search className="w-10 h-10 text-gray-500 mx-auto mb-3 opacity-40" />
                    <h4 className="text-base font-bold text-white mb-1">لا توجد قوالب مطابقة للبحث</h4>
                    <p className="text-xs text-gray-400 mb-4">
                      جرب تغيير كلمة البحث أو إعادة تعيين الفلاتر
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setTemplateSearch("");
                        setTemplateCategory("all");
                        setTemplatePriceFilter("all");
                      }}
                      className="text-xs border-white/10"
                    >
                      إعادة تعيين الفلاتر
                    </Button>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filtered.map((tmpl) => {
                    const isSelected = profileForm.templateId === tmpl.id;
                    const isUnlocked = unlockedTemplates.includes(tmpl.id);

                    return (
                      <div
                        key={tmpl.id}
                        className={`rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                          tmpl.category === "diamond"
                            ? isSelected
                              ? "border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-[0_0_35px_rgba(251,191,36,0.3)] bg-gradient-to-br from-amber-950/40 via-zinc-900 to-rose-950/30"
                              : "border border-amber-500/30 hover:border-amber-400/70 hover:shadow-[0_0_25px_rgba(251,191,36,0.2)] bg-gradient-to-br from-amber-950/20 via-zinc-900 to-black"
                            : isSelected
                            ? "border-cyan-400 ring-2 ring-cyan-400/20 shadow-[0_0_25px_rgba(6,255,240,0.2)] bg-white/[0.03] border"
                            : "border-white/10 hover:border-white/30 bg-white/[0.03] border"
                        }`}
                      >
                        <div>
                          <div className="relative h-44 overflow-hidden group">
                            <img
                              src={tmpl.thumbnail}
                              alt={tmpl.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                            <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                              {tmpl.category === "diamond" ? (
                                <>
                                  <Badge className="bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 text-black font-extrabold border-none shadow-xl text-[10px] flex items-center gap-1">
                                    <span>💎</span>
                                    <span>Diamond {tmpl.priceDZD} دج</span>
                                  </Badge>
                                  {tmpl.originalPriceDZD && (
                                    <span className="text-[10px] font-bold text-amber-300 bg-black/85 px-1.5 py-0.5 rounded border border-amber-400/40 line-through">
                                      {tmpl.originalPriceDZD} دج (-10%)
                                    </span>
                                  )}
                                </>
                              ) : tmpl.isPremium ? (
                                <>
                                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold border-none shadow-lg text-[10px] flex items-center gap-1">
                                    <Crown className="w-3 h-3" />
                                    <span>Premium {tmpl.priceDZD} دج</span>
                                  </Badge>
                                  {tmpl.originalPriceDZD && (
                                    <span className="text-[10px] font-bold text-emerald-300 bg-black/85 px-1.5 py-0.5 rounded border border-emerald-500/40 line-through">
                                      {tmpl.originalPriceDZD} دج (-10%)
                                    </span>
                                  )}
                                </>
                              ) : (
                                <Badge className="bg-emerald-500 text-black font-extrabold border-none text-[10px] shadow-md shadow-emerald-500/20">
                                  مجاني Free (0 دج)
                                </Badge>
                              )}
                            </div>

                            {isSelected && (
                              <div className="absolute bottom-3 left-3 bg-cyan-400 text-black px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>القالب الحالي</span>
                              </div>
                            )}
                          </div>

                          <div className="p-5">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-base text-white truncate">{tmpl.name}</h4>
                              <span
                                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                                  tmpl.category === "diamond"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                                    : "text-gray-500 bg-white/5"
                                }`}
                              >
                                {tmpl.category === "diamond" ? "💎 Diamond" : tmpl.category}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                              {tmpl.description}
                            </p>

                            <div className="space-y-1.5 mb-2">
                              {tmpl.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-gray-300">
                                  <Check className="w-3 h-3 text-cyan-400 shrink-0" />
                                  <span className="truncate">{f}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0 flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setPreviewTemplateId(tmpl.id);
                              setPreviewOpen(true);
                            }}
                            className="text-xs border-white/10 hover:border-white/30 h-9 px-3"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            معاينة
                          </Button>

                          {isSelected ? (
                            <div className="flex gap-1.5 flex-1">
                              <Button size="sm" disabled className="text-xs flex-1 bg-white/10 text-gray-400 h-9">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                مطبق
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                  setTimeout(() => {
                                    const el = document.querySelector("[data-customizer]");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                  }, 100);
                                }}
                                className="text-xs h-9 px-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30"
                              >
                                <Palette className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ) : isUnlocked ? (
                            <Button
                              size="sm"
                              onClick={() => handleSelectTemplate(tmpl.id)}
                              className="text-xs flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-bold h-9"
                            >
                              تطبيق القالب
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setBuyTemplateModal(tmpl)}
                              className="text-xs flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-90 text-black font-bold flex items-center gap-1 h-9"
                            >
                              <Lock className="w-3 h-3" />
                              <span>شراء ({tmpl.priceDZD} دج) {tmpl.originalPriceDZD ? "[-10%]" : ""}</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </TabsContent>

          {/* TAB 4: BILLING & SUBSCRIPTIONS */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Status */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl md:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-ui font-semibold">الخطة الحالية</span>
                  <Badge className={`border-none text-xs font-bold ${isExpired ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"}`}>
                    {isTrial ? "تجربة 7 أيام" : "اشتراك نشط"}
                  </Badge>
                </div>

                <div className="pt-2">
                  <div className="text-3xl font-extrabold text-white">
                    {isTrial ? "مجانية (Trial)" : "500 دج"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {isTrial ? "7 أيام كاملة لجميع الميزات" : "تجديد شهري عبر BaridiMob / CCP"}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>الوقت المتبقي:</span>
                    <span className="text-cyan-400 font-bold">{remainingDays} يوم و {remainingHours} ساعة</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>تاريخ البداية:</span>
                    <span>{subscription?.trialStartsAt?.toDate ? subscription.trialStartsAt.toDate().toLocaleDateString("ar-DZ") : "حديثاً"}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>تاريخ الانتهاء:</span>
                    <span>{subscription?.trialEndsAt?.toDate ? subscription.trialEndsAt.toDate().toLocaleDateString("ar-DZ") : "بعد 7 أيام"}</span>
                  </div>
                </div>
              </div>

              {/* Local Payment Instructions & Proof Upload */}
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-cyan-500/30 backdrop-blur-xl md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-cyan-400" />
                    <span>اختر خطة الاشتراك المناسبة لك</span>
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    اختر بين الاشتراك الشهري أو السنوي، ثم حدد طريقة الدفع (بريديموب أو USDT) وارفع صورة الوصل لتأكيد التفعيل فوراً.
                  </p>

                  {/* Plan Choice Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setSelectedBillingPlan("monthly")}
                      className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                        selectedBillingPlan === "monthly"
                          ? "bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(6,255,240,0.2)]"
                          : "bg-black/40 border-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-white">الاشتراك الشهري</span>
                        <Badge className="bg-cyan-400 text-black font-extrabold text-[10px]">شهري</Badge>
                      </div>
                      <div className="text-2xl font-black text-cyan-400 font-mono mt-1">500 دج <span className="text-xs font-normal text-gray-400 font-ui">/ شهر</span></div>
                      <p className="text-[11px] text-gray-400 mt-1">مرونة تامة (~ 2.2 USDT)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBillingPlan("yearly")}
                      className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between relative overflow-hidden ${
                        selectedBillingPlan === "yearly"
                          ? "bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.25)]"
                          : "bg-black/40 border-white/10 hover:border-amber-400/50"
                      }`}
                    >
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-black text-[9px] uppercase tracking-wider">
                          وفر 2,000 دج ⚡
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-amber-200">الاشتراك السنوي VIP</span>
                      </div>
                      <div className="text-2xl font-black text-amber-400 font-mono mt-1">4,000 دج <span className="text-xs font-normal text-gray-400 font-ui">/ سنة</span></div>
                      <p className="text-[11px] text-amber-300/80 mt-1">سنة كاملة بسعر 8 أشهر فقط (~ 18 USDT)</p>
                    </button>
                  </div>
                </div>

                {/* Payment Methods Selector (Two Options: BaridiMob & USDT) */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <span>اختر طريقة الدفع:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("baridimob")}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                        selectedPaymentMethod === "baridimob"
                          ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,255,240,0.15)]"
                          : "bg-black/40 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">بريديموب BaridiMob</div>
                          <div className="text-[11px] text-cyan-300/80">تحويل فوري في الجزائر</div>
                        </div>
                      </div>
                      {selectedPaymentMethod === "baridimob" && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("usdt")}
                      className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                        selectedPaymentMethod === "usdt"
                          ? "bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                          : "bg-black/40 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <Coins className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">دفع بـ USDT (عملة مشفرة)</div>
                          <div className="text-[11px] text-emerald-300/80">دفع عالمي فوري وآمن</div>
                        </div>
                      </div>
                      {selectedPaymentMethod === "usdt" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                </div>

                {/* Account Details Box based on selected method */}
                {selectedPaymentMethod === "baridimob" ? (
                  <div className="p-4 rounded-2xl bg-black/50 border border-cyan-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-cyan-400 font-bold">
                      <span>حساب بريدي موب BaridiMob المعتمد:</span>
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-none text-[10px]">
                        {selectedBillingPlan === "yearly" ? "4,000 دج" : "500 دج"}
                      </Badge>
                    </div>
                    <div className="p-3 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between" dir="ltr">
                      <span className="font-mono text-cyan-300 text-sm font-bold tracking-wider">00799999002345678912</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("00799999002345678912");
                          toast.success("تم نسخ رقم حساب BaridiMob!");
                        }}
                        className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-0.5">
                      <span>الاسم: NOVAWEB SARL</span>
                      <span className="text-cyan-400">تحويل مباشر عبر تطبيق بريديموب</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>عنوان محفظة USDT (Tether):</span>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-none text-[10px] font-bold">
                        {selectedBillingPlan === "yearly" ? "المبلغ: ~ 18 USDT" : "المبلغ: ~ 2.2 USDT"}
                      </Badge>
                    </div>
                    <div className="p-3 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between gap-2" dir="ltr">
                      <span className="font-mono text-emerald-300 text-xs sm:text-sm font-bold truncate">
                        {USDT_WALLET_ADDRESS}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyUsdt}
                        className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors text-xs font-bold"
                      >
                        {copiedUsdt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUsdt ? "تم النسخ" : "نسخ"}</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400 gap-1 pt-0.5">
                      <span className="text-emerald-400/90 font-medium">الشبكات المدعومة: BEP-20 (BNB Smart Chain) / Polygon / Ethereum (ERC-20)</span>
                    </div>
                  </div>
                )}

                {/* Upload Receipt Only (No Transaction Reference number input) */}
                <div className="space-y-4 pt-1">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300">
                    💡 <span className="text-white font-bold">طريقة التأكيد:</span> بعد إرسال المبلغ عبر {selectedPaymentMethod === "baridimob" ? "بريديموب" : "USDT"}، ارفع صورة الوصل أو لقطة الشاشة أدناه مباشرة واضغط تأكيد دون الحاجة لكتابة أي رقم.
                  </div>

                  <ImageUploadInput
                    label={selectedPaymentMethod === "baridimob" ? "صورة وصل بريديموب (مطلوب)" : "صورة إيصال / لقطة شاشة تحويل USDT (مطلوب)"}
                    value={receiptUrl}
                    onChange={(url) => setReceiptUrl(url)}
                    placeholder="ارفع صورة الوصل هنا..."
                    aspectRatio="cover"
                  />

                  <Button
                    disabled={isSubmittingPayment}
                    onClick={() => handleSubmitPayment("subscription", selectedBillingPlan === "yearly" ? "yearly" : "basic", selectedBillingPlan === "yearly" ? 4000 : 500)}
                    className="w-full sm:w-auto bg-gradient-to-r from-cyan-400 to-amber-400 hover:opacity-90 text-black font-ui font-extrabold uppercase tracking-wider px-8 h-11 rounded-xl text-xs gap-2"
                  >
                    {isSubmittingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>
                      {selectedBillingPlan === "yearly"
                        ? (selectedPaymentMethod === "usdt" ? "إرسال وصل الاشتراك السنوي (~ 18 USDT)" : "إرسال وصل الاشتراك السنوي (4,000 دج)")
                        : (selectedPaymentMethod === "usdt" ? "إرسال وصل الاشتراك الشهري (~ 2.2 USDT)" : "إرسال وصل الاشتراك الشهري (500 دج)")}
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment Requests History */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>سجل عمليات الدفع والاشتراك</span>
              </h3>

              {paymentHistory.length === 0 ? (
                <p className="text-xs text-gray-500 py-4 text-center">لا توجد عمليات دفع سابقة حتى الآن.</p>
              ) : (
                <div className="space-y-2">
                  {paymentHistory.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{item.type === "subscription" ? "اشتراك المنصة" : `شراء قالب (${item.targetId})`}</span>
                          <span className="text-cyan-400">({item.amountDZD} دج)</span>
                          <Badge variant="outline" className={`text-[10px] ${item.paymentMethod === "usdt" ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10" : "border-cyan-500/40 text-cyan-300 bg-cyan-500/10"}`}>
                            {item.paymentMethod === "usdt" ? "USDT 🪙" : "بريديموب 💳"}
                          </Badge>
                        </div>
                        {item.receiptUrl && (
                          <div className="mt-1">
                            <a href={item.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-cyan-400 hover:underline inline-flex items-center gap-1">
                              <span>معاينة صورة الوصل المرفوع</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                      <div>
                        <Badge className={`text-[10px] ${item.status === "approved" ? "bg-emerald-500/20 text-emerald-400" : item.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"}`}>
                          {item.status === "approved" ? "تم التأكيد ✓" : item.status === "rejected" ? "مرفوض" : "قيد المراجعة ⌛"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* FULL LIVE PREVIEW MODAL */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl h-[90vh] bg-[#07090e] border border-white/10 p-0 flex flex-col overflow-hidden text-white">
          <DialogHeader className="px-6 py-3 border-b border-white/10 flex flex-row items-center justify-between">
            <DialogTitle className="text-sm font-bold flex items-center gap-2 text-white">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>معاينة حية للقالب: {getTemplateById(previewTemplateId || profileForm.templateId).name}</span>
            </DialogTitle>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                size="sm"
                variant={previewDevice === "mobile" ? "default" : "outline"}
                onClick={() => setPreviewDevice("mobile")}
                className="h-8 px-2.5 text-xs gap-1 border-white/10"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">جوال</span>
              </Button>
              <Button
                size="sm"
                variant={previewDevice === "desktop" ? "default" : "outline"}
                onClick={() => setPreviewDevice("desktop")}
                className="h-8 px-2.5 text-xs gap-1 border-white/10"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">حاسوب</span>
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 flex justify-center bg-black/60">
            <div className={`transition-all duration-300 h-full ${previewDevice === "mobile" ? "w-full max-w-sm rounded-3xl overflow-y-auto border-4 border-white/20 shadow-2xl" : "w-full rounded-2xl overflow-y-auto border border-white/10"}`}>
              <ProfileTemplateRenderer 
                profile={{
                  ...profileForm,
                  templateId: previewTemplateId || profileForm.templateId
                }} 
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* BUY PREMIUM TEMPLATE MODAL */}
      <Dialog open={!!buyTemplateModal} onOpenChange={(open) => !open && setBuyTemplateModal(null)}>
        <DialogContent className="max-w-md bg-[#0a0d16] border border-amber-500/30 text-white rounded-3xl p-6">
          {buyTemplateModal && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">فتح قالب: {buyTemplateModal.name}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  شراء القالب يمنحك حق استخدامه مدى الحياة وربطه بحسابك.
                </p>
                <div className="mt-2 flex flex-col items-center gap-1">
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {buyTemplateModal.priceDZD} دج (لمرة واحدة)
                  </div>
                  {buyTemplateModal.originalPriceDZD && (
                    <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      تم تطبيق تخفيض 10% (السعر الأصلي: <span className="line-through text-gray-400">{buyTemplateModal.originalPriceDZD} دج</span>)
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Methods Choice for Template Buy */}
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-300 font-bold">طريقة الدفع:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("baridimob")}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold flex items-center justify-center gap-1.5 ${
                      selectedPaymentMethod === "baridimob"
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,255,240,0.2)]"
                        : "bg-black/40 border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>بريديموب</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod("usdt")}
                    className={`p-2.5 rounded-xl border text-center transition-all text-xs font-bold flex items-center justify-center gap-1.5 ${
                      selectedPaymentMethod === "usdt"
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "bg-black/40 border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>USDT</span>
                  </button>
                </div>
              </div>

              {selectedPaymentMethod === "baridimob" ? (
                <div className="p-3.5 rounded-2xl bg-black/60 border border-cyan-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-gray-200">
                    <span>الدفع عبر بريدي موب BaridiMob:</span>
                    <span className="text-cyan-400 font-mono">{buyTemplateModal.priceDZD} دج</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between" dir="ltr">
                    <span className="font-mono text-cyan-400 font-bold">00799999002345678912</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText("00799999002345678912");
                        toast.success("تم نسخ رقم حساب BaridiMob!");
                      }}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-gray-400">الاسم: NOVAWEB SARL</div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/30 text-xs space-y-2">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span>عنوان محفظة USDT (Tether):</span>
                    <span className="text-emerald-300 font-mono text-[11px]">
                      ~ {Math.round((buyTemplateModal.priceDZD / 225) * 10) / 10} USDT
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/80 border border-white/10 flex items-center justify-between gap-2" dir="ltr">
                    <span className="font-mono text-emerald-300 text-[11px] truncate">
                      {USDT_WALLET_ADDRESS}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyUsdt}
                      className="text-emerald-400 hover:text-white shrink-0 p-1"
                    >
                      {copiedUsdt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-[10px] text-gray-400">شبكة BEP-20 (BNB Chain) / Polygon / ERC-20</div>
                </div>
              )}

              <div className="space-y-3">
                <ImageUploadInput
                  label={selectedPaymentMethod === "baridimob" ? "صورة وصل بريديموب (مطلوب)" : "صورة وصل تحويل USDT (مطلوب)"}
                  value={receiptUrl}
                  onChange={(url) => setReceiptUrl(url)}
                  placeholder="ارفع وصل أو لقطة شاشة التحويل..."
                  aspectRatio="cover"
                />

                <Button
                  disabled={isSubmittingPayment}
                  onClick={() => handleSubmitPayment("template", buyTemplateModal.id, buyTemplateModal.priceDZD)}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold uppercase tracking-wider text-xs h-11 rounded-xl shadow-lg mt-2"
                >
                  {isSubmittingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : "إرسال وصل الدفع للتأكيد"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="bg-[#0d1117] border border-white/10 text-white max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-purple-400" />
              QR Code لموقعك
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-gray-400">
              امسح الكود لزيارة موقعك الشخصي مباشرةً
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-3 bg-white rounded-2xl shadow-xl shadow-purple-500/10">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://${userProfile.username}.novawebdv.com&color=0d1117&bgcolor=ffffff&margin=10`}
                alt="QR Code"
                width={250}
                height={250}
                className="rounded-lg"
              />
            </div>
            <p className="text-xs font-mono text-cyan-400 dir-ltr font-semibold" dir="ltr">
              {userProfile.username}.novawebdv.com
            </p>
            <div className="flex gap-3 w-full">
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=https://${userProfile.username}.novawebdv.com&color=0d1117&bgcolor=ffffff&margin=15`}
                download={`qr-${userProfile.username}.png`}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs gap-2 rounded-xl">
                  <Download className="w-4 h-4" />
                  تحميل QR Code
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={copyProfileLink}
                className="flex-1 border-white/10 text-xs gap-2 rounded-xl"
              >
                {copiedLink ? <Check className="w-4 h-4 text-cyan-400" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? "تم النسخ!" : "نسخ الرابط"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </main>
    </div>
  );
}

function Building2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}
