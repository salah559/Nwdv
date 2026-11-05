import React, { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, Image as ImageIcon, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { uploadImageToImgBB } from "@/lib/imgbb";
import { toast } from "sonner";

interface ImageUploadInputProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  label?: string;
  aspectRatio?: "square" | "cover";
}

export function ImageUploadInput({
  value,
  onChange,
  placeholder = "https://...",
  label,
  aspectRatio = "square",
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (< 32MB max for ImgBB)
    if (file.size > 32 * 1024 * 1024) {
      toast.error("حجم الصورة كبير جداً (الحد الأقصى 32 ميغابايت)");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadImageToImgBB(file);
      onChange(url);
      toast.success("تم رفع الصورة بنجاح إلى ImgBB!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "حدث خطأ أثناء رفع الصورة");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs text-gray-300 font-ui font-medium block">{label}</label>}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Thumbnail Preview */}
        {value ? (
          <div className="relative group shrink-0">
            <div className={`overflow-hidden rounded-xl border border-white/20 bg-black/40 ${aspectRatio === "cover" ? "w-28 h-16" : "w-14 h-14"}`}>
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="حذف"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className={`rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center text-gray-600 shrink-0 ${aspectRatio === "cover" ? "w-28 h-16" : "w-14 h-14"}`}>
            <ImageIcon className="w-5 h-5" />
          </div>
        )}

        {/* Input & Upload Button */}
        <div className="flex-1 w-full flex items-center gap-2">
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="bg-black/40 border-white/10 text-xs h-10 rounded-xl font-mono flex-1"
            dir="ltr"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <Button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs h-10 px-4 rounded-xl shrink-0 gap-1.5"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span className="hidden sm:inline">جارٍ الرفع...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>رفع من الجهاز</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
