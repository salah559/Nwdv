import { z } from "zod";

export const RESERVED_USERNAMES = [
  "admin",
  "support",
  "dashboard",
  "api",
  "www",
  "novaweb",
  "novawebdv",
  "nwdv",
  "preview",
  "staging",
  "profile",
  "profiles",
  "help",
  "billing",
  "auth",
  "login",
  "register",
  "p",
  "u",
  "app",
  "root",
  "mail",
  "dev",
  "test",
] as const;

export const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

export interface SocialLink {
  id: string;
  platform: string; // 'github' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'whatsapp' | 'website' | 'other'
  title: string;
  url: string;
  enabled: boolean;
  order: number;
}

export interface StoreProduct {
  id: string;
  userId?: string;
  title: string;
  description?: string;
  priceDZD: number;
  originalPriceDZD?: number;
  imageUrl: string;
  category?: string;
  inStock: boolean;
  order?: number;
  createdAt?: any;
}

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";

export interface StoreOrderItem {
  productId: string;
  title: string;
  priceDZD: number;
  quantity: number;
  imageUrl?: string;
}

export interface StoreOrder {
  id?: string;
  userId: string;
  username: string;
  productId: string;
  productTitle: string;
  productPriceDZD: number;
  productImageUrl?: string;
  quantity: number;
  items?: StoreOrderItem[];
  totalPriceDZD: number;
  customerName: string;
  customerPhone: string;
  customerWilaya: string;
  customerAddress?: string;
  customerNotes?: string;
  status: OrderStatus;
  createdAt: any;
  updatedAt?: any;
}

export interface StoreSettings {
  storeName?: string;
  currency?: string;
  whatsappForOrders?: string;
  enableDirectCheckout?: boolean;
  deliveryNotice?: string;
  storeBio?: string;
  accentColor?: string;
  allowCashOnDelivery?: boolean;
}

export interface UserProfile {
  id?: string;
  userId: string;
  username: string;
  fullName: string;
  jobTitle?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  location?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  socialLinks: SocialLink[];
  templateId: string;
  products?: StoreProduct[];
  storeSettings?: StoreSettings;
  customTheme?: {
    primaryColor?: string;
    backgroundColor?: string;
    fontFamily?: string;
    backgroundStyle?: "solid" | "gradient" | "mesh" | "particles";
  };
  isPublished: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export type SubscriptionStatus = "trial" | "active" | "expired" | "suspended";

export interface UserSubscription {
  userId: string;
  status: SubscriptionStatus;
  trialStartsAt: any;
  trialEndsAt: any;
  currentPeriodEnd?: any;
  planId: "trial" | "basic" | "yearly";
  amountDZD?: number;
  lastPaymentId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  isPremium: boolean;
  priceDZD: number;
  originalPriceDZD?: number;
  category: "minimal" | "developer" | "creative" | "luxury" | "business" | "diamond" | "store";
  thumbnail: string;
  features: string[];
}

export interface UserPurchase {
  id?: string;
  userId: string;
  templateId: string;
  priceDZD: number;
  purchasedAt: any;
  status: "completed" | "pending";
}

export interface PaymentRecord {
  id?: string;
  userId: string;
  userEmail: string;
  username: string;
  type: "subscription" | "template";
  targetId?: string; // e.g. templateId if type === 'template'
  amountDZD: number;
  paymentMethod: "baridimob" | "usdt" | "ccp" | "bank_transfer";
  transactionReference?: string;
  receiptUrl?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  createdAt: any;
  confirmedAt?: any;
}
