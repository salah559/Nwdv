import React, { useState, useMemo } from "react";
import { UserProfile, StoreProduct, StoreOrder, StoreOrderItem } from "@shared/saas-schema";
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
  ArrowRight,
  Search,
  Filter,
  Flame,
  Leaf,
  Layers,
  Award,
  ShoppingCart,
  Trash2,
  Zap
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
    category: "ساعات",
  },
  {
    id: "demo-p3",
    title: "عطر Imperial Black Edition",
    description: "رائحة ملكية تدوم طويلاً بمزيج العود والجلود واللافندر الفاخر.",
    priceDZD: 5200,
    originalPriceDZD: 6500,
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "عطور",
  },
  {
    id: "demo-p4",
    title: "حذاء رياضي Streetwear Limited",
    description: "تصميم جريء ومريح للارتداء اليومي مع وسادة هوائية ونعل مرن.",
    priceDZD: 6800,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "أزياء",
  },
];

export type StoreVariant = "minimal" | "cyber" | "luxury" | "organic" | "streetwear" | "catalog";

interface StoreTemplateProps {
  profile: UserProfile;
  variant?: StoreVariant;
}

interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export function StoreTemplateView({ profile, variant = "minimal" }: StoreTemplateProps) {
  // Shopify-like Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Single Item Instant Checkout Modal State
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [singleQty, setSingleQty] = useState<number>(1);

  // Checkout Customer Details (shared for single item and full cart)
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWilaya, setCustomerWilaya] = useState(ALGERIA_WILAYAS[15].nameAr); // 16 - Algiers default
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<StoreOrder | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // In-store filter & search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const settings = profile.storeSettings || {};
  const storeTitle = settings.storeName || profile.fullName;
  const storeNotice = settings.deliveryNotice || "🚚 توصيل متوفر لجميع الولايات الـ 58 والدفع عند الاستلام (COD)";
  const sellerWhatsapp = settings.whatsappForOrders || profile.whatsapp || profile.phone || "213550000000";

  const rawProducts = (profile.products && profile.products.length > 0)
    ? profile.products
    : DEFAULT_DEMO_PRODUCTS;

  // Extract categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    rawProducts.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ["all", ...Array.from(set)];
  }, [rawProducts]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((p) => {
      const matchSearch = !searchQuery.trim() || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [rawProducts, searchQuery, selectedCategory]);

  const activeLinks = profile.socialLinks?.filter((l) => l.enabled) || [];

  // Cart Calculations
  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartTotalDZD = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.priceDZD * item.quantity, 0);
  }, [cart]);

  // Add to Cart
  const handleAddToCart = (product: StoreProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast.success(`تمت إضافة "${product.title}" إلى السلة 🛒`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    toast.info("تمت إزالة المنتج من السلة");
  };

  // Open single product quick modal
  const handleOpenQuickOrder = (prod: StoreProduct) => {
    setSelectedProduct(prod);
    setSingleQty(1);
    setOrderSuccess(null);
  };

  // Submit Order (Universal for both single product and multi-item cart)
  const handleOrderSubmit = async (isCartCheckout: boolean) => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("يرجى إدخال اسمك ورقم الهاتف للتوصيل");
      return;
    }

    const targetUserId = profile.userId || profile.id || "user";
    const targetUsername = profile.username || "";

    let itemsPayload: StoreOrderItem[] = [];
    let grandTotal = 0;
    let mainProductTitle = "";

    if (isCartCheckout) {
      if (cart.length === 0) return;
      itemsPayload = cart.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        priceDZD: item.product.priceDZD,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl || "",
      }));
      grandTotal = cartTotalDZD;
      mainProductTitle = cart.map((i) => `${i.product.title} (×${i.quantity})`).join(" + ");
    } else {
      if (!selectedProduct) return;
      grandTotal = Number(selectedProduct.priceDZD || 0) * singleQty;
      mainProductTitle = selectedProduct.title;
      itemsPayload = [{
        productId: selectedProduct.id,
        title: selectedProduct.title,
        priceDZD: selectedProduct.priceDZD,
        quantity: singleQty,
        imageUrl: selectedProduct.imageUrl || "",
      }];
    }

    try {
      setIsSubmitting(true);

      const newOrder: StoreOrder = {
        userId: targetUserId,
        username: targetUsername,
        productId: itemsPayload[0]?.productId || "prod",
        productTitle: mainProductTitle,
        productPriceDZD: itemsPayload[0]?.priceDZD || grandTotal,
        productImageUrl: itemsPayload[0]?.imageUrl || "",
        quantity: isCartCheckout ? cartItemCount : singleQty,
        items: itemsPayload,
        totalPriceDZD: grandTotal,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerWilaya: String(customerWilaya || "16 - الجزائر"),
        customerAddress: String(customerAddress || "").trim(),
        customerNotes: String(customerNotes || "").trim(),
        status: "pending",
        createdAt: Timestamp.now(),
      };

      // 1. Save to global Firestore "orders" collection
      const docRef = await addDoc(collection(db, "orders"), newOrder);
      const savedOrder = { ...newOrder, id: docRef.id };

      // 2. Also persist in localStorage
      try {
        const existingLocal = JSON.parse(localStorage.getItem(`orders_${targetUserId}`) || "[]");
        existingLocal.unshift({ ...savedOrder, createdAt: new Date().toISOString() });
        localStorage.setItem(`orders_${targetUserId}`, JSON.stringify(existingLocal.slice(0, 50)));
      } catch (storageErr) {
        // Ignore storage quotas
      }

      setOrderSuccess(savedOrder);
      if (isCartCheckout) {
        setCart([]);
      }
      toast.success("تم تسجيل طلبك بنجاح! 🎉");
    } catch (err: any) {
      console.error("Order submit error:", err);
      // Fallback
      const fallbackOrder: StoreOrder = {
        userId: targetUserId,
        username: targetUsername,
        productId: itemsPayload[0]?.productId || "prod",
        productTitle: mainProductTitle,
        productPriceDZD: grandTotal,
        quantity: isCartCheckout ? cartItemCount : singleQty,
        items: itemsPayload,
        totalPriceDZD: grandTotal,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerWilaya: customerWilaya,
        customerAddress: customerAddress.trim(),
        customerNotes: customerNotes.trim(),
        status: "pending",
        createdAt: new Date(),
        id: "offline-" + Date.now().toString().slice(-5),
      };
      setOrderSuccess(fallbackOrder);
      if (isCartCheckout) setCart([]);
      toast.info("تم تجهيز الطلب! اضغط لتأكيده مع البائع عبر واتساب مباشرة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppMessageUrl = (order: StoreOrder) => {
    const cleanPhone = sellerWhatsapp.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("0") ? cleanPhone.slice(1) : cleanPhone;
    const finalPhone = formattedPhone.startsWith("213") ? formattedPhone : `213${formattedPhone}`;

    const itemsText = order.items && order.items.length > 0
      ? order.items.map((i) => `• ${i.title} × ${i.quantity} = ${i.priceDZD * i.quantity} دج`).join("\n")
      : `• ${order.productTitle} × ${order.quantity}`;

    const msg = encodeURIComponent(
      `مرحباً! قمت بطلب مشتريات من متجرك الإلكتروني (${storeTitle}):
📦 المنتجات المطلوبة:
${itemsText}

💰 المبلغ الإجمالي: ${order.totalPriceDZD} دج
👤 الاسم: ${order.customerName}
📞 الهاتف: ${order.customerPhone}
📍 الولاية: ${order.customerWilaya}
🏠 العنوان بالتفصيل: ${order.customerAddress || "غير محدد"}
${order.customerNotes ? `📝 ملاحظة: ${order.customerNotes}\n` : ""}
يرجى تأكيد استلام الطلب وتفاصيل الشحن شكراً!`
    );
    return `https://wa.me/${finalPhone}?text=${msg}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("تم نسخ رابط المتجر!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Variant Specific Theming
  const theme = useMemo(() => {
    switch (variant) {
      case "cyber":
        return {
          bg: "bg-[#060810] text-[#00f0ff]",
          card: "bg-[#0a0f1d]/80 border-[#00f0ff]/30 hover:border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]",
          badge: "bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/40",
          accentBtn: "bg-[#00f0ff] hover:bg-[#38f8ff] text-black font-extrabold shadow-[0_0_20px_rgba(0,240,255,0.4)]",
          accentText: "text-[#00f0ff]",
          tagline: "CYBER TECH & GADGETS HUD",
        };
      case "luxury":
        return {
          bg: "bg-[#080808] text-[#f7e0a3]",
          card: "bg-gradient-to-b from-[#14120e] to-[#0a0907] border-[#d4af37]/40 hover:border-[#f3e5ab] shadow-[0_4px_25px_rgba(212,175,55,0.15)]",
          badge: "bg-[#d4af37]/20 text-[#f7e0a3] border-[#d4af37]/50",
          accentBtn: "bg-gradient-to-r from-[#d4af37] via-[#f7e0a3] to-[#aa771c] hover:opacity-95 text-black font-bold shadow-[0_0_25px_rgba(212,175,55,0.3)]",
          accentText: "text-[#d4af37]",
          tagline: "HAUTE LUXURY & VIP ATELIER",
        };
      case "organic":
        return {
          bg: "bg-[#0a130f] text-[#a7f3d0]",
          card: "bg-[#0f1f18]/80 border-emerald-500/30 hover:border-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.15)]",
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          accentBtn: "bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)]",
          accentText: "text-emerald-400",
          tagline: "ORGANIC, HEALTH & BIO WELLNESS",
        };
      case "streetwear":
        return {
          bg: "bg-[#0b0c10] text-[#ff4655]",
          card: "bg-[#13151b] border-[#ff4655]/40 hover:border-[#ff4655] shadow-[0_0_20px_rgba(255,70,85,0.2)]",
          badge: "bg-[#ff4655]/20 text-[#ff4655] border-[#ff4655]/50",
          accentBtn: "bg-[#ff4655] hover:bg-[#ff5d6a] text-white font-black uppercase tracking-wider shadow-[0_0_25px_rgba(255,70,85,0.4)]",
          accentText: "text-[#ff4655]",
          tagline: "STREETWEAR & SNEAKER DROP",
        };
      case "catalog":
        return {
          bg: "bg-[#090b10] text-[#38bdf8]",
          card: "bg-white/[0.03] border-white/10 hover:border-sky-400/50 shadow-lg",
          badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
          accentBtn: "bg-sky-400 hover:bg-sky-300 text-black font-bold shadow-[0_0_20px_rgba(56,189,248,0.3)]",
          accentText: "text-sky-400",
          tagline: "WHOLESALE & FAST CATALOG",
        };
      case "minimal":
      default:
        return {
          bg: "bg-[#090b11] text-gray-100",
          card: "bg-white/[0.03] border-white/10 hover:border-white/25 shadow-xl",
          badge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
          accentBtn: "bg-cyan-400 hover:bg-cyan-300 text-black font-bold shadow-[0_0_20px_rgba(6,255,240,0.3)]",
          accentText: "text-cyan-400",
          tagline: "MINIMAL BOUTIQUE & STORE",
        };
    }
  }, [variant]);

  return (
    <div className={`min-h-screen ${theme.bg} selection:bg-cyan-500/30 pb-28`} dir="rtl">
      {/* Top Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-black/80 via-white/5 to-black/80 border-b border-white/10 py-2.5 px-4 text-center text-xs backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 shrink-0 text-cyan-400 animate-pulse" />
            <span>{storeNotice}</span>
          </div>
          {/* Header Cart Toggle Button */}
          <button
            onClick={() => {
              setOrderSuccess(null);
              setIsCartOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
            <span>السلة</span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black font-mono text-[11px] flex items-center justify-center font-black">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Store Header Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
              {/* Avatar / Brand Logo */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-white/20 p-1 bg-black/60 shadow-2xl shrink-0">
                <img
                  src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"}
                  alt={storeTitle}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 flex-wrap">
                  <Badge variant="outline" className={`${theme.badge} text-[10px] font-mono uppercase tracking-wider`}>
                    {theme.tagline}
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    متجر موثق
                  </Badge>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  {storeTitle}
                </h1>

                {profile.bio && (
                  <p className="text-xs text-gray-300 mt-2 max-w-xl leading-relaxed">
                    {profile.bio}
                  </p>
                )}

                {/* Seller Quick Contact Info */}
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{profile.location || "الجزائر (58 ولاية)"}</span>
                  </span>
                  {profile.phone && (
                    <a href={`tel:${profile.phone}`} className="flex items-center gap-1.5 hover:text-white dir-ltr font-mono">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{profile.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Share / Social Buttons */}
            <div className="flex sm:flex-col items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="border-white/10 hover:border-white/30 text-xs gap-1.5 rounded-xl h-9 px-3.5 bg-black/40"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "تم النسخ" : "مشاركة المتجر"}</span>
              </Button>

              <a
                href={`https://wa.me/${sellerWhatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button
                  size="sm"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs gap-1.5 rounded-xl h-9 shadow-md"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-black" />
                  <span>تواصل عبر واتساب</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Social Links if any */}
          {activeLinks.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              {activeLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
                >
                  <PlatformIcon platform={link.platform} className="w-3.5 h-3.5" />
                  <span>{link.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* In-Store Search & Categories Filter */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 mb-6 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج بالاسم أو المواصفات..."
              className="bg-black/50 border-white/10 pr-10 text-xs h-10 rounded-xl text-white placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                مسح
              </button>
            )}
          </div>

          {categories.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] text-gray-400 font-bold ml-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                <span>التصنيفات:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                    selectedCategory === cat
                      ? `${theme.accentBtn}`
                      : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {cat === "all" ? "جميع المنتجات" : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white/[0.02] border border-white/10 rounded-3xl">
            <ShoppingBag className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-40" />
            <h4 className="text-base font-bold text-white mb-1">لا توجد منتجات مطابقة</h4>
            <p className="text-xs text-gray-400 mb-4">جرب البحث بكلمات أخرى أو اختر تصنيفاً آخر</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="text-xs border-white/10"
            >
              إظهار جميع المنتجات
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className={`p-4 rounded-3xl transition-all duration-300 flex flex-col justify-between group border ${theme.card}`}
              >
                <div>
                  {/* Product Image */}
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-black/60 mb-3.5 border border-white/5">
                    <img
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Stock & Discount Badges */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                      <Badge
                        className={`text-[10px] font-bold border-none ${
                          prod.inStock
                            ? "bg-emerald-500 text-black shadow-md"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {prod.inStock ? "متوفر بالمخزون" : "نفذت الكمية"}
                      </Badge>

                      {prod.originalPriceDZD && prod.originalPriceDZD > prod.priceDZD && (
                        <Badge className="bg-red-600 text-white text-[10px] font-bold shadow-md">
                          خصم {Math.round((1 - prod.priceDZD / prod.originalPriceDZD) * 100)}%
                        </Badge>
                      )}
                    </div>

                    {prod.category && (
                      <div className="absolute bottom-2.5 left-2.5">
                        <Badge className="bg-black/80 text-white border border-white/10 text-[10px]">
                          {prod.category}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-white mb-1.5 line-clamp-1">
                    {prod.title}
                  </h3>
                  {prod.description && (
                    <p className="text-xs text-gray-300/80 line-clamp-2 leading-relaxed mb-3">
                      {prod.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className={`text-xl font-black font-mono ${theme.accentText}`}>
                      {prod.priceDZD.toLocaleString()} دج
                    </span>
                    {prod.originalPriceDZD && prod.originalPriceDZD > prod.priceDZD && (
                      <span className="text-xs text-gray-500 line-through font-mono">
                        {prod.originalPriceDZD.toLocaleString()} دج
                      </span>
                    )}
                  </div>
                </div>

                {/* Shopify-style Dual Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddToCart(prod)}
                    disabled={!prod.inStock}
                    className="border-white/10 hover:border-cyan-400 text-xs h-9 rounded-xl font-bold gap-1 bg-white/5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                    <span>أضف للسلة</span>
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => handleOpenQuickOrder(prod)}
                    disabled={!prod.inStock}
                    className={`text-xs h-9 rounded-xl font-bold gap-1 ${
                      prod.inStock ? theme.accentBtn : "bg-white/10 text-gray-400"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>شراء فوري</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust & Guarantee Badges Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10 text-center">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <Truck className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
            <h5 className="text-xs font-bold text-white">توصيل سريع لـ 58 ولاية</h5>
            <p className="text-[11px] text-gray-400">توصيل إلى باب المنزل أو المكتب</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <h5 className="text-xs font-bold text-white">الدفع عند الاستلام (COD)</h5>
            <p className="text-[11px] text-gray-400">عاين منتجك وتأكد منه قبل الدفع</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
            <Award className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <h5 className="text-xs font-bold text-white">ضمان الجودة والأصلية</h5>
            <p className="text-[11px] text-gray-400">منتجات مضمونة مع إمكانية التبديل</p>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-12 text-center text-xs text-gray-400">
          <p>
            متجر إلكتروني مدعوم من{" "}
            <a
              href="https://www.novawebdv.com/profiles"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              Novaweb Profiles
            </a>
          </p>
        </div>
      </div>

      {/* SHOPIFY-STYLE FLOATING CART PILL (Appears whenever cart has items) */}
      <AnimatePresence>
        {cartItemCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md"
          >
            <div
              onClick={() => {
                setOrderSuccess(null);
                setIsCartOpen(true);
              }}
              className="p-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 text-black font-bold shadow-2xl shadow-cyan-500/30 flex items-center justify-between cursor-pointer border border-white/20 hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-cyan-300 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono font-black">
                    {cartItemCount}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black">سلة التسوق ({cartItemCount} منتجات)</div>
                  <div className="text-[11px] text-black/80 font-normal">اضغط لإتمام الطلب للشحن</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm">{cartTotalDZD.toLocaleString()} دج</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SHOPPING CART DRAWER / MODAL */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-lg bg-[#0a0d16] border border-white/15 text-white rounded-3xl p-6 max-h-[92vh] overflow-y-auto">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              <span>سلة التسوق ({cartItemCount} منتجات)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              راجع منتجاتك المختارة وأكمل بيانات التوصيل والدفع عند الاستلام
            </DialogDescription>
          </DialogHeader>

          {orderSuccess ? (
            /* ORDER SUCCESS SCREEN FOR CART */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">تم استلام طلبك بنجاح! 🎉</h3>
                <p className="text-xs text-gray-300 mt-1">
                  رقم الطلب الخاص بك: <strong className="text-cyan-400 font-mono">#{orderSuccess.id?.slice(-6).toUpperCase()}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-right space-y-2">
                <div className="space-y-1 border-b border-white/5 pb-2">
                  <div className="text-gray-400 text-[11px]">المنتجات المطلوبة:</div>
                  <div className="font-bold text-white leading-relaxed">{orderSuccess.productTitle}</div>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>الولاية والعنوان:</span>
                  <span className="font-bold text-white">{orderSuccess.customerWilaya} {orderSuccess.customerAddress ? `(${orderSuccess.customerAddress})` : ""}</span>
                </div>
                <div className="flex justify-between text-gray-300 border-t border-white/5 pt-2">
                  <span>المبلغ الإجمالي للدفع:</span>
                  <span className="text-cyan-400 font-black font-mono text-sm">{orderSuccess.totalPriceDZD.toLocaleString()} دج</span>
                </div>
              </div>

              {/* WhatsApp Forward Button */}
              <a
                href={getWhatsAppMessageUrl(orderSuccess)}
                target="_blank"
                rel="noreferrer"
                className="block w-full"
              >
                <Button className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs h-11 rounded-xl shadow-lg gap-2">
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>تأكيد الطلب الآن عبر واتساب البائع 📲</span>
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={() => setIsCartOpen(false)}
                className="w-full border-white/10 text-xs h-9 rounded-xl text-gray-300"
              >
                إغلاق والعودة للمتجر
              </Button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <ShoppingCart className="w-12 h-12 text-gray-600 mx-auto opacity-40" />
              <p className="text-xs text-gray-400">سلة التسوق فارغة حالياً</p>
              <Button
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="text-xs bg-cyan-400 text-black font-bold"
              >
                تصفح المنتجات وأضف للسلة
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-2.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.product.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80"}
                        alt={item.product.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate">{item.product.title}</div>
                        <div className="text-cyan-400 font-mono">{item.product.priceDZD} دج</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.product.id, -1)}
                          className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs font-mono">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.product.id, 1)}
                          className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal Calculation */}
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-300 font-bold">المجموع الفرعي ({cartItemCount} قطع):</span>
                <span className="text-cyan-400 font-black font-mono text-base">{cartTotalDZD.toLocaleString()} دج</span>
              </div>

              {/* Checkout Customer Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleOrderSubmit(true);
                }}
                className="space-y-3 pt-2 border-t border-white/10"
              >
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-400" />
                  <span>معلومات التوصيل (الدفع عند الاستلام)</span>
                </div>

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

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-300">الولاية *</Label>
                    <select
                      value={customerWilaya}
                      onChange={(e) => setCustomerWilaya(e.target.value)}
                      className="w-full bg-[#0d1220] border border-white/10 text-xs rounded-xl px-2.5 text-white h-9 focus:outline-none focus:border-cyan-400"
                    >
                      {ALGERIA_WILAYAS.map((w) => (
                        <option key={w.code} value={w.nameAr}>{w.nameAr}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-gray-300">البلدية / العنوان</Label>
                    <Input
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="البلدية والحي"
                      className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-300">ملاحظة إضافية (اختياري)</Label>
                  <Input
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="مثال: الاتصال بعد العصر"
                    className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs h-11 rounded-xl shadow-lg gap-2 mt-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>تأكيد طلب السلة الآن ({cartTotalDZD.toLocaleString()} دج) 📦</span>
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* SINGLE ITEM QUICK CHECKOUT MODAL */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-md bg-[#0a0d16] border border-white/15 text-white rounded-3xl p-6 max-h-[92vh] overflow-y-auto">
          {selectedProduct && (
            <div>
              <DialogHeader className="mb-4">
                <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
                  <ShoppingBag className="w-5 h-5 text-cyan-400" />
                  <span>تأكيد طلب الشراء الفوري</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-400">
                  املأ بياناتك وسيتم شحن الطلب فوراً إلى عنوانك والدفع عند الاستلام.
                </DialogDescription>
              </DialogHeader>

              {orderSuccess ? (
                /* ORDER CONFIRMED SCREEN */
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">تم استلام طلبك بنجاح! 🎉</h3>
                    <p className="text-xs text-gray-300 mt-1">
                      رقم الطلب الخاص بك: <strong className="text-cyan-400 font-mono">#{orderSuccess.id?.slice(-6).toUpperCase()}</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-right space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>المنتج:</span>
                      <span className="font-bold text-white">{orderSuccess.productTitle}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>الكمية:</span>
                      <span className="font-bold text-white">{orderSuccess.quantity}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>الولاية:</span>
                      <span className="font-bold text-white">{orderSuccess.customerWilaya}</span>
                    </div>
                    <div className="flex justify-between text-gray-300 border-t border-white/5 pt-2">
                      <span>المبلغ الإجمالي:</span>
                      <span className="text-cyan-400 font-black font-mono text-sm">{orderSuccess.totalPriceDZD.toLocaleString()} دج</span>
                    </div>
                  </div>

                  {/* WhatsApp Forward Button */}
                  <a
                    href={getWhatsAppMessageUrl(orderSuccess)}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs h-11 rounded-xl shadow-lg gap-2">
                      <MessageCircle className="w-4 h-4 fill-black" />
                      <span>تأكيد الطلب الآن عبر واتساب البائع 📲</span>
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedProduct(null)}
                    className="w-full border-white/10 text-xs h-9 rounded-xl text-gray-300"
                  >
                    إغلاق والعودة للمتجر
                  </Button>
                </div>
              ) : (
                /* ORDER FORM */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleOrderSubmit(false);
                  }}
                  className="space-y-4"
                >
                  {/* Selected Product Summary */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedProduct.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"}
                        alt={selectedProduct.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{selectedProduct.title}</h4>
                        <div className="text-cyan-400 font-mono font-bold text-xs">
                          {selectedProduct.priceDZD} دج
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10">
                      <button
                        type="button"
                        onClick={() => setSingleQty((q) => Math.max(1, q - 1))}
                        className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs font-mono">{singleQty}</span>
                      <button
                        type="button"
                        onClick={() => setSingleQty((q) => q + 1)}
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
                      <Label className="text-xs text-gray-300">رقم الهاتف للتوصيل والتأكيد *</Label>
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
                    <span className="text-xs text-gray-300 font-bold">المجموع الكلي للدفع:</span>
                    <span className="text-base font-black text-cyan-300 font-mono">
                      {(selectedProduct.priceDZD * singleQty).toLocaleString()} دج
                    </span>
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold uppercase tracking-wider text-xs h-11 rounded-xl shadow-lg gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      <span>تأكيد طلب الشراء الآن (الدفع عند الاستلام) 📦</span>
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
