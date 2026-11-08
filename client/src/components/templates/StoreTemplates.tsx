import React, { useState, useMemo, useEffect } from "react";
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
  Zap,
  PackageCheck,
  ChevronDown,
  Gift,
  HelpCircle,
  Eye,
  CheckCircle,
  Headphones,
  RotateCcw
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
    title: "سماعات Pro Wireless ANC عازلة للضوضاء",
    description: "صوت نقي محيطي، بطارية تدوم 40 ساعة متواصلة مع خاصية الشحن فائق السرعة والميكروفون المزدوج للمكالمات الواضحة.",
    priceDZD: 4800,
    originalPriceDZD: 6000,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "إلكترونيات",
  },
  {
    id: "demo-p2",
    title: "ساعة ذكية Ultra Titanium رياضية",
    description: "شاشة AMOLED شديدة الوضوح، قياس نبضات القلب والأكسجين ومقاومة تامة للماء والغبار مع هيكل تيتانيوم متين.",
    priceDZD: 7500,
    originalPriceDZD: 8900,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "ساعات",
  },
  {
    id: "demo-p3",
    title: "عطر Imperial Black Edition فاخر",
    description: "ثبات عالي يدوم لأكثر من 48 ساعة برائحة العود الملكي والعنبر الفاخر مع زجاجة كريستال فاخرة مناسبة للهدايا.",
    priceDZD: 5200,
    originalPriceDZD: 6500,
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "عطور",
  },
  {
    id: "demo-p4",
    title: "حذاء رياضي Streetwear Limited إصدار خاص",
    description: "تصميم عصري فائق الخفة مناسب للجري والارتداء اليومي مع نعل طبي هوائي مريح جداً للقدمين.",
    priceDZD: 6800,
    originalPriceDZD: 8200,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    inStock: true,
    category: "أحذية",
  },
];

export type StoreVariant = "minimal" | "cyber" | "luxury" | "organic" | "streetwear" | "catalog";

interface StoreTemplateProps {
  profile: UserProfile;
  variant?: StoreVariant;
  activeStudioPage?: string;
  onPageChange?: (page: string) => void;
}

interface CartItem {
  product: StoreProduct;
  quantity: number;
}

