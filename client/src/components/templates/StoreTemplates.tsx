import React, { useState } from "react";
import { UserProfile, StoreProduct, StoreOrder } from "@shared/saas-schema";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Check, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Loader2, 
  X, 
  Sparkles,
  Share2,
  Copy,
  Store,
  MessageCircle,
  Clock,
  ArrowRight
} from "lucide-react";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { ALGERIA_WILAYAS } from "@/lib/algeria-wilayas";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

// Demo products for preview if user hasn't added products yet
const DEFAULT_DEMO_PRODUCTS: StoreProduct[] = [
  {
    id: "demo-p1",
    title: "سماعات Pro Wireless ANC",
    description: "عزل ضوضاء فائق، بطارية تدوم 40 ساعة وصوت نقي محيطي عالي الجودة.",
    priceDZD: 4800,
    originalPriceDZD: 6000,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "إلكترونيات",
  },
  {
    id: "demo-p2",
    title: "ساعة ذكية Ultra Titanium",
    description: "شاشة AMOLED، مقاومة للماء مع تتبع نبضات القلب والأنشطة الرياضية.",
    priceDZD: 7500,
    originalPriceDZD: 8900,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "إلكترونيات",
  },
  {
    id: "demo-p3",
    title: "عطر Imperial Black Edition",
    description: "رائحة ملكية تدوم طويلاً بمزيج العود والجلود واللافندر الفاخر.",
    priceDZD: 5200,
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "عطور",
  },
];

interface StoreTemplateProps {
  profile: UserProfile;
  variant?: "minimal" | "cyber" | "luxury";
}

