import { useState, useEffect } from "react";
import { 
  Users, 
  Crown, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Search, 
  Calendar, 
  ShieldAlert, 
  Trash2, 
  Loader2,
  Lock,
  Unlock,
  AlertCircle,
  Code2,
  Plus,
  Eye,
  EyeOff,
  Edit3,
  Copy
} from "lucide-react";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  setDoc, 
  deleteDoc, 
  addDoc, 
  Timestamp, 
  query, 
  orderBy,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, UserSubscription, PaymentRecord } from "@shared/saas-schema";
import { TEMPLATES } from "@/lib/templates-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { CustomTemplatePreview } from "@/components/templates/CustomTemplateRenderer";

// ─────────────────────────────────────────────────
// Custom Template Admin Section (standalone component)
// ─────────────────────────────────────────────────
interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isPremium: boolean;
  priceDZD: number;
  originalPriceDZD?: number;
  features: string[];
  thumbnail?: string;
  htmlCode: string;
  isActive: boolean;
  createdAt?: any;
}

const CHATGPT_PROMPT_TEMPLATE = `أنشئ قالب HTML كامل لصفحة بروفايل شخصية (Profile Page) باستخدام HTML و CSS و JavaScript فقط (ملف واحد).

المتطلبات:
1. الصفحة تعمل بشكل مستقل بدون أي مكتبات خارجية (إلا إذا حمّلتها عبر CDN)
2. تصميم جميل ومبدع وعصري
3. تستخدم هذه المتغيرات (placeholder) التي سيتم استبدالها تلقائياً بالبيانات الحقيقية:
   - {{fullName}} — الاسم الكامل
   - {{bio}} — نبذة شخصية
   - {{jobTitle}} — المسمى الوظيفي
   - {{location}} — الموقع الجغرافي
   - {{email}} — البريد الإلكتروني
   - {{phone}} — رقم الهاتف
   - {{whatsapp}} — رقم واتساب
   - {{website}} — الموقع الإلكتروني
   - {{avatarUrl}} — رابط صورة الأفاتار
   - {{coverUrl}} — رابط صورة الغلاف
   - {{socialLinksHtml}} — روابط التواصل الاجتماعي (HTML جاهز، ضعها داخل div)
   - {{appsHtml}} — روابط التطبيقات (HTML جاهز)

4. استخدام المتغيرات مثال: <h1>{{fullName}}</h1>
5. الصفحة يجب أن تكون responsive (تعمل على الهاتف والكمبيوتر)
6. أضف تأثيرات بصرية جميلة (animations, gradients, etc.)

أنشئ القالب الآن:`;