export function StoreTemplateView({ 
  profile, 
  variant = "minimal",
  activeStudioPage,
  onPageChange
}: StoreTemplateProps) {
  // Multi-Page Navigation State
  const [internalPage, setInternalPage] = useState<string>("home");
  const currentPage = activeStudioPage || internalPage;
  const navigateToPage = (pageId: string) => {
    setInternalPage(pageId);
    if (onPageChange) onPageChange(pageId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Shopping Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Single Product Dedicated View / Landing Page Modal State
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [singleQty, setSingleQty] = useState<number>(1);

  // Customer Checkout Details
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWilaya, setCustomerWilaya] = useState(ALGERIA_WILAYAS[15].nameAr); // 16 - Algiers default
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<StoreOrder | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedProductLink, setCopiedProductLink] = useState(false);

  // Active FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // In-store filter & search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const settings = profile.storeSettings || {};
  const storeTitle = settings.storeName || profile.fullName || "متجري الإلكتروني";
  const storeNotice = settings.announcementText || settings.deliveryNotice || "🚚 توصيل متوفر لجميع ولايات الوطن (58 ولاية) - الدفع عند الاستلام";
  const sellerWhatsapp = settings.whatsappForOrders || profile.whatsapp || profile.phone || "213550000000";
  const shippingCost = settings.defaultShippingCostDZD !== undefined ? settings.defaultShippingCostDZD : 0;
  const showTrustBadges = settings.showTrustBadges !== false;
  const showDirectWhatsappBtn = settings.showDirectWhatsappBtn !== false;
  const showStockCounter = settings.showStockCounter !== false;

  const rawProducts = (profile.products && profile.products.length > 0)
    ? profile.products
    : DEFAULT_DEMO_PRODUCTS;

  // Check URL query parameters or path for direct product deep link (e.g. ?product=demo-p1 or /product/demo-p1)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let prodId = urlParams.get("product");
      if (!prodId) {
        const pathMatch = window.location.pathname.match(/\/product\/([^/?#]+)/);
        if (pathMatch) prodId = pathMatch[1];
      }
      if (prodId) {
        const target = rawProducts.find((p) => p.id === prodId);
        if (target) {
          setSelectedProduct(target);
          setSingleQty(1);
        }
      }
    } catch (e) {
      // Ignore
    }
  }, [rawProducts]);

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

  const cartSubtotalDZD = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.priceDZD * item.quantity, 0);
  }, [cart]);

  const cartTotalDZD = cartSubtotalDZD + (cartItemCount > 0 ? shippingCost : 0);

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
    toast.success(`تمت إضافة "${product.title}" إلى السلة 🛍️`);
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
    toast.info("تم حذف المنتج من السلة");
  };

  // Open single product dedicated landing modal and update URL
  const handleOpenProduct = (prod: StoreProduct) => {
    setSelectedProduct(prod);
    setSingleQty(1);
    setOrderSuccess(null);
    try {
      const newUrl = `${window.location.pathname}?product=${prod.id}`;
      window.history.pushState({ productId: prod.id }, "", newUrl);
    } catch (e) {
      // Ignore
    }
  };

  // Close product modal and clean URL
  const handleCloseProduct = () => {
    setSelectedProduct(null);
    setOrderSuccess(null);
    try {
      window.history.pushState({}, "", window.location.pathname);
    } catch (e) {
      // Ignore
    }
  };

  // Direct 1-Click WhatsApp Order for a single product
  const handleDirectWhatsAppOrder = (prod: StoreProduct) => {
    const cleanPhone = sellerWhatsapp.replace(/[^0-9]/g, "");
    const prodUrl = `${window.location.origin}/p/${profile.username}?product=${prod.id}`;
    const message = `مرحباً، أود طلب هذا المنتج من متجرك:\n\n📦 المنتج: ${prod.title}\n💰 السعر: ${prod.priceDZD.toLocaleString()} دج\n🔗 الرابط: ${prodUrl}\n\nيرجى تأكيد توفر المنتج وطريقة التوصيل. شكراً!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Copy Direct Product Link for seller or customer sharing
  const handleCopyProductLink = (prod: StoreProduct) => {
    const prodUrl = `${window.location.origin}/p/${profile.username}?product=${prod.id}`;
    navigator.clipboard.writeText(prodUrl);
    setCopiedProductLink(true);
    toast.success("تم نسخ رابط المنتج المباشر! يمكنك الآن نشره في إعلاناتك 🔗");
    setTimeout(() => setCopiedProductLink(false), 2500);
  };

  // Copy Store Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href.split("?")[0]);
    setCopiedLink(true);
    toast.success("تم نسخ رابط المتجر!");
    setTimeout(() => setCopiedLink(false), 2000);
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
      const sub = Number(selectedProduct.priceDZD || 0) * singleQty;
      grandTotal = sub + shippingCost;
      mainProductTitle = selectedProduct.title;
      itemsPayload = [{
        productId: selectedProduct.id,
        title: selectedProduct.title,
        priceDZD: selectedProduct.priceDZD,
        quantity: singleQty,
        imageUrl: selectedProduct.imageUrl || "",
      }];
    }

    setIsSubmitting(true);

    try {
      const newOrder: any = {
        userId: targetUserId,
        username: targetUsername,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerWilaya: customerWilaya.trim(),
        customerAddress: customerAddress.trim() || "غير محدد",
        customerNotes: customerNotes.trim() || "بدون ملاحظات",
        productTitle: mainProductTitle,
        quantity: isCartCheckout ? cartItemCount : singleQty,
        totalPriceDZD: grandTotal,
        status: "pending",
        createdAt: Timestamp.now(),
        items: itemsPayload,
      };

      if (!isCartCheckout && selectedProduct) {
        newOrder.productId = selectedProduct.id;
        newOrder.productPriceDZD = Number(selectedProduct.priceDZD || 0);
      }

      const docRef = await addDoc(collection(db, "orders"), newOrder);
      const createdOrder: StoreOrder = { ...newOrder, id: docRef.id };

      // Local storage backup
      try {
        const localKey = `orders_${targetUserId}`;
        const prev = JSON.parse(localStorage.getItem(localKey) || "[]");
        localStorage.setItem(localKey, JSON.stringify([createdOrder, ...prev]));
      } catch (e) {
        // Ignore
      }

      setOrderSuccess(createdOrder);

      if (isCartCheckout) {
        setCart([]);
      }

      toast.success("تم إرسال طلبك بنجاح! سيتصل بك فريق المتجر لتأكيد الشحن 🚚");
    } catch (err: any) {
      console.error("Order submit error:", err);
      toast.error("حدث خطأ أثناء إرسال الطلب: " + (err.message || "يرجى المحاولة مجدداً"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // WhatsApp message forward generator
  const getWhatsAppMessageUrl = (order: StoreOrder) => {
    const cleanPhone = sellerWhatsapp.replace(/[^0-9]/g, "");
    const text = `السلام عليكم، لقد قمت بطلب جديد من متجرك!\n\n📋 رقم الطلب: #${order.id?.slice(-6).toUpperCase()}\n👤 الاسم: ${order.customerName}\n📱 الهاتف: ${order.customerPhone}\n📍 الولاية: ${order.customerWilaya}\n🏠 العنوان: ${order.customerAddress || "غير محدد"}\n📦 المنتجات: ${order.productTitle}\n💰 المجموع الكلي: ${order.totalPriceDZD.toLocaleString()} دج (الدفع عند الاستلام)\n\nيرجى تأكيد استلام الطلب وشحنه. شكراً!`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Variant Specific Theming
  const theme = useMemo(() => {
    switch (variant) {
      case "cyber":
        return {
          bg: "bg-[#060810] text-[#00f0ff]",
          card: "bg-[#0a0f1d]/90 border-[#00f0ff]/30 hover:border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.15)]",
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
          card: "bg-[#0f1f18]/90 border-emerald-500/30 hover:border-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.15)]",
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
    <div className={`min-h-screen ${theme.bg} selection:bg-cyan-500/30 pb-32 sm:pb-28`} dir="rtl">
      
      {/* 1. TOP SHOPIFY-STYLE ANNOUNCEMENT TICKER */}
      <div 
        className="w-full border-b border-white/10 py-2 px-4 text-center text-xs backdrop-blur-md sticky top-0 z-40"
        style={{
          backgroundColor: settings.announcementBgColor || "rgba(8, 10, 16, 0.95)"
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between font-medium gap-2">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <Truck className="w-4 h-4 shrink-0 text-cyan-400 animate-pulse" />
            <span className="truncate">{storeNotice}</span>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {/* Header Cart Toggle Button */}
            <button
              onClick={() => {
                setOrderSuccess(null);
                setIsCartOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all shadow-sm"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">السلة</span>
              {cartItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-400 text-black font-mono text-[11px] flex items-center justify-center font-black">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 1.5 MULTI-PAGE STORE NAVBAR (نظام الموقع متعدد الصفحات) */}
      <nav className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-[33px] z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* Logo & Store Title */}
          <div 
            onClick={() => navigateToPage("home")} 
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/20 bg-black/60 shrink-0">
              <img
                src={profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                alt={storeTitle}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-right">
              <span className="font-extrabold text-xs sm:text-sm text-white block line-clamp-1">{storeTitle}</span>
              <span className="text-[10px] text-cyan-400 block font-mono">58 ولاية • COD</span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => navigateToPage("home")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPage === "home" ? "bg-cyan-400 text-black shadow-md" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
            >
              الرئيسية
            </button>
            <button
              type="button"
              onClick={() => navigateToPage("shop")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPage === "shop" ? "bg-cyan-400 text-black shadow-md" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
            >
              المتجر ({rawProducts.length})
            </button>
            <button
              type="button"
              onClick={() => navigateToPage("about")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPage === "about" ? "bg-cyan-400 text-black shadow-md" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
            >
              من نحن
            </button>
            <button
              type="button"
              onClick={() => navigateToPage("shipping")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPage === "shipping" ? "bg-cyan-400 text-black shadow-md" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
            >
              الشحن والاسترجاع
            </button>
            <button
              type="button"
              onClick={() => navigateToPage("contact")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPage === "contact" ? "bg-cyan-400 text-black shadow-md" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
            >
              اتصل بنا
            </button>
            {/* Custom Pages */}
            {profile.customPages?.filter(p => p.enabled !== false).map(cp => (
              <button
                key={cp.id}
                type="button"
                onClick={() => navigateToPage(cp.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPage === cp.slug ? "bg-cyan-400 text-black shadow-md" : "text-gray-300 hover:text-white hover:bg-white/5"}`}
              >
                {cp.title}
              </button>
            ))}
          </div>

          {/* Quick Header Cart Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setOrderSuccess(null);
                setIsCartOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(6,255,240,0.3)] hover:bg-cyan-300 transition-all"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>السلة</span>
              {cartItemCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-black text-cyan-400 text-[10px] flex items-center justify-center font-black">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Page Tabs */}
        <div className="md:hidden flex overflow-x-auto gap-1 px-3 pb-2 pt-1 scrollbar-none border-t border-white/5">
          <button
            type="button"
            onClick={() => navigateToPage("home")}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${currentPage === "home" ? "bg-cyan-400 text-black" : "bg-white/5 text-gray-300"}`}
          >
            الرئيسية
          </button>
          <button
            type="button"
            onClick={() => navigateToPage("shop")}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${currentPage === "shop" ? "bg-cyan-400 text-black" : "bg-white/5 text-gray-300"}`}
          >
            المتجر ({rawProducts.length})
          </button>
          <button
            type="button"
            onClick={() => navigateToPage("about")}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${currentPage === "about" ? "bg-cyan-400 text-black" : "bg-white/5 text-gray-300"}`}
          >
            من نحن
          </button>
          <button
            type="button"
            onClick={() => navigateToPage("shipping")}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${currentPage === "shipping" ? "bg-cyan-400 text-black" : "bg-white/5 text-gray-300"}`}
          >
            الشحن والضمان
          </button>
          <button
            type="button"
            onClick={() => navigateToPage("contact")}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${currentPage === "contact" ? "bg-cyan-400 text-black" : "bg-white/5 text-gray-300"}`}
          >
            اتصل بنا
          </button>
          {profile.customPages?.filter(p => p.enabled !== false).map(cp => (
            <button
              key={cp.id}
              type="button"
              onClick={() => navigateToPage(cp.slug)}
              className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all ${currentPage === cp.slug ? "bg-cyan-400 text-black" : "bg-white/5 text-gray-300"}`}
            >
              {cp.title}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 pt-6 sm:pt-8">
        
        {/* 2. STORE MEGA HEADER & BRANDING */}
        <div className="relative rounded-3xl overflow-hidden mb-6 border border-white/10 bg-white/[0.02] p-5 sm:p-7 backdrop-blur-xl">
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
                    متجر موثوق ومعتمد
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

                {/* Seller Quick Info */}
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{profile.location || "توصيل سريع لـ 58 ولاية"}</span>
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

            {/* Actions: Share & WhatsApp */}
            <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial border-white/10 hover:border-white/30 text-xs gap-1.5 rounded-xl h-9 px-3.5 bg-black/40"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? "تم النسخ" : "مشاركة المتجر"}</span>
              </Button>

              <a
                href={`https://wa.me/${sellerWhatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial w-full"
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

        {/* 3. VALUE PROPOSITION BAR (مزايا التسوق) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <Truck className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-right">
              <div className="text-xs font-bold text-white">توصيل 58 ولاية</div>
              <div className="text-[10px] text-gray-400">سريع لباب المنزل</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-right">
              <div className="text-xs font-bold text-white">الدفع عند الاستلام</div>
              <div className="text-[10px] text-gray-400">عاين المنتج ثم ادفع</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-right">
              <div className="text-xs font-bold text-white">استبدال واسترجاع</div>
              <div className="text-[10px] text-gray-400">ضمان الرضا التام</div>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
            <Headphones className="w-5 h-5 text-purple-400 shrink-0" />
            <div className="text-right">
              <div className="text-xs font-bold text-white">خدمة الزبائن</div>
              <div className="text-[10px] text-gray-400">تواصل مباشر عبر واتساب</div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            PAGE CONTENT ROUTING (نظام الصفحات المتعددة)
        ═══════════════════════════════════════════════════════ */}
        {currentPage === "about" && (
          <div className="space-y-6 mb-8">
            <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <Badge className="bg-cyan-500/20 text-cyan-300 border-none text-xs mb-3">عن المتجر والبراند</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                {settings.aboutStoryTitle || `قصة متجر ${storeTitle}`}
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line mb-6">
                {settings.aboutStoryText || profile.bio || "متجر رائد يقدم أفضل المنتجات المختارة بعناية فائقة، مع الالتزام التام بالجودة العالية، وضمان التوصيل السريع لـ 58 ولاية، مع إمكانية الفحص والمعاينة قبل الدفع عند الاستلام."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-2xl font-black text-cyan-400 font-mono mb-1">58</div>
                  <div className="text-xs font-bold text-white">ولاية نغطيها</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">توصيل منزلي سريع</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-2xl font-black text-emerald-400 font-mono mb-1">100%</div>
                  <div className="text-xs font-bold text-white">معاينة قبل الدفع</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">ضمان الرضا التام</div>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div className="text-2xl font-black text-purple-400 font-mono mb-1">48h</div>
                  <div className="text-xs font-bold text-white">ضمان استبدال</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">خدمة عملاء مباشرة</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => navigateToPage("shop")}
                  className="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-xl h-10 px-5 gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>تصفح المنتجات المتوفرة ({rawProducts.length})</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigateToPage("contact")}
                  className="border-white/20 text-xs rounded-xl h-10 px-5 gap-2"
                >
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span>تواصل معنا مباشرة</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentPage === "shipping" && (
          <div className="space-y-6 mb-8">
            <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <Badge className="bg-amber-500/20 text-amber-300 border-none text-xs mb-3">سياسة الشحن والاسترجاع والضمان</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                توصيل سريع وآمن لـ 58 ولاية جزائرية 🚚
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <Truck className="w-4 h-4" />
                    <span>تكلفة ومواعيد الشحن</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {shippingCost === 0 ? "🎉 التوصيل مجاني تماماً لجميع الطلبات!" : `سعر التوصيل الافتراضي هو ${shippingCost} دج لجميع الولايات.`}
                    {settings.freeShippingThresholdDZD ? ` كما نوفر شحناً مجانياً للطلبات التي تتجاوز ${settings.freeShippingThresholdDZD} دج.` : ""}
                    يصلكم الطرد في مدة تتراوح بين 24 إلى 48 ساعة لباب منزلكم.
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>حق الفحص والمعاينة قبل الدفع</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {settings.deliveryNotice || "يحق لك فحص الطرد والتأكد من مطابقة المنتج لجودته ومواصفاته قبل تسليم المبلغ لموزع شركة التوصيل."}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <RotateCcw className="w-4 h-4" />
                    <span>شروط الاستبدال والاسترجاع</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {settings.returnPolicyNotice || "نضمن لكم حق الاستبدال أو الاسترجاع بكل سلاسة في حال وجود أي عيب مصنعي أو خطأ خلال 48 ساعة من استلام الطرد."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === "contact" && (
          <div className="space-y-6 mb-8">
            <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-xs mb-3">اتصل بنا وخدمة الزبائن</Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                نحن هنا لمساعدتك والإجابة على كل استفساراتك 🤝
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-6">
                فريق متجرنا جاهز للرد على استفساراتكم ومتابعة طلباتكم بكل سرور.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <a
                  href={`https://wa.me/${sellerWhatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("مرحباً، أود الاستفسار عن منتجات متجركم")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366] transition-all flex flex-col justify-between group"
                >
                  <MessageCircle className="w-6 h-6 text-[#25D366] mb-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="text-sm font-bold text-white mb-1">واتساب الطلبات</div>
                    <div className="text-xs font-mono text-gray-300" dir="ltr">{sellerWhatsapp}</div>
                  </div>
                  <span className="text-[11px] text-[#25D366] font-bold mt-3 block">محادثة فورية ↗</span>
                </a>

                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 hover:border-cyan-400 transition-all flex flex-col justify-between group"
                  >
                    <Phone className="w-6 h-6 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-bold text-white mb-1">الاتصال الهاتفي</div>
                      <div className="text-xs font-mono text-gray-300" dir="ltr">{profile.phone}</div>
                    </div>
                    <span className="text-[11px] text-cyan-400 font-bold mt-3 block">اتصال مباشر ↗</span>
                  </a>
                )}

                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between">
                  <MapPin className="w-6 h-6 text-rose-400 mb-3" />
                  <div>
                    <div className="text-sm font-bold text-white mb-1">المقر والولايات</div>
                    <div className="text-xs text-gray-300">{profile.location || "الجزائر - توصيل لـ 58 ولاية"}</div>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-3 block">توصيل لباب المنزل</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Page Renderer */}
        {profile.customPages?.some(p => p.slug === currentPage) && (
          <div className="space-y-6 mb-8">
            {(() => {
              const cp = profile.customPages?.find(p => p.slug === currentPage);
              if (!cp) return null;
              return (
                <div className="p-6 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-none text-xs mb-3">صفحة مخصصة</Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">{cp.title}</h2>
                  <div className="text-sm sm:text-base text-gray-300 leading-relaxed whitespace-pre-line mb-8">
                    {cp.content || "محتوى الصفحة سيظهر هنا..."}
                  </div>
                  <Button
                    onClick={() => navigateToPage("shop")}
                    className="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs rounded-xl h-10 px-6 gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>تصفح المنتجات المتوفرة</span>
                  </Button>
                </div>
              );
            })()}
          </div>
        )}

        {/* 5. SEARCH & CATEGORIES BAR (For shop and home pages) */}
        {(currentPage === "home" || currentPage === "shop") && (
          <div id="products-catalog" className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 mb-6 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  {currentPage === "home" ? "أبرز المنتجات المختارة" : "كتالوج المنتجات الكامل"}
                </h3>
              </div>
              {currentPage === "home" && (
                <button
                  type="button"
                  onClick={() => navigateToPage("shop")}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                >
                  <span>عرض الكل ({rawProducts.length})</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              )}
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن أي منتج بالاسم أو المواصفات..."
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
                  <span>التصنيف:</span>
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
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
        )}

        {/* 6. SHOPIFY PRODUCT GRID (Shown on home & shop) */}
        {(currentPage === "home" || currentPage === "shop") && (
          filteredProducts.length === 0 ? (
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
                عرض جميع المنتجات
              </Button>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(currentPage === "home" ? filteredProducts.slice(0, 6) : filteredProducts).map((prod) => (
              <div
                key={prod.id}
                className={`p-4 rounded-3xl transition-all duration-300 flex flex-col justify-between group border hover:shadow-2xl ${theme.card}`}
              >
                <div>
                  {/* Product Image Clickable to Dedicated Product Page */}
                  <div 
                    onClick={() => handleOpenProduct(prod)}
                    className="relative h-56 rounded-2xl overflow-hidden bg-black/60 mb-3.5 border border-white/5 cursor-pointer"
                  >
                    <img
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Stock & Discount Badges */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
                      <Badge
                        className={`text-[10px] font-bold border-none shadow-md ${
                          prod.inStock
                            ? "bg-emerald-500 text-black"
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

                    {/* Quick View Overlay Pill */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 px-3.5 rounded-full bg-white/90 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg">
                        <Eye className="w-3.5 h-3.5" />
                        <span>تفاصيل المنتج والطلب</span>
                      </span>
                    </div>
                  </div>

                  {/* Urgency indicator */}
                  {showStockCounter && prod.inStock && (
                    <div className="mb-2">
                      <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                        <Flame className="w-3.5 h-3.5 animate-pulse" />
                        <span>طلب متكرر • كمية محدودة</span>
                      </span>
                    </div>
                  )}

                  {/* Title & Description */}
                  <h3 
                    onClick={() => handleOpenProduct(prod)}
                    className="text-base font-bold text-white mb-1.5 line-clamp-1 cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    {prod.title}
                  </h3>
                  {prod.description && (
                    <p className="text-xs text-gray-300/80 line-clamp-2 leading-relaxed mb-3">
                      {prod.description}
                    </p>
                  )}

                  {/* Price Block */}
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

                {/* Shopify-Grade Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToCart(prod)}
                      disabled={!prod.inStock}
                      className="border-white/15 hover:border-cyan-400 text-xs h-9 rounded-xl font-bold gap-1 bg-white/5 text-white"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
                      <span>أضف للسلة</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleOpenProduct(prod)}
                      disabled={!prod.inStock}
                      className={`text-xs h-9 rounded-xl font-bold gap-1 ${
                        prod.inStock ? theme.accentBtn : "bg-white/10 text-gray-400"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>شراء الآن</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {showDirectWhatsappBtn && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDirectWhatsAppOrder(prod)}
                        className="flex-1 text-xs h-8 text-[#25D366] hover:bg-[#25D366]/10 gap-1.5 font-bold"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                        <span>طلب عبر واتساب</span>
                      </Button>
                    )}

                    {/* Copy Direct Product Link Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyProductLink(prod)}
                      title="نسخ رابط هذا المنتج لمشاركته في الإعلانات"
                      className="text-xs h-8 text-gray-400 hover:text-white px-2.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Products button on home page */}
          {currentPage === "home" && rawProducts.length > 6 && (
            <div className="mt-8 text-center">
              <Button
                onClick={() => navigateToPage("shop")}
                className="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs h-11 px-8 rounded-xl gap-2 shadow-[0_0_20px_rgba(6,255,240,0.3)] transition-all hover:scale-105"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>تصفح جميع المنتجات المتوفرة ({rawProducts.length})</span>
              </Button>
            </div>
          )}
        </div>
      )}

        {/* 7. FAQ ACCORDION SECTION (الأسئلة الشائعة لزيادة ثقة الزبون) */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
          <div className="text-center max-w-lg mx-auto mb-6">
            <h4 className="text-lg font-black text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>الأسئلة الشائعة حول التوصيل والطلب</span>
            </h4>
            <p className="text-xs text-gray-400 mt-1">كل ما تحتاج معرفته قبل إتمام طلبك من متجرنا</p>
          </div>

          <div className="space-y-2.5 max-w-3xl mx-auto">
            {[
              {
                q: "كم يستغرق وصول الطلب؟",
                a: "يتم توصيل الطلبات خلال 24 إلى 48 ساعة كحد أقصى لجميع ولايات الوطن الـ 58، وتصلك رسالة أو اتصال لتأكيد موعد الاستلام."
              },
              {
                q: "كيف تتم عملية الدفع؟",
                a: "الدفع يتم نقداً عند الاستلام (COD) فقط بعد أن يصلك المنتج وتعاينه بنفسك أمام موزع شركة التوصيل."
              },
              {
                q: "هل يمكنني فحص المنتج قبل الدفع؟",
                a: "نعم بالتأكيد! يحق لك فتح الطرد ومعاينة المنتج للتأكد من مطابقته للجودة والمواصفات المعروضة."
              },
              {
                q: "ماذا لو وجدت مشكلة في المنتج؟",
                a: "نحن نضمن لك حق الاستبدال أو الاسترجاع بكل سهولة؛ كل ما عليك هو التواصل مع خدمة الزبائن عبر الواتساب وسنتكفل بالأمر فوراً."
              }
            ].map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-right flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${openFaq === idx ? "rotate-180 text-cyan-400" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-300 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 8. PROFESSIONAL E-COMMERCE FOOTER */}
        <div className="mt-14 pt-8 border-t border-white/10 text-center text-xs text-gray-400 space-y-4">
          {/* Quick Page Links in Footer */}
          <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-300 flex-wrap pb-2 border-b border-white/5">
            <button type="button" onClick={() => navigateToPage("home")} className="hover:text-cyan-400 transition-colors">
              الرئيسية
            </button>
            <button type="button" onClick={() => navigateToPage("shop")} className="hover:text-cyan-400 transition-colors">
              المتجر ({rawProducts.length})
            </button>
            <button type="button" onClick={() => navigateToPage("about")} className="hover:text-cyan-400 transition-colors">
              من نحن
            </button>
            <button type="button" onClick={() => navigateToPage("shipping")} className="hover:text-cyan-400 transition-colors">
              الشحن والاسترجاع
            </button>
            <button type="button" onClick={() => navigateToPage("contact")} className="hover:text-cyan-400 transition-colors">
              اتصل بنا
            </button>
            {profile.customPages?.filter(p => p.enabled !== false).map(cp => (
              <button key={cp.id} type="button" onClick={() => navigateToPage(cp.slug)} className="hover:text-cyan-400 transition-colors">
                {cp.title}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-gray-400 flex-wrap">
            <span>🚚 توصيل سريع لـ 58 ولاية</span>
            <span>💵 الدفع عند الاستلام</span>
            <span>🔒 تسوق آمن ومحمي 100%</span>
          </div>
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} • متجر {storeTitle} • تم الإنشاء بواسطة{" "}
            <a
              href="https://www.novawebdv.com"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-bold hover:underline"
            >
              Novaweb Profiles
            </a>
          </p>
        </div>
      </div>

      {/* 9. MOBILE-FIRST STICKY BOTTOM BAR (Always available on phones) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-2.5 px-4 bg-[#0a0d16]/95 backdrop-blur-xl border-t border-white/15 shadow-[0_-5px_20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {/* Quick WhatsApp Help */}
          <a
            href={`https://wa.me/${sellerWhatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center p-2.5 rounded-xl bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] shrink-0"
            title="محادثة واتساب"
          >
            <MessageCircle className="w-5 h-5 fill-[#25D366]" />
          </a>

          {/* Cart Checkout Button */}
          <button
            onClick={() => {
              setOrderSuccess(null);
              setIsCartOpen(true);
            }}
            className="flex-1 p-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs flex items-center justify-between shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-black text-cyan-300 text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span>{cartItemCount > 0 ? `السلة (${cartItemCount})` : "سلة المشتريات"}</span>
            </div>

            <span className="font-mono text-xs">
              {cartItemCount > 0 ? `${cartTotalDZD.toLocaleString()} دج` : "عرض"}
            </span>
          </button>
        </div>
      </div>

      {/* 10. DEDICATED SINGLE PRODUCT LANDING PAGE / MODAL (WITH DEEP LINK SUPPORT) */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && handleCloseProduct()}>
        <DialogContent className="max-w-2xl bg-[#0a0d16] border border-white/15 text-white rounded-3xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
          {selectedProduct && (
            <>
              {orderSuccess ? (
                /* ORDER SUCCESS SCREEN FOR SINGLE ITEM */
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">تم استلام طلبك بنجاح! 🎉</h3>
                    <p className="text-xs text-gray-300 mt-1">
                      رقم الطلب: <strong className="text-cyan-400 font-mono">#{orderSuccess.id?.slice(-6).toUpperCase()}</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-xs text-right space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>المنتج:</span>
                      <span className="font-bold text-white">{orderSuccess.productTitle}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>الكمية:</span>
                      <span className="font-bold text-white font-mono">{orderSuccess.quantity}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>الولاية:</span>
                      <span className="font-bold text-white">{orderSuccess.customerWilaya}</span>
                    </div>
                    <div className="flex justify-between text-gray-300 border-t border-white/5 pt-2">
                      <span>المبلغ الإجمالي للدفع:</span>
                      <span className="text-cyan-400 font-black font-mono text-sm">{orderSuccess.totalPriceDZD.toLocaleString()} دج</span>
                    </div>
                  </div>

                  <a
                    href={getWhatsAppMessageUrl(orderSuccess)}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full"
                  >
                    <Button className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs h-11 rounded-xl shadow-lg gap-2">
                      <MessageCircle className="w-4 h-4 fill-black" />
                      <span>تأكيد الطلب فوراً عبر واتساب المتجر 📲</span>
                    </Button>
                  </a>

                  <Button
                    variant="outline"
                    onClick={handleCloseProduct}
                    className="w-full border-white/10 text-xs h-9 rounded-xl text-gray-300"
                  >
                    متابعة تصفح المتجر
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Product Header & Share Link */}
                  <div className="flex items-start justify-between gap-4 pb-2 border-b border-white/5">
                    <div>
                      {selectedProduct.category && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] mb-1.5">
                          {selectedProduct.category}
                        </Badge>
                      )}
                      <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                        {selectedProduct.title}
                      </h2>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyProductLink(selectedProduct)}
                      className="border-white/10 hover:border-cyan-400 text-xs gap-1.5 rounded-xl h-8 shrink-0 bg-black/40"
                    >
                      {copiedProductLink ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                      <span>{copiedProductLink ? "تم نسخ الرابط!" : "مشاركة الرابط"}</span>
                    </Button>
                  </div>

                  {/* Product Visual Showcase & Pricing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                    <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-white/10 h-56 sm:h-64 shadow-xl">
                      <img
                        src={selectedProduct.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"}
                        alt={selectedProduct.title}
                        className="w-full h-full object-cover"
                      />
                      {selectedProduct.originalPriceDZD && selectedProduct.originalPriceDZD > selectedProduct.priceDZD && (
                        <Badge className="absolute top-3 right-3 bg-red-600 text-white font-black text-xs shadow-lg">
                          خصم {Math.round((1 - selectedProduct.priceDZD / selectedProduct.originalPriceDZD) * 100)}%
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Price Section */}
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                        <div className="text-gray-400 text-xs font-semibold">سعر المنتج:</div>
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                            {selectedProduct.priceDZD.toLocaleString()} دج
                          </span>
                          {selectedProduct.originalPriceDZD && selectedProduct.originalPriceDZD > selectedProduct.priceDZD && (
                            <span className="text-sm text-gray-500 line-through font-mono">
                              {selectedProduct.originalPriceDZD.toLocaleString()} دج
                            </span>
                          )}
                        </div>
                        {shippingCost > 0 ? (
                          <div className="text-[11px] text-gray-400">سعر التوصيل: {shippingCost.toLocaleString()} دج لجميع الولايات</div>
                        ) : (
                          <div className="text-[11px] text-emerald-400 font-bold">توصيل مجاني 🎁 لجميع ولايات الوطن</div>
                        )}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between p-3 rounded-2xl bg-black/40 border border-white/10 text-xs">
                        <span className="font-bold text-gray-300">حدد الكمية:</span>
                        <div className="flex items-center gap-2 bg-black/60 p-1 rounded-xl border border-white/10">
                          <button
                            type="button"
                            onClick={() => setSingleQty(Math.max(1, singleQty - 1))}
                            className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm font-mono">{singleQty}</span>
                          <button
                            type="button"
                            onClick={() => setSingleQty(singleQty + 1)}
                            className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Total for selected qty */}
                      <div className="flex justify-between items-center text-xs px-1">
                        <span className="text-gray-400">المجموع المطلوب:</span>
                        <span className="text-white font-black font-mono text-base">
                          {(selectedProduct.priceDZD * singleQty + shippingCost).toLocaleString()} دج
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                      <div className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-cyan-400" />
                        <span>وصف ومواصفات المنتج:</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}

                  {/* FAST ONE-CLICK COD ORDER FORM (الاستمارة السريعة للدفع عند الاستلام) */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleOrderSubmit(false);
                    }}
                    className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-cyan-950/20 border border-cyan-500/30 space-y-3.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="text-sm font-black text-white flex items-center gap-2">
                        <PackageCheck className="w-4 h-4 text-cyan-400" />
                        <span>استمارة تأكيد الطلب السريع (الدفع عند الاستلام)</span>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">
                        معاينة قبل الدفع
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-300 font-bold">الاسم واللقب *</Label>
                        <Input
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="الاسم الكامل"
                          className="bg-black/60 border-white/10 text-xs h-10 rounded-xl text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-gray-300 font-bold">رقم الهاتف *</Label>
                        <Input
                          required
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="06XXXXXXXX / 07XXXXXXXX"
                          className="bg-black/60 border-white/10 text-xs h-10 rounded-xl font-mono text-white"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-300 font-bold">الولاية *</Label>
                        <select
                          value={customerWilaya}
                          onChange={(e) => setCustomerWilaya(e.target.value)}
                          className="w-full bg-[#0d1220] border border-white/10 text-xs rounded-xl px-3 text-white h-10 focus:outline-none focus:border-cyan-400 font-medium"
                        >
                          {ALGERIA_WILAYAS.map((w) => (
                            <option key={w.code} value={w.nameAr}>{w.nameAr}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-gray-300 font-bold">البلدية أو العنوان التفصيلي</Label>
                        <Input
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="اسم البلدية أو الحي"
                          className="bg-black/60 border-white/10 text-xs h-10 rounded-xl text-white"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-black text-sm h-12 rounded-xl shadow-xl shadow-cyan-500/25 gap-2 mt-3 active:scale-98 transition-transform"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Truck className="w-5 h-5" />}
                      <span>تأكيد الطلب الآن 🚚 ({(selectedProduct.priceDZD * singleQty + shippingCost).toLocaleString()} دج)</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDirectWhatsAppOrder(selectedProduct)}
                      className="w-full text-xs h-9 text-[#25D366] hover:bg-[#25D366]/10 gap-2 font-bold"
                    >
                      <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                      <span>أو الطلب المباشر عبر واتساب المتجر</span>
                    </Button>
                  </form>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 11. FULL SHOPPING CART DRAWER / MODAL */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-lg bg-[#0a0d16] border border-white/15 text-white rounded-3xl p-5 sm:p-6 max-h-[92vh] overflow-y-auto">
          <DialogHeader className="mb-3 text-right">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              <span>سلة المشتريات ({cartItemCount} منتج)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              راجع منتجاتك وأدخل معلومات التوصيل لإنهاء الطلب والدفع عند الاستلام.
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
                  <span>تأكيد الطلب فوراً عبر واتساب المتجر 📲</span>
                </Button>
              </a>

              <Button
                variant="outline"
                onClick={() => setIsCartOpen(false)}
                className="w-full border-white/10 text-xs h-9 rounded-xl text-gray-300"
              >
                متابعة تصفح المتجر
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
                تصفح المنتجات وأضف ما يعجبك
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cart Items List */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
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
                        <div className="text-cyan-400 font-mono">{item.product.priceDZD.toLocaleString()} دج</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.product.id, -1)}
                          className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs font-mono">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateCartQty(item.product.id, 1)}
                          className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
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

              {/* Subtotal & Shipping Calculation */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>المجموع الفرعي ({cartItemCount} قطع):</span>
                  <span className="font-mono font-bold text-white">{cartSubtotalDZD.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>سعر التوصيل:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {shippingCost > 0 ? `${shippingCost.toLocaleString()} دج` : "مجاني 🎁"}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-white/10 pt-2 text-sm">
                  <span>الإجمالي للدفع:</span>
                  <span className="text-cyan-400 font-black font-mono">{cartTotalDZD.toLocaleString()} دج</span>
                </div>
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
                  <span>معلومات المستلم والشحن (الدفع عند الاستلام)</span>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-300">الاسم الكامل *</Label>
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
                      placeholder="اسم البلدية أو الحي"
                      className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-300">ملاحظات إضافية (اختياري)</Label>
                  <Input
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="وقت التوصيل المفضل أو أي توضيح"
                    className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs h-11 rounded-xl shadow-lg shadow-cyan-500/20 gap-2 mt-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
                  <span>تأكيد الطلب الآن 🚚 ({cartTotalDZD.toLocaleString()} دج)</span>
                </Button>
              </form>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
