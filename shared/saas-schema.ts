import { z } from "zod";

export const RESERVED_USERNAMES = [
  "admin",
  "support",
  "dashboard",
  "api",
  "www",
  "novaweb",
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
  planId: "trial" | "basic";
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
  category: "minimal" | "developer" | "creative" | "luxury" | "business";
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
  paymentMethod: "baridimob" | "ccp" | "bank_transfer";
  transactionReference?: string;
  receiptUrl?: string;
  status: "pending" | "approved" | "rejected";
  adminNotes?: string;
  createdAt: any;
  confirmedAt?: any;
}
