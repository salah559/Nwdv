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
  AlertCircle
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
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile, UserSubscription, PaymentRecord } from "@shared/saas-schema";
import { TEMPLATES } from "@/lib/templates-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function SaasAdminTab() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, UserSubscription>>({});
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
        // Extend subscription by 30 days
        const now = new Date();
        const currentEnd = subscriptions[payment.userId]?.currentPeriodEnd?.toDate?.() || now;
        const baseDate = currentEnd > now ? currentEnd : now;
        const newEnd = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);

        await setDoc(doc(db, "subscriptions", payment.userId), {
          status: "active",
          planId: "basic",
          currentPeriodEnd: Timestamp.fromDate(newEnd),
          updatedAt: Timestamp.now(),
        }, { merge: true });

        toast.success(`تم تأكيد الاشتراك للمستخدم @${payment.username} لمدة 30 يوماً!`);
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
    <div className="space-y-8">
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
            <p className="text-[11px] text-amber-400 mt-1">BaridiMob / CCP</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments Section */}
      <Card className="glass border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-base text-amber-300 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span>طلبات الدفع اليدوي الواردة ({pendingPayments.length})</span>
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
                        {pay.type === "subscription" ? "اشتراك شهري (500 دج)" : `شراء قالب (${pay.targetId})`}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                      البريد: <span className="font-mono text-cyan-400">{pay.userEmail}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 font-mono">
                      رقم العملية / الحوالة: <span className="text-white font-bold">{pay.transactionReference || "غير محدد"}</span>
                    </div>
                    {pay.receiptUrl && (
                      <a href={pay.receiptUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-1">
                        <span>عرض صورة الوصل المرفقة</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
    </div>
  );
}
