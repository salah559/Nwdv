import React, { useState } from "react";
import { UserProfile, SocialLink } from "@shared/saas-schema";
import { ProfileTemplateRenderer } from "@/components/templates/ProfileTemplateRenderer";
import { TEMPLATES, getTemplateById } from "@/lib/templates-data";
import { ImageUploadInput } from "@/components/ui/ImageUploadInput";
import { PlatformIcon, SUPPORTED_PLATFORMS } from "@/components/ui/PlatformIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Sparkles, 
  Palette, 
  Eye, 
  Edit3, 
  Save, 
  Smartphone, 
  Monitor, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Camera, 
  Share2, 
  Type, 
  Sliders, 
  CheckCircle2, 
  Loader2, 
  X, 
  Layers, 
  Crown,
  Check,
  User,
  MapPin,
  Phone,
  MessageSquare,
  Wand2,
  RefreshCw,
  LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface VisualProfileBuilderProps {
  profile: UserProfile;
  onChange: (updated: UserProfile) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  unlockedTemplates?: string[];
  onUnlockTemplateRequest?: (tmpl: any) => void;
}

const COLOR_PRESETS = [
  { name: "سيان كهربائي (Cyan)", value: "#06b6d4", glow: "rgba(6,182,212,0.4)" },
  { name: "نيون بنفسجي (Purple)", value: "#a855f7", glow: "rgba(168,85,247,0.4)" },
  { name: "زمرد مصفوفي (Emerald)", value: "#10b981", glow: "rgba(16,185,129,0.4)" },
  { name: "ذهب فاخر (Gold)", value: "#f59e0b", glow: "rgba(245,158,11,0.4)" },
  { name: "ياقوت أحمر (Crimson)", value: "#f43f5e", glow: "rgba(244,63,94,0.4)" },
  { name: "سايبر أصفر (Cyber)", value: "#facc15", glow: "rgba(250,204,21,0.4)" },
  { name: "أزرق فلكي (Blue)", value: "#3b82f6", glow: "rgba(59,130,246,0.4)" },
  { name: "أبيض نقي (White)", value: "#ffffff", glow: "rgba(255,255,255,0.4)" },
];

const FONT_OPTIONS = [
  { name: "Space Grotesk (عصري تقني)", value: "Space Grotesk" },
  { name: "Cairo (عربي فخم)", value: "Cairo" },
  { name: "Tajawal (عربي رشيق)", value: "Tajawal" },
  { name: "Inter (عالمي بسيط)", value: "Inter" },
  { name: "Orbitron (سايبربانك)", value: "Orbitron" },
  { name: "Playfair Display (كلاسيكي)", value: "Playfair Display" },
];

const BG_STYLE_OPTIONS: { id: "mesh" | "particles" | "grid" | "solid"; label: string; desc: string }[] = [
  { id: "mesh", label: "شفق هلامي (Mesh Glow)", desc: "تدرجات لونية سائلة ومتحركة" },
  { id: "particles", label: "جزيئات نيون (Particles)", desc: "نقاط ضوئية متلألئة ناعمة" },
  { id: "grid", label: "شبكة رقمية (Cyber Grid)", desc: "شبكة تقنية فائقة الدقة" },
  { id: "solid", label: "أسود نقي (Obsidian)", desc: "مظهر داكن بدون مشتتات" },
];

const BUTTON_STYLE_OPTIONS: { id: "pill" | "rounded" | "sharp" | "glass"; label: string }[] = [
  { id: "pill", label: "كبسولي مستدير (Pill)" },
  { id: "rounded", label: "حواف ناعمة (Rounded)" },
  { id: "glass", label: "زجاجي بلوري (Glass)" },
  { id: "sharp", label: "أطراف حادة (Sharp)" },
];