export function CustomTemplatesAdmin() {
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "custom",
    isPremium: false,
    priceDZD: 0,
    originalPriceDZD: 0,
    features: "",
    thumbnail: "",
    htmlCode: "",
    isActive: true,
  });

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const snap = await getDocs(query(collection(db, "customTemplates"), orderBy("createdAt", "desc")));
      setTemplates(snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomTemplate)));
    } catch {
      toast.error("فشل تحميل القوالب المخصصة");
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => { fetchTemplates(); }, []);

  const resetForm = () => {
    setForm({ name: "", description: "", category: "custom", isPremium: false, priceDZD: 0, originalPriceDZD: 0, features: "", thumbnail: "", htmlCode: "", isActive: true });
    setEditingTemplate(null);
  };

  const handleEdit = (t: CustomTemplate) => {
    setEditingTemplate(t);
    setForm({
      name: t.name,
      description: t.description,
      category: t.category,
      isPremium: t.isPremium,
      priceDZD: t.priceDZD,
      originalPriceDZD: t.originalPriceDZD || 0,
      features: (t.features || []).join(", "),
      thumbnail: t.thumbnail || "",
      htmlCode: t.htmlCode,
      isActive: t.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.htmlCode.trim()) {
      toast.error("الاسم وكود HTML مطلوبان");
      return;
    }
    try {
      const id = editingTemplate?.id || `chatgpt-${Date.now()}`;
      const data: any = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        isPremium: form.isPremium,
        priceDZD: Number(form.priceDZD),
        originalPriceDZD: Number(form.originalPriceDZD) || undefined,
        features: form.features.split(",").map(f => f.trim()).filter(Boolean),
        thumbnail: form.thumbnail.trim() || null,
        htmlCode: form.htmlCode,
        isActive: form.isActive,
        updatedAt: Timestamp.now(),
      };
      if (!editingTemplate) data.createdAt = Timestamp.now();

      await setDoc(doc(db, "customTemplates", id), data, { merge: true });
      toast.success(editingTemplate ? "تم تحديث القالب!" : "تم حفظ القالب الجديد!");
      setShowForm(false);
      resetForm();
      await fetchTemplates();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل تريد حذف القالب "${name}"؟`)) return;
    try {
      await deleteDoc(doc(db, "customTemplates", id));
      toast.success("تم حذف القالب");
      await fetchTemplates();
    } catch {
      toast.error("فشل حذف القالب");
    }
  };

  const handleToggleActive = async (t: CustomTemplate) => {
    try {
      await updateDoc(doc(db, "customTemplates", t.id), { isActive: !t.isActive });
      toast.success(t.isActive ? "تم إيقاف القالب" : "تم تفعيل القالب");
      await fetchTemplates();
    } catch {
      toast.error("فشل تغيير الحالة");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-purple-400" />
            القوالب المخصصة (ChatGPT)
          </h2>
          <p className="text-xs text-gray-400 mt-1">أضف قوالب HTML مصنوعة بـ ChatGPT — تظهر للمستخدمين في قائمة القوالب</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPrompt(!showPrompt)}
            className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs"
          >
            <Copy className="w-3 h-3 mr-1" />
            {showPrompt ? "إخفاء البرومبت" : "برومبت ChatGPT"}
          </Button>
          <Button
            size="sm"
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            قالب جديد
          </Button>
        </div>
      </div>

      {/* ChatGPT Prompt Box */}
      {showPrompt && (
        <Card className="glass border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              برومبت ChatGPT — انسخه وأرسله لـ ChatGPT لإنشاء قالب
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-black/50 rounded-lg p-4 text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
              {CHATGPT_PROMPT_TEMPLATE}
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs"
              onClick={() => {
                navigator.clipboard.writeText(CHATGPT_PROMPT_TEMPLATE);
                toast.success("تم نسخ البرومبت!");
              }}
            >
              <Copy className="w-3 h-3 mr-1" />
              نسخ البرومبت
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <Card className="glass border-purple-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-purple-300">
              {editingTemplate ? `تعديل: ${editingTemplate.name}` : "إضافة قالب مخصص جديد"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">اسم القالب *</label>
                <Input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="مثال: Cosmic Dark Pro"
                  className="bg-black/40 border-white/10 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">الفئة</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full h-10 rounded-md border border-white/10 bg-black/40 text-white text-sm px-3"
                >
                  <option value="custom">مخصص</option>
                  <option value="minimal">Minimal</option>
                  <option value="developer">Developer</option>
                  <option value="creative">Creative</option>
                  <option value="luxury">Luxury</option>
                  <option value="business">Business</option>
                  <option value="diamond">Diamond</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">الوصف</label>
              <Input
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="وصف مختصر للقالب..."
                className="bg-black/40 border-white/10 text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 mt-5">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={form.isPremium}
                  onChange={e => setForm(f => ({ ...f, isPremium: e.target.checked }))}
                  className="w-4 h-4 accent-purple-500"
                />
                <label htmlFor="isPremium" className="text-xs text-gray-300">مدفوع؟</label>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">السعر (دج)</label>
                <Input
                  type="number"
                  value={form.priceDZD}
                  onChange={e => setForm(f => ({ ...f, priceDZD: Number(e.target.value) }))}
                  className="bg-black/40 border-white/10 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">السعر الأصلي (دج، اختياري)</label>
                <Input
                  type="number"
                  value={form.originalPriceDZD}
                  onChange={e => setForm(f => ({ ...f, originalPriceDZD: Number(e.target.value) }))}
                  className="bg-black/40 border-white/10 text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">المميزات (مفصولة بفاصلة)</label>
              <Input
                value={form.features}
                onChange={e => setForm(f => ({ ...f, features: e.target.value }))}
                placeholder="تصميم متجاوب, ألوان نيون, تأثيرات انيميشن..."
                className="bg-black/40 border-white/10 text-white text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">رابط الصورة المصغرة (اختياري)</label>
              <Input
                value={form.thumbnail}
                onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="bg-black/40 border-white/10 text-white text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-400">كود HTML الكامل * (من ChatGPT)</label>
                {form.htmlCode && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewHtml(form.htmlCode)}
                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs h-6"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    معاينة
                  </Button>
                )}
              </div>
              <textarea
                value={form.htmlCode}
                onChange={e => setForm(f => ({ ...f, htmlCode: e.target.value }))}
                placeholder="الصق هنا كود HTML الكامل الذي أنشأه ChatGPT..."
                rows={12}
                className="w-full rounded-md border border-white/10 bg-black/40 text-white text-xs p-3 font-mono resize-y focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                💡 تأكد أن الكود يحتوي على المتغيرات مثل <code className="text-purple-300">{"{{fullName}}"}</code> و <code className="text-purple-300">{"{{bio}}"}</code>
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm"
              >
                {editingTemplate ? "تحديث القالب" : "حفظ القالب"}
              </Button>
              <Button
                variant="outline"
                onClick={() => { setShowForm(false); resetForm(); }}
                className="border-white/10 text-gray-300 text-sm"
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Dialog */}
      {previewHtml && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          <div className="flex items-center justify-between p-3 bg-gray-900 border-b border-white/10">
            <span className="text-sm text-white font-semibold flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              معاينة القالب — بيانات نموذجية
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreviewHtml(null)}
              className="border-white/10 text-white text-xs"
            >
              إغلاق
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            <CustomTemplatePreview htmlCode={previewHtml} />
          </div>
        </div>
      )}

      {/* Templates List */}
      {loadingTemplates ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
        </div>
      ) : templates.length === 0 ? (
        <Card className="glass border-white/10">
          <CardContent className="py-12 text-center">
            <Code2 className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">لا توجد قوالب مخصصة بعد</p>
            <p className="text-gray-500 text-xs mt-1">اضغط "قالب جديد" لإضافة أول قالب</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(t => (
            <Card key={t.id} className={`glass border-white/10 ${!t.isActive ? "opacity-50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">{t.name}</span>
                      {t.isPremium && <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-[10px]">مدفوع</Badge>}
                      {!t.isActive && <Badge className="bg-gray-500/20 text-gray-400 text-[10px]">موقوف</Badge>}
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px]">{t.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.description}</p>
                    {t.isPremium && (
                      <p className="text-xs text-green-400 mt-1 font-mono">{t.priceDZD.toLocaleString()} دج</p>
                    )}
                    <p className="text-[10px] text-gray-500 mt-2 font-mono">ID: {t.id}</p>
                  </div>
                  {t.thumbnail && (
                    <img src={t.thumbnail} alt={t.name} className="w-16 h-16 rounded-lg object-cover border border-white/10 flex-shrink-0" />
                  )}
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPreviewHtml(t.htmlCode)}
                    className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs h-7"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    معاينة
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(t)}
                    className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs h-7"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    تعديل
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(t)}
                    className="border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10 text-xs h-7"
                  >
                    {t.isActive ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
                    {t.isActive ? "إيقاف" : "تفعيل"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(t.id, t.name)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-7"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function SaasAdminTab() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, UserSubscription>>({});
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [adminTab, setAdminTab] = useState<"users" | "templates">("users");

  const fetchData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Profiles
      const pSnap = await getDocs(collection(db, "profiles"));
      const pList = pSnap.docs.map(d => ({ id: d.id, ...d.data() })) as UserProfile[];
      setProfiles(pList);

      // 2. Fetch Subscriptions
      const sSnap = await getDocs(collection(db, "subscriptions"));
      const sMap: Record<string, UserSubscription> = {};
      sSnap.docs.forEach(d => {
        sMap[d.id] = d.data() as UserSubscription;
      });
      setSubscriptions(sMap);

      // 3. Fetch Payments
      const paySnap = await getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc")));
      const payList = paySnap.docs.map(d => ({ id: d.id, ...d.data() })) as PaymentRecord[];
      setPayments(payList);
    } catch (err) {
      console.error("Error loading SaaS admin data:", err);
      toast.error("فشل تحميل بيانات مستخدمي SaaS");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Approve manual payment
  const handleApprovePayment = async (payment: PaymentRecord) => {
    if (!payment.id) return;
    try {
      // 1. Mark payment approved
      await updateDoc(doc(db, "payments", payment.id), {
        status: "approved",
        confirmedAt: Timestamp.now(),
      });

      if (payment.type === "subscription") {
        const isYearly = payment.targetId === "yearly" || payment.amountDZD >= 4000;
        const daysToAdd = isYearly ? 365 : 30;
        const now = new Date();
        const currentEnd = subscriptions[payment.userId]?.currentPeriodEnd?.toDate?.() || now;
        const baseDate = currentEnd > now ? currentEnd : now;
        const newEnd = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        await setDoc(doc(db, "subscriptions", payment.userId), {
          status: "active",
          planId: isYearly ? "yearly" : "basic",
          currentPeriodEnd: Timestamp.fromDate(newEnd),
          updatedAt: Timestamp.now(),
        }, { merge: true });

        toast.success(`تم تأكيد ${isYearly ? "الاشتراك السنوي (365 يوماً)" : "الاشتراك الشهري (30 يوماً)"} للمستخدم @${payment.username}!`);
      } else if (payment.type === "template" && payment.targetId) {
        // Unlock template
        await addDoc(collection(db, "purchases"), {
          userId: payment.userId,
          templateId: payment.targetId,
          priceDZD: payment.amountDZD,
          status: "completed",
          purchasedAt: Timestamp.now(),
        });

        toast.success(`تم فتح القالب (${payment.targetId}) للمستخدم @${payment.username}!`);
      }

      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تأكيد الدفع");
    }
  };

  // Reject payment
  const handleRejectPayment = async (paymentId: string) => {
    try {
      await updateDoc(doc(db, "payments", paymentId), {
        status: "rejected",
        confirmedAt: Timestamp.now(),
      });
      toast.error("تم رفض العملية.");
      await fetchData();
    } catch (err) {
      toast.error("حدث خطأ أثناء رفض الدفع");
    }
  };

  // Extend 30 days directly
  const handleExtend30Days = async (userId: string, username: string) => {
    try {
      const now = new Date();
      const currentEnd = subscriptions[userId]?.currentPeriodEnd?.toDate?.() || now;
      const baseDate = currentEnd > now ? currentEnd : now;
      const newEnd = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      await setDoc(doc(db, "subscriptions", userId), {
        status: "active",
        currentPeriodEnd: Timestamp.fromDate(newEnd),
        updatedAt: Timestamp.now(),
      }, { merge: true });

      toast.success(`تم تمديد اشتراك @${username} بـ 30 يوماً!`);
      await fetchData();
    } catch (err) {
      toast.error("فشل تمديد الاشتراك");
    }
  };

  // Toggle Publish
  const handleTogglePublish = async (userId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "profiles", userId), {
        isPublished: !current,
      });
      toast.success(!current ? "تم نشر الملف" : "تم إلغاء النشر");
      await fetchData();
    } catch (err) {
      toast.error("حدث خطأ في تغيير حالة النشر");
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.username.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const pendingPayments = payments.filter(p => p.status === "pending");
  const activeSubsCount = Object.values(subscriptions).filter(s => s.status === "active").length;
  const trialSubsCount = Object.values(subscriptions).filter(s => s.status === "trial").length;

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs text-gray-400 font-mono">Loading SaaS Admin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admin Section Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setAdminTab("users")}
          className={`px-4 py-2 text-sm rounded-t-lg font-medium transition-colors ${adminTab === "users" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-gray-400 hover:text-white"}`}
        >
          <Users className="w-4 h-4 inline mr-1" />
          المستخدمون والمدفوعات
        </button>
        <button
          onClick={() => setAdminTab("templates")}
          className={`px-4 py-2 text-sm rounded-t-lg font-medium transition-colors ${adminTab === "templates" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-gray-400 hover:text-white"}`}
        >
          <Code2 className="w-4 h-4 inline mr-1" />
          القوالب المخصصة
        </button>
      </div>

      {/* Custom Templates Tab */}
      {adminTab === "templates" && <CustomTemplatesAdmin />}

      {/* Users & Payments Tab */}
      {adminTab === "users" && <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-gray-400">إجمالي مستخدمي المنصة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-white">{profiles.length}</div>
            <p className="text-[11px] text-cyan-400 mt-1">حسابات نشطة</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-gray-400">اشتراكات مدفوعة نشطة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-400">{activeSubsCount}</div>
            <p className="text-[11px] text-gray-400 mt-1">500 دج شهرياً</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-gray-400">في فترة التجربة (Trial)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-blue-400">{trialSubsCount}</div>
            <p className="text-[11px] text-gray-400 mt-1">7 أيام مجانية</p>
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-gray-400">طلبات دفع تنتظر التأكيد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-amber-400">{pendingPayments.length}</div>
            <p className="text-[11px] text-amber-400 mt-1">BaridiMob / USDT</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments Section */}
      <Card className="glass border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-base text-amber-300 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span>طلبات الدفع الواردة ({pendingPayments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingPayments.length === 0 ? (
            <p className="text-xs text-gray-400 py-4 text-center">لا توجد طلبات دفع تنتظر التأكيد حالياً.</p>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map((pay) => (
                <div 
                  key={pay.id} 
                  className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">@{pay.username}</span>
                      <Badge className="bg-amber-500/20 text-amber-400 border-none text-[10px]">
                        {pay.type === "subscription" 
                          ? (pay.targetId === "yearly" || pay.amountDZD >= 4000 ? "اشتراك سنوي (4,000 دج)" : "اشتراك شهري (500 دج)") 
                          : `شراء قالب (${pay.targetId} - ${pay.amountDZD} دج)`}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] ${pay.paymentMethod === "usdt" ? "border-emerald-500/50 text-emerald-300 bg-emerald-500/10" : "border-cyan-500/50 text-cyan-300 bg-cyan-500/10"}`}>
                        {pay.paymentMethod === "usdt" ? "USDT 🪙" : "بريديموب 💳"}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      البريد: <span className="font-mono text-cyan-400">{pay.userEmail}</span>
                    </div>
                    {pay.receiptUrl && (
                      <div className="mt-2">
                        <a 
                          href={pay.receiptUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-xs text-cyan-300 hover:bg-cyan-500/25 transition-colors font-bold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>عرض صورة الوصل المرفقة (معاينة)</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button
                      size="sm"
                      onClick={() => handleApprovePayment(pay)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      تأكيد وتفعيل
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectPayment(pay.id!)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs"
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      رفض
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users & Profiles Directory */}
      <Card className="glass border-white/10">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>قائمة المستخدمين والمواقع الشخصية ({filteredProfiles.length})</span>
          </CardTitle>
          <div className="w-full sm:w-64">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو اسم المستخدم..."
              className="bg-black/40 border-white/10 text-xs h-9 rounded-xl"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="py-3 px-4">المستخدم</th>
                  <th className="py-3 px-4">النطاق الفرعي</th>
                  <th className="py-3 px-4">القالب المختار</th>
                  <th className="py-3 px-4">حالة الاشتراك</th>
                  <th className="py-3 px-4">حالة النشر</th>
                  <th className="py-3 px-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProfiles.map((p) => {
                  const sub = subscriptions[p.userId];
                  const isTrial = sub?.status === "trial";
                  const isActive = sub?.status === "active";
                  const isExpired = sub?.status === "expired";

                  return (
                    <tr key={p.userId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"}
                            alt={p.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-white/10"
                          />
                          <div>
                            <div className="font-bold text-white">{p.fullName}</div>
                            <div className="text-[11px] text-gray-400 font-mono" dir="ltr">{p.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-cyan-400" dir="ltr">
                        <a href={`/p/${p.username}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                          <span>{p.username}</span>
                          <ExternalLink className="w-3 h-3 text-gray-500" />
                        </a>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] border-white/20">
                          {p.templateId}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${isActive ? "bg-emerald-500/20 text-emerald-400" : isTrial ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"}`}>
                          {isActive ? "مشترك (نشط)" : isTrial ? "تجربة مجانية" : "منتهي"}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(p.userId, p.isPublished)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.isPublished ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-gray-500/10 text-gray-400 border border-gray-500/30"}`}
                        >
                          {p.isPublished ? "منشور ✓" : "معطل ✕"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExtend30Days(p.userId, p.username)}
                            className="text-[10px] h-7 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                          >
                            +30 يوم
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>}{/* end users tab */}
    </div>
  );
}
