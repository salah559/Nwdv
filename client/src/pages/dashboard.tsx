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
  FileText
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

  // Buy Template Modal State
  const [buyTemplateModal, setBuyTemplateModal] = useState<TemplateDefinition | null>(null);
  const [receiptTx, setReceiptTx] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

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

  // Submit Manual Payment Proof (for subscription or template)
  const handleSubmitPayment = async (type: "subscription" | "template", targetId?: string, amountDZD: number = 500) => {
    if (!currentUser || !userProfile) return;
    if (!receiptTx.trim()) {
      toast.error("يرجى إدخال رقم العملية أو الحوالة");
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
        paymentMethod: "baridimob",
        transactionReference: receiptTx,
        receiptUrl: receiptUrl,
        status: "pending",
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "payments"), newPayment);
      toast.success("تم إرسال إشعار الدفع بنجاح! سيتم تفعيله من قبل الإدارة بعد المراجعة.");
      setReceiptTx("");
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
    <div className="min-h-screen bg-[#07090e] text-white selection:bg-cyan-500/30 pt-20 pb-24 md:pb-12 px-4 sm:px-6">
      <SEO title={`لوحة التحكم — ${userProfile.fullName}`} />

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-400/50 p-0.5 bg-black">
              <img
                src={userProfile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80"}
                alt={userProfile.fullName}
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {userProfile.fullName}
                </h1>
                <Badge variant="outline" className="border-cyan-500/40 text-cyan-400 font-mono text-[10px]">
                  @{userProfile.username}
                </Badge>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1.5" dir="ltr">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{userProfile.username}.novawebdv.com</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyProfileLink}
              className="border-white/10 hover:border-cyan-400 text-xs gap-1.5"
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
              className="bg-white/10 hover:bg-white/20 text-white text-xs gap-1.5 border border-white/10"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة حية</span>
            </Button>

            <a href={`/p/${userProfile.username}`} target="_blank" rel="noreferrer">
              <Button
                size="sm"
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>زيارة موقعك</span>
              </Button>
            </a>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-gray-400 hover:text-red-400 text-xs hover:bg-red-500/10"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs System */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/[0.04] border border-white/10 p-1 rounded-2xl w-full justify-start h-auto flex-wrap">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl px-5 py-2.5 text-xs font-bold font-ui gap-2"
            >
              <Layout className="w-4 h-4" />
              <span>نظرة عامة</span>
            </TabsTrigger>

            <TabsTrigger
              value="builder"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl px-5 py-2.5 text-xs font-bold font-ui gap-2"
            >
              <User className="w-4 h-4" />
              <span>منشئ الموقع</span>
            </TabsTrigger>

            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl px-5 py-2.5 text-xs font-bold font-ui gap-2"
            >
              <Palette className="w-4 h-4" />
              <span>القوالب (8)</span>
            </TabsTrigger>

            <TabsTrigger
              value="billing"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 rounded-xl px-5 py-2.5 text-xs font-bold font-ui gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>الاشتراك والدفع</span>
            </TabsTrigger>
          </TabsList>

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
                  <a href={`/p/${userProfile.username}`} target="_blank" rel="noreferrer" className="flex-1">
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
                <div className="mt-6 pt-4 border-t border-white/5">
                  <Button size="sm" variant="outline" onClick={() => setActiveTab("templates")} className="text-xs w-full">
                    تغيير القالب
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

                {/* Save Button */}
                <div className="sticky bottom-6 z-20 flex justify-end">
                  <Button
                    size="lg"
                    disabled={isSaving}
                    onClick={handleSaveProfile}
                    className="bg-cyan-400 hover:bg-cyan-300 text-black font-ui font-extrabold uppercase tracking-wider px-8 h-12 rounded-xl shadow-[0_0_25px_rgba(6,255,240,0.4)] gap-2"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>حفظ جميع التعديلات</span>
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
                <h3 className="text-xl font-bold text-white">معرض القوالب الاحترافية</h3>
                <p className="text-xs text-gray-400">
                  جميع القوالب تستخدم نفس بياناتك المحفوظة دون فقدان أي معلومات عند التبديل بينها.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEMPLATES.map((tmpl) => {
                const isSelected = profileForm.templateId === tmpl.id;
                const isUnlocked = unlockedTemplates.includes(tmpl.id);

                return (
                  <div
                    key={tmpl.id}
                    className={`rounded-3xl overflow-hidden bg-white/[0.03] border transition-all duration-300 flex flex-col justify-between ${isSelected ? "border-cyan-400 ring-2 ring-cyan-400/20 shadow-[0_0_25px_rgba(6,255,240,0.2)]" : "border-white/10 hover:border-white/30"}`}
                  >
                    <div>
                      <div className="relative h-44 overflow-hidden group">
                        <img
                          src={tmpl.thumbnail}
                          alt={tmpl.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 flex gap-1">
                          {tmpl.isPremium ? (
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold border-none shadow-lg text-[10px] flex items-center gap-1">
                              <Crown className="w-3 h-3" />
                              <span>Premium {tmpl.priceDZD} دج</span>
                            </Badge>
                          ) : (
                            <Badge className="bg-cyan-500 text-black font-bold border-none text-[10px]">
                              مجاني Free
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
                        <h4 className="font-bold text-base text-white mb-1">{tmpl.name}</h4>
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

                    <div className="p-5 pt-0 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setPreviewTemplateId(tmpl.id);
                          setPreviewOpen(true);
                        }}
                        className="text-xs border-white/10 flex-1 hover:border-white/30"
                      >
                        معاينة
                      </Button>

                      {isSelected ? (
                        <Button size="sm" disabled className="text-xs flex-1 bg-white/10 text-gray-400">
                          مطبق
                        </Button>
                      ) : isUnlocked ? (
                        <Button
                          size="sm"
                          onClick={() => handleSelectTemplate(tmpl.id)}
                          className="text-xs flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-bold"
                        >
                          تطبيق القالب
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setBuyTemplateModal(tmpl)}
                          className="text-xs flex-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-90 text-black font-bold flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3" />
                          <span>شراء ({tmpl.priceDZD} دج)</span>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
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
                    <span>تجديد الاشتراك (500 دج شهرياً) عبر الدفع المحلي</span>
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    قم بالتحويل عبر تطبيق BaridiMob أو مركز البريد CCP، ثم أدخل رقم العملية أو ارفع صورة الوصل أدناه لتأكيد التجديد.
                  </p>
                </div>

                {/* Account Details Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-cyan-400 font-bold">
                      <span>BaridiMob (بريدي موب)</span>
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="font-mono text-gray-200 text-sm font-bold pt-1" dir="ltr">
                      00799999002345678912
                    </div>
                    <div className="text-[11px] text-gray-400">الاسم: NOVAWEB SARL</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-amber-400 font-bold">
                      <span>حساب بريد الجزائر CCP</span>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="font-mono text-gray-200 text-sm font-bold pt-1" dir="ltr">
                      0012345678 Clé 45
                    </div>
                    <div className="text-[11px] text-gray-400">الاسم: NOVAWEB SERVICES</div>
                  </div>
                </div>

                {/* Submit Receipt Form with Direct ImgBB Upload */}
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-300">رقم الحوالة أو مرجع العملية (Transaction Reference)</Label>
                    <Input
                      value={receiptTx}
                      onChange={(e) => setReceiptTx(e.target.value)}
                      placeholder="مثال: TXN-89472384"
                      className="bg-black/50 border-white/10 text-xs h-10 rounded-xl font-mono"
                      dir="ltr"
                    />
                  </div>

                  <ImageUploadInput
                    label="صورة الوصل أو الإيصال (اختياري)"
                    value={receiptUrl}
                    onChange={(url) => setReceiptUrl(url)}
                    placeholder="ارفع وصل BaridiMob أو CCP..."
                    aspectRatio="cover"
                  />

                  <Button
                    disabled={isSubmittingPayment}
                    onClick={() => handleSubmitPayment("subscription", "basic", 500)}
                    className="w-full sm:w-auto bg-cyan-400 hover:bg-cyan-300 text-black font-ui font-extrabold uppercase tracking-wider px-8 h-11 rounded-xl text-xs gap-2"
                  >
                    {isSubmittingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>إرسال إشعار التجديد (500 دج)</span>
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
                          <span>{item.type === "subscription" ? "اشتراك شهري" : `شراء قالب (${item.targetId})`}</span>
                          <span className="text-cyan-400">({item.amountDZD} دج)</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono" dir="ltr">
                          مرجع: {item.transactionReference || "—"}
                        </div>
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
                <div className="text-2xl font-black text-amber-400 mt-2 font-mono">
                  {buyTemplateModal.priceDZD} دج (لمرة واحدة)
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 text-xs space-y-1">
                <div className="font-bold text-gray-200">الدفع عبر بريدي موب BaridiMob:</div>
                <div className="font-mono text-cyan-400 font-bold" dir="ltr">
                  00799999002345678912
                </div>
                <div className="text-[11px] text-gray-400">الاسم: NOVAWEB SARL</div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-300">رقم أو مرجع العملية (BaridiMob)</Label>
                  <Input
                    value={receiptTx}
                    onChange={(e) => setReceiptTx(e.target.value)}
                    placeholder="TXN-XXXXXX"
                    className="bg-black border-white/10 text-xs h-10 rounded-xl font-mono"
                    dir="ltr"
                  />
                </div>

                <ImageUploadInput
                  label="صورة وصل BaridiMob (اختياري)"
                  value={receiptUrl}
                  onChange={(url) => setReceiptUrl(url)}
                  placeholder="ارفع وصل العملية..."
                  aspectRatio="cover"
                />

                <Button
                  disabled={isSubmittingPayment}
                  onClick={() => handleSubmitPayment("template", buyTemplateModal.id, buyTemplateModal.priceDZD)}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold uppercase tracking-wider text-xs h-11 rounded-xl shadow-lg mt-2"
                >
                  {isSubmittingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : "إرسال تأكيد الشراء"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