export function StoreTemplateView({ profile, variant = "minimal" }: StoreTemplateProps) {
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWilaya, setCustomerWilaya] = useState(ALGERIA_WILAYAS[15].nameAr); // 16 - Algiers default
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<StoreOrder | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const products = (profile.products && profile.products.length > 0)
    ? profile.products
    : DEFAULT_DEMO_PRODUCTS;

  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  const handleOpenOrder = (prod: StoreProduct) => {
    setSelectedProduct(prod);
    setQuantity(1);
    setOrderSuccess(null);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("يرجى إدخال اسمك ورقم الهاتف للتوصيل");
      return;
    }

    try {
      setIsSubmitting(true);
      const total = selectedProduct.priceDZD * quantity;

      const newOrder: StoreOrder = {
        userId: profile.userId,
        username: profile.username,
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        productPriceDZD: selectedProduct.priceDZD,
        productImageUrl: selectedProduct.imageUrl,
        quantity: quantity,
        totalPriceDZD: total,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerWilaya: customerWilaya,
        customerAddress: customerAddress.trim(),
        customerNotes: customerNotes.trim(),
        status: "pending",
        createdAt: Timestamp.now(),
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      const savedOrder = { ...newOrder, id: docRef.id };
      setOrderSuccess(savedOrder);
      toast.success("تم تسجيل طلبك بنجاح!");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة ثانية");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppMessageUrl = (order: StoreOrder) => {
    const sellerPhone = profile.whatsapp || profile.phone || "213550000000";
    const cleanPhone = sellerPhone.replace(/[^0-9]/g, "");
    const msg = encodeURIComponent(
      `مرحباً! قمت بطلب المنتج من موقعك الشخصي:
📦 المنتج: ${order.productTitle}
🔢 الكمية: ${order.quantity}
💰 الإجمالي: ${order.totalPriceDZD} دج
👤 الاسم: ${order.customerName}
📞 الهاتف: ${order.customerPhone}
📍 الولاية: ${order.customerWilaya}
🏠 العنوان: ${order.customerAddress || "غير محدد"}
يرجى تأكيد الإرسال والتوصيل شكراً!`
    );
    return `https://wa.me/${cleanPhone}?text=${msg}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("تم نسخ رابط المتجر!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Variant Styles
  const isCyber = variant === "cyber";
  const isLuxury = variant === "luxury";

  const themeBg = isCyber 
    ? "bg-[#060810] text-[#00f0ff]" 
    : isLuxury 
    ? "bg-[#070709] text-[#f59e0b]" 
    : "bg-[#090b10] text-white";

  const accentColor = isCyber 
    ? "#00f0ff" 
    : isLuxury 
    ? "#f59e0b" 
    : "#06b6d4";

  return (
    <div className={`min-h-screen ${themeBg} flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-cyan-500/30 relative overflow-hidden`}>
      {/* Background Ambience */}
      {isCyber ? (
        <>
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />
          <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="fixed bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        </>
      ) : isLuxury ? (
        <>
          <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />
          <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />
        </>
      ) : (
        <>
          <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[550px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
        </>
      )}

      <div className="w-full max-w-2xl mx-auto pt-6 sm:pt-10 pb-16 flex-1">
        {/* Top Header & Share */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-6 px-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Store className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="font-bold text-gray-200 uppercase tracking-wider text-[11px]">
              {profile.storeSettings?.storeName || "متجر وبورتفوليو رسمي"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "تم النسخ" : "مشاركة"}</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center mb-8 relative">
          <div className="relative mb-4 group">
            <div 
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden p-1 bg-gradient-to-b from-white/20 to-transparent shadow-2xl transition-transform duration-500 group-hover:scale-105"
              style={{ border: `2px solid ${accentColor}40` }}
            >
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-[20px]"
              />
            </div>
            <div 
              className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-black shadow-lg flex items-center gap-1"
              style={{ backgroundColor: accentColor }}
            >
              <ShoppingBag className="w-3 h-3" />
              <span>Store</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight mb-1 text-white">
            {profile.fullName}
          </h1>

          <p className="text-xs sm:text-sm font-medium mb-3" style={{ color: accentColor }}>
            {profile.jobTitle || "متجر إلكتروني معتمد"}
          </p>

          {profile.bio && (
            <p className="text-xs sm:text-sm text-gray-300 max-w-md font-light leading-relaxed mb-4">
              {profile.bio}
            </p>
          )}

          {/* Location & Delivery Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-300 mb-5">
            <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px]">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{profile.storeSettings?.deliveryNotice || "التوصيل متوفر لـ 58 ولاية 📦"}</span>
            </span>
            <span className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>الدفع عند الاستلام 💵</span>
            </span>
          </div>

          {/* Social Links Row */}
          {activeLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {activeLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-md"
                  title={link.title}
                >
                  <PlatformIcon platform={link.platform} className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* ================= PRODUCTS SHOWCASE GRID ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" style={{ color: accentColor }} />
              <span>المنتجات المتاحة للطلب ({products.length})</span>
            </h2>
            <span className="text-xs text-gray-400">طلب سريع في ثوانٍ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((prod) => (
              <motion.div
                key={prod.id}
                whileHover={{ y: -4 }}
                className={`rounded-2xl overflow-hidden border backdrop-blur-xl transition-all flex flex-col justify-between group ${
                  isCyber 
                    ? "bg-[#0b0f19]/80 border-cyan-500/30 hover:border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                    : isLuxury 
                    ? "bg-[#101014]/80 border-amber-500/30 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                    : "bg-white/[0.04] border-white/10 hover:border-cyan-500/40"
                }`}
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      {prod.inStock ? (
                        <Badge className="bg-emerald-500/90 text-black font-extrabold text-[10px] border-none shadow-md">
                          متوفر في المخزون
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/90 text-white font-bold text-[10px] border-none">
                          نفذت الكمية
                        </Badge>
                      )}
                    </div>

                    {prod.category && (
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] text-gray-300 border border-white/10 font-medium">
                          {prod.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-base text-white mb-1 group-hover:text-cyan-300 transition-colors">
                      {prod.title}
                    </h3>

                    {prod.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3 font-light">
                        {prod.description}
                      </p>
                    )}

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-xl font-extrabold font-mono" style={{ color: accentColor }}>
                        {prod.priceDZD.toLocaleString()} دج
                      </span>
                      {prod.originalPriceDZD && prod.originalPriceDZD > prod.priceDZD && (
                        <span className="text-xs text-gray-500 line-through font-mono">
                          {prod.originalPriceDZD.toLocaleString()} دج
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    disabled={!prod.inStock}
                    onClick={() => handleOpenOrder(prod)}
                    className="w-full text-xs font-bold uppercase tracking-wider h-10 rounded-xl gap-1.5 shadow-lg"
                    style={{
                      backgroundColor: accentColor,
                      color: "#000000",
                    }}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{prod.inStock ? "اطلب الآن (Order Now)" : "نفذت الكمية"}</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer brand link */}
        <div className="text-center mt-12 pt-6 border-t border-white/5">
          <a
            href="https://www.novawebdv.com/profiles"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-gray-400 hover:text-cyan-400 font-ui font-semibold transition-colors inline-flex items-center gap-1.5"
          >
            <span>make your store profile with novaweb</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* ================= FAST CHECKOUT MODAL ================= */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-lg bg-[#0b0e17] border border-white/10 text-white rounded-3xl p-6 overflow-hidden">
          {selectedProduct && (
            <div>
              {orderSuccess ? (
                /* Success Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">تم تأكيد وتسجيل طلبك بنجاح!</h3>
                    <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
                      شكراً لك <span className="font-bold text-white">{orderSuccess.customerName}</span>. سيتصل بك البائع قريباً لتأكيد تفاصيل الإرسال إلى ولاية <span className="font-bold text-cyan-300">{orderSuccess.customerWilaya}</span>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-right space-y-1.5">
                    <div className="flex justify-between text-gray-300">
                      <span>المنتج:</span>
                      <span className="font-bold text-white">{orderSuccess.productTitle}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>الكمية:</span>
                      <span className="font-bold text-white">{orderSuccess.quantity}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>السعر الإجمالي:</span>
                      <span className="font-black text-emerald-400 text-sm font-mono">{orderSuccess.totalPriceDZD.toLocaleString()} دج</span>
                    </div>
                  </div>

                  {/* Direct WhatsApp Confirmation Button */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={getWhatsAppMessageUrl(orderSuccess)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-xs h-11 rounded-xl shadow-lg transition-transform active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>تأكيد مباشر عبر واتساب البائع 📲</span>
                    </a>

                    <Button
                      variant="outline"
                      onClick={() => setSelectedProduct(null)}
                      className="w-full border-white/10 text-xs h-10 rounded-xl text-gray-300"
                    >
                      إغلاق
                    </Button>
                  </div>
                </div>
              ) : (
                /* Order Form */
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-cyan-400" />
                      <span>إتمام طلب الشراء</span>
                    </DialogTitle>
                    <DialogDescription className="text-xs text-gray-400">
                      املأ معلوماتك وسيقوم البائع بالاتصال بك لتأكيد الشحن فوراً. الدفع عند الاستلام.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Product Mini Preview */}
                  <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.title}
                      className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">{selectedProduct.title}</h4>
                      <div className="text-sm font-black text-cyan-400 font-mono mt-0.5">
                        {selectedProduct.priceDZD.toLocaleString()} دج
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs font-mono">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Information Inputs */}
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">الاسم واللقب *</Label>
                      <Input
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="مثال: كريم بن علي"
                        className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">رقم الهاتف للتوصيل *</Label>
                      <Input
                        required
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="06XXXXXXXX / 07XXXXXXXX"
                        className="bg-black/50 border-white/10 text-xs h-9 rounded-xl font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-300">الولاية *</Label>
                        <select
                          value={customerWilaya}
                          onChange={(e) => setCustomerWilaya(e.target.value)}
                          className="w-full bg-[#0a0d16] border border-white/10 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 h-9"
                        >
                          {ALGERIA_WILAYAS.map((w) => (
                            <option key={w.code} value={w.nameAr}>
                              {w.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-gray-300">البلدية / العنوان بالتفصيل</Label>
                        <Input
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="البلدية والحي"
                          className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">ملاحظات إضافية (اختياري)</Label>
                      <Input
                        value={customerNotes}
                        onChange={(e) => setCustomerNotes(e.target.value)}
                        placeholder="مثال: الاتصال بعد الظهر، اللون المفضل..."
                        className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Total calculation banner */}
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                    <span className="text-xs text-gray-300 font-bold">المجموع الكلي:</span>
                    <span className="text-base font-black text-cyan-300 font-mono">
                      {(selectedProduct.priceDZD * quantity).toLocaleString()} دج
                    </span>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold uppercase tracking-wider text-xs h-11 rounded-xl shadow-lg gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>تأكيد طلب الشراء الآن 📦</span>
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