export function VisualProfileBuilder({
  profile,
  onChange,
  onSave,
  isSaving,
  unlockedTemplates = [],
  onUnlockTemplateRequest,
}: VisualProfileBuilderProps) {
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [activeSideTab, setActiveSideTab] = useState<"customize" | "templates" | "links">("customize");

  // Inline Quick Modals
  const [editingTextModal, setEditingTextModal] = useState<boolean>(false);
  const [editingAvatarModal, setEditingAvatarModal] = useState<boolean>(false);
  const [editingCoverModal, setEditingCoverModal] = useState<boolean>(false);
  const [editingContactModal, setEditingContactModal] = useState<boolean>(false);
  const [addLinkModal, setAddLinkModal] = useState<boolean>(false);
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null);

  // New link draft
  const [newLinkPlatform, setNewLinkPlatform] = useState<string>("website");
  const [newLinkTitle, setNewLinkTitle] = useState<string>("");
  const [newLinkUrl, setNewLinkUrl] = useState<string>("");

  const currentTemplate = getTemplateById(profile.templateId);
  const customTheme = profile.customTheme || {
    primaryColor: "#06b6d4",
    backgroundColor: "#07090e",
    fontFamily: "Space Grotesk",
    backgroundStyle: "mesh",
    buttonStyle: "rounded",
  };

  const updateTheme = (patch: Partial<NonNullable<UserProfile["customTheme"]>>) => {
    onChange({
      ...profile,
      customTheme: {
        ...customTheme,
        ...patch,
      },
    });
  };

  const handleAddNewLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast.error("يرجى إدخال عنوان ورابط صالحين");
      return;
    }
    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      platform: newLinkPlatform,
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim().startsWith("http") ? newLinkUrl.trim() : `https://${newLinkUrl.trim()}`,
      enabled: true,
      order: (profile.socialLinks?.length || 0) + 1,
    };
    onChange({
      ...profile,
      socialLinks: [...(profile.socialLinks || []), newLink],
    });
    setNewLinkTitle("");
    setNewLinkUrl("");
    setAddLinkModal(false);
    toast.success("تمت إضافة الرابط بنجاح!");
  };

  const removeSocialLink = (idx: number) => {
    const updated = [...(profile.socialLinks || [])];
    updated.splice(idx, 1);
    onChange({ ...profile, socialLinks: updated });
    toast.success("تم حذف الرابط");
  };

  const toggleSocialLink = (idx: number) => {
    const updated = [...(profile.socialLinks || [])];
    updated[idx] = { ...updated[idx], enabled: !updated[idx].enabled };
    onChange({ ...profile, socialLinks: updated });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ================= TOP TOOLBAR ================= */}
      <div className="p-3 sm:p-4 rounded-3xl bg-[#0d111a]/90 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-between gap-3">
        {/* Left: Mode & Device Switcher */}
        <div className="flex items-center gap-2">
          {/* Visual Edit vs Live Preview Toggle */}
          <div className="bg-black/60 p-1 rounded-2xl border border-white/10 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isEditMode
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_15px_rgba(6,255,240,0.3)]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل بصري مباشر</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                !isEditMode
                  ? "bg-white/15 text-white border border-white/20 shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>معاينة حقيقية</span>
            </button>
          </div>

          {/* Device toggle */}
          <div className="hidden sm:flex bg-black/60 p-1 rounded-2xl border border-white/10 items-center gap-1">
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded-xl transition-all ${
                device === "mobile" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:text-white"
              }`}
              title="عرض الجوال (Mobile 380px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded-xl transition-all ${
                device === "desktop" ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:text-white"
              }`}
              title="عرض الحاسوب (Desktop Full)"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Current Template badge & Quick Switch */}
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 text-xs gap-1.5 font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>القالب: {currentTemplate.name}</span>
          </Badge>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveSideTab("templates")}
            className="h-8 px-3 text-xs border-white/15 hover:border-cyan-400 text-gray-200"
          >
            <RefreshCw className="w-3 h-3 mr-1 text-cyan-400" />
            <span>تغيير القالب</span>
          </Button>
        </div>

        {/* Right: Save changes button */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={isSaving}
            onClick={onSave}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-extrabold uppercase tracking-wider text-xs px-5 h-9 rounded-xl shadow-[0_0_20px_rgba(6,255,240,0.35)] gap-1.5"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>حفظ الموقع</span>
          </Button>
        </div>
      </div>

      {/* ================= MAIN SPLIT CANVAS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============ LEFT: INTERACTIVE LIVE CANVAS (lg:col-span-8) ============ */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* Quick Inline Floating Action Bar (Only in Edit Mode) */}
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full mb-3 p-2.5 rounded-2xl bg-black/70 border border-cyan-500/30 backdrop-blur-xl flex flex-wrap items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2 text-cyan-400 font-bold px-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>وضع التعديل البصري: انقر على أي عنصر بالمعاينة لتعديله فوراً</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingAvatarModal(true)}
                  className="h-7 text-xs text-gray-200 hover:text-cyan-300 hover:bg-white/10 gap-1 px-2.5 rounded-lg"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>الصورة</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingTextModal(true)}
                  className="h-7 text-xs text-gray-200 hover:text-cyan-300 hover:bg-white/10 gap-1 px-2.5 rounded-lg"
                >
                  <Type className="w-3.5 h-3.5 text-purple-400" />
                  <span>الاسم والنبذة</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAddLinkModal(true)}
                  className="h-7 text-xs bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 gap-1 px-2.5 rounded-lg font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة رابط</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* THE CANVAS FRAME */}
          <div
            className={`w-full transition-all duration-300 flex justify-center ${
              device === "mobile" ? "max-w-[420px]" : "max-w-full"
            }`}
          >
            <div
              className={`w-full relative rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border transition-all duration-300 ${
                isEditMode
                  ? "border-cyan-500/40 ring-4 ring-cyan-500/10"
                  : "border-white/10"
              }`}
            >
              {/* Phone Speaker & Camera Notch (when in mobile view) */}
              {device === "mobile" && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black/90 rounded-full z-40 flex items-center justify-center pointer-events-none border border-white/10">
                  <div className="w-10 h-1 bg-white/20 rounded-full mr-2" />
                  <div className="w-2 h-2 rounded-full bg-cyan-500/40" />
                </div>
              )}

              {/* Editable Overlay Triggers in Visual Edit Mode */}
              {isEditMode && (
                <div className="absolute inset-0 pointer-events-none z-30">
                  {/* Avatar Click Target Badge */}
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => setEditingAvatarModal(true)}
                      className="px-2.5 py-1 rounded-full bg-black/85 text-cyan-300 border border-cyan-400/50 shadow-lg text-[10px] font-bold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
                    >
                      <Camera className="w-3 h-3 text-cyan-400" />
                      <span>تغيير الصورة</span>
                    </button>
                  </div>

                  {/* Name & Bio Quick Edit Badge */}
                  <div className="absolute top-44 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => setEditingTextModal(true)}
                      className="px-2.5 py-1 rounded-full bg-black/85 text-purple-300 border border-purple-400/50 shadow-lg text-[10px] font-bold flex items-center gap-1 hover:scale-105 active:scale-95 transition-all backdrop-blur-md"
                    >
                      <Edit3 className="w-3 h-3 text-purple-400" />
                      <span>تعديل الاسم والتفاصيل</span>
                    </button>
                  </div>

                  {/* Floating Add Link Target */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => setAddLinkModal(true)}
                      className="px-4 py-2 rounded-2xl bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,255,240,0.5)] font-bold text-xs flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ إضافة رابط جديد إلى القالب</span>
                    </button>
                  </div>
                </div>
              )}

              {/* RENDER THE ACTUAL LIVE TEMPLATE WITH INJECTED CUSTOM THEME */}
              <div
                className="w-full min-h-[640px] max-h-[820px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 relative"
                style={{
                  fontFamily: customTheme.fontFamily ? `${customTheme.fontFamily}, sans-serif` : undefined,
                }}
              >
                <ProfileTemplateRenderer profile={profile} />
              </div>
            </div>
          </div>
        </div>

        {/* ============ RIGHT: TEMPLATE CUSTOMIZER & FREEDOM PANEL (lg:col-span-4) ============ */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl bg-[#0c1017]/95 border border-white/10 p-5 shadow-2xl backdrop-blur-2xl">
            {/* Customizer Sub-tabs */}
            <div className="grid grid-cols-3 gap-1 bg-black/60 p-1 rounded-2xl border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => setActiveSideTab("customize")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSideTab === "customize"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>المظهر</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSideTab("templates")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSideTab === "templates"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>القوالب</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveSideTab("links")}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeSideTab === "links"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>الروابط ({profile.socialLinks?.length || 0})</span>
              </button>
            </div>

            {/* TAB 1: THEME & TEMPLATE FREEDOM CUSTOMIZER */}
            {activeSideTab === "customize" && (
              <div className="space-y-6">
                {/* 1. Primary Glow & Accent Color */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <Label className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>لون التوهج والأزرار الرئيسي:</span>
                    </Label>
                    <span className="font-mono text-xs text-cyan-400 font-bold">{customTheme.primaryColor}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {COLOR_PRESETS.map((color) => {
                      const isSelected = customTheme.primaryColor?.toLowerCase() === color.value.toLowerCase();
                      return (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => updateTheme({ primaryColor: color.value })}
                          className={`h-9 rounded-xl border flex items-center justify-center transition-all ${
                            isSelected
                              ? "border-white ring-2 ring-white/40 scale-105"
                              : "border-white/10 hover:border-white/30"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {isSelected && <Check className="w-4 h-4 text-black font-extrabold" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">لون مخصص:</span>
                    <input
                      type="color"
                      value={customTheme.primaryColor || "#06b6d4"}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="w-8 h-8 rounded-lg bg-black/60 border border-white/20 cursor-pointer p-0.5"
                    />
                    <Input
                      value={customTheme.primaryColor || "#06b6d4"}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      className="h-8 text-xs font-mono bg-black/40 border-white/10"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* 2. Typography / Font Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-purple-400" />
                    <span>نوع الخط العام للقالب:</span>
                  </Label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {FONT_OPTIONS.map((f) => {
                      const isSelected = customTheme.fontFamily === f.value;
                      return (
                        <button
                          key={f.value}
                          type="button"
                          onClick={() => updateTheme({ fontFamily: f.value })}
                          className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs ${
                            isSelected
                              ? "bg-purple-500/20 border-purple-400 text-purple-300 font-bold"
                              : "bg-black/40 border-white/5 text-gray-300 hover:border-white/15"
                          }`}
                          style={{ fontFamily: f.value }}
                        >
                          <span>{f.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Background Style & Atmosphere */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    <span>مؤثرات وخلفية القالب:</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {BG_STYLE_OPTIONS.map((bg) => {
                      const isSelected = customTheme.backgroundStyle === bg.id;
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => updateTheme({ backgroundStyle: bg.id })}
                          className={`p-2.5 rounded-xl border text-right transition-all text-xs flex flex-col justify-between ${
                            isSelected
                              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold shadow-md shadow-emerald-500/10"
                              : "bg-black/40 border-white/5 text-gray-300 hover:border-white/15"
                          }`}
                        >
                          <span>{bg.label}</span>
                          <span className="text-[10px] text-gray-400 font-normal mt-1">{bg.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Button & Links Styling */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                    <span>شكل أزرار الروابط:</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {BUTTON_STYLE_OPTIONS.map((btn) => {
                      const isSelected = customTheme.buttonStyle === btn.id;
                      return (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() => updateTheme({ buttonStyle: btn.id })}
                          className={`p-2 rounded-xl border text-center transition-all text-xs ${
                            isSelected
                              ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold"
                              : "bg-black/40 border-white/5 text-gray-400 hover:border-white/15"
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INSTANT TEMPLATES CAROUSEL */}
            {activeSideTab === "templates" && (
              <div className="space-y-4">
                <div className="text-xs text-gray-400">
                  انقر على أي قالب لتطبيقه ومعاينته حياً على موقعك فوراً:
                </div>

                <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                  {TEMPLATES.map((tmpl) => {
                    const isCurrent = profile.templateId === tmpl.id;
                    const isUnlocked = !tmpl.isPremium || unlockedTemplates.includes(tmpl.id);

                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => {
                          onChange({ ...profile, templateId: tmpl.id });
                          toast.success(`تم التبديل إلى قالب: ${tmpl.name}`);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                          isCurrent
                            ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,255,240,0.2)]"
                            : "bg-black/40 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <img
                          src={tmpl.thumbnail}
                          alt={tmpl.name}
                          className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-xs text-white truncate">{tmpl.name}</span>
                            {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{tmpl.description}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {tmpl.isPremium ? (
                              <Badge className="bg-amber-400 text-black text-[9px] font-black py-0 h-4">
                                {tmpl.priceDZD} دج
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[9px] py-0 h-4">
                                مجاني 0 دج
                              </Badge>
                            )}
                            <span className="text-[9px] text-gray-500 uppercase">{tmpl.category}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL LINKS MANAGEMENT */}
            {activeSideTab === "links" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">روابط موقعك الحالية:</span>
                  <Button
                    size="sm"
                    onClick={() => setAddLinkModal(true)}
                    className="h-7 text-xs bg-cyan-400 text-black font-bold px-2.5 rounded-xl gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>رابط جديد</span>
                  </Button>
                </div>

                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                  {(profile.socialLinks || []).map((link, idx) => (
                    <div
                      key={link.id || idx}
                      className="p-3 rounded-2xl bg-black/50 border border-white/5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                          <PlatformIcon platform={link.platform} className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-white truncate">{link.title}</div>
                          <div className="text-[10px] text-gray-400 font-mono truncate" dir="ltr">
                            {link.url}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Switch
                          checked={link.enabled}
                          onCheckedChange={() => toggleSocialLink(idx)}
                        />
                        <button
                          type="button"
                          onClick={() => removeSocialLink(idx)}
                          className="text-gray-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL: EDIT NAME & BIO ================= */}
      <Dialog open={editingTextModal} onOpenChange={setEditingTextModal}>
        <DialogContent className="bg-[#0b0f17] border border-white/10 text-white max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>تعديل الاسم والمعلومات البصرية</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              التعديل هنا ينعكس فوراً ومباشرة داخل المعاينة.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">الاسم الكامل</Label>
              <Input
                value={profile.fullName}
                onChange={(e) => onChange({ ...profile, fullName: e.target.value })}
                className="bg-black/50 border-white/10 text-sm h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">المسمى الوظيفي / التخصص</Label>
              <Input
                value={profile.jobTitle || ""}
                onChange={(e) => onChange({ ...profile, jobTitle: e.target.value })}
                placeholder="مثال: مطور برمجيات ومصمم واجهات"
                className="bg-black/50 border-white/10 text-sm h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">النبذة التعريفية (Bio)</Label>
              <Textarea
                rows={3}
                value={profile.bio || ""}
                onChange={(e) => onChange({ ...profile, bio: e.target.value })}
                placeholder="اكتب نبذة مختصرة عن نفسك..."
                className="bg-black/50 border-white/10 text-sm rounded-xl resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-300">الموقع الجغرافي</Label>
                <Input
                  value={profile.location || ""}
                  onChange={(e) => onChange({ ...profile, location: e.target.value })}
                  placeholder="الجزائر 🇩🇿"
                  className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-300">رقم الهاتف / واتساب</Label>
                <Input
                  value={profile.whatsapp || profile.phone || ""}
                  onChange={(e) => onChange({ ...profile, whatsapp: e.target.value, phone: e.target.value })}
                  placeholder="+213..."
                  className="bg-black/50 border-white/10 text-xs h-9 rounded-xl"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              onClick={() => {
                setEditingTextModal(false);
                toast.success("تم تحديث النصوص بنجاح!");
              }}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs h-10 rounded-xl"
            >
              تم واعتماد التعديل
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: EDIT AVATAR ================= */}
      <Dialog open={editingAvatarModal} onOpenChange={setEditingAvatarModal}>
        <DialogContent className="bg-[#0b0f17] border border-white/10 text-white max-w-sm rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>تغيير الصورة الشخصية (Avatar)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              ارفع صورة شخصية مباشرة من هاتفك أو حاسوبك، يتم رفعها وحفظها فورياً.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <ImageUploadInput
              label="الصورة الشخصية"
              value={profile.avatarUrl || ""}
              onChange={(url) => {
                onChange({ ...profile, avatarUrl: url });
                toast.success("تم تحديث الصورة الشخصية!");
              }}
              aspectRatio="square"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              onClick={() => setEditingAvatarModal(false)}
              className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs h-10 rounded-xl"
            >
              تم
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================= MODAL: ADD NEW SOCIAL LINK ================= */}
      <Dialog open={addLinkModal} onOpenChange={setAddLinkModal}>
        <DialogContent className="bg-[#0b0f17] border border-white/10 text-white max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>إضافة رابط جديد إلى القالب</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-400">
              اختر المنصة واكتب عنوان الرابط وعنوان الـ URL الخاص بك.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">المنصة أو نوع الرابط</Label>
              <select
                value={newLinkPlatform}
                onChange={(e) => setNewLinkPlatform(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-xs rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400"
              >
                {Object.values(SUPPORTED_PLATFORMS).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value="other">أخرى / موقع مخصص (Custom)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">عنوان الرابط (الظاهر للزوار)</Label>
              <Input
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                placeholder="مثال: حسابي على إنستغرام أو معرض أعمالي"
                className="bg-black/50 border-white/10 text-xs h-10 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">رابط الويب (URL)</Label>
              <Input
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                placeholder="https://instagram.com/..."
                className="bg-black/50 border-white/10 text-xs h-10 rounded-xl font-mono"
                dir="ltr"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              onClick={handleAddNewLink}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-extrabold text-xs h-10 rounded-xl shadow-lg"
            >
              إضافة الرابط إلى القالب الآن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
