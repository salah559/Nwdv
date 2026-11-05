import React from "react";
import { 
  Globe, 
  ExternalLink,
  MessageCircle, 
  Share2,
  Calendar,
  ShoppingBag,
  Music,
  Headphones
} from "lucide-react";

export interface PlatformMeta {
  id: string;
  name: string;
  color: string;
  bgGradient?: string;
  defaultTitle: string;
  urlPlaceholder: string;
}

export const SUPPORTED_PLATFORMS: Record<string, PlatformMeta> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    bgGradient: "from-amber-500 via-rose-500 to-purple-600",
    defaultTitle: "Instagram",
    urlPlaceholder: "https://instagram.com/username",
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    color: "#00f2fe",
    bgGradient: "from-cyan-400 via-black to-red-500",
    defaultTitle: "TikTok",
    urlPlaceholder: "https://tiktok.com/@username",
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp",
    color: "#25D366",
    bgGradient: "from-emerald-400 to-green-600",
    defaultTitle: "WhatsApp",
    urlPlaceholder: "https://wa.me/213...",
  },
  telegram: {
    id: "telegram",
    name: "Telegram",
    color: "#229ED9",
    bgGradient: "from-sky-400 to-blue-600",
    defaultTitle: "Telegram",
    urlPlaceholder: "https://t.me/username",
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    bgGradient: "from-blue-500 to-blue-700",
    defaultTitle: "Facebook",
    urlPlaceholder: "https://facebook.com/username",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    bgGradient: "from-blue-600 to-sky-700",
    defaultTitle: "LinkedIn",
    urlPlaceholder: "https://linkedin.com/in/username",
  },
  twitter: {
    id: "twitter",
    name: "X (Twitter)",
    color: "#FFFFFF",
    bgGradient: "from-neutral-800 to-black",
    defaultTitle: "X / Twitter",
    urlPlaceholder: "https://x.com/username",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    bgGradient: "from-red-500 to-red-700",
    defaultTitle: "YouTube",
    urlPlaceholder: "https://youtube.com/@channel",
  },
  github: {
    id: "github",
    name: "GitHub",
    color: "#FFFFFF",
    bgGradient: "from-neutral-800 to-black",
    defaultTitle: "GitHub",
    urlPlaceholder: "https://github.com/username",
  },
  discord: {
    id: "discord",
    name: "Discord",
    color: "#5865F2",
    bgGradient: "from-indigo-500 to-indigo-700",
    defaultTitle: "Discord Server / Profile",
    urlPlaceholder: "https://discord.gg/...",
  },
  snapchat: {
    id: "snapchat",
    name: "Snapchat",
    color: "#FFFC00",
    bgGradient: "from-yellow-300 to-yellow-500",
    defaultTitle: "Snapchat",
    urlPlaceholder: "https://snapchat.com/add/username",
  },
  spotify: {
    id: "spotify",
    name: "Spotify",
    color: "#1ED760",
    bgGradient: "from-emerald-500 to-emerald-700",
    defaultTitle: "Spotify",
    urlPlaceholder: "https://open.spotify.com/artist/...",
  },
  behance: {
    id: "behance",
    name: "Behance",
    color: "#1769FF",
    bgGradient: "from-blue-500 to-blue-700",
    defaultTitle: "Behance Portfolio",
    urlPlaceholder: "https://behance.net/username",
  },
  dribbble: {
    id: "dribbble",
    name: "Dribbble",
    color: "#EA4C89",
    bgGradient: "from-pink-500 to-rose-600",
    defaultTitle: "Dribbble",
    urlPlaceholder: "https://dribbble.com/username",
  },
  twitch: {
    id: "twitch",
    name: "Twitch",
    color: "#9146FF",
    bgGradient: "from-purple-500 to-purple-700",
    defaultTitle: "Twitch Stream",
    urlPlaceholder: "https://twitch.tv/username",
  },
  calendly: {
    id: "calendly",
    name: "Calendly / حجز موعد",
    color: "#006BFF",
    bgGradient: "from-blue-500 to-cyan-500",
    defaultTitle: "احجز جلسة استشارة",
    urlPlaceholder: "https://calendly.com/username",
  },
  store: {
    id: "store",
    name: "متجر إلكتروني / Store",
    color: "#F59E0B",
    bgGradient: "from-amber-400 to-orange-500",
    defaultTitle: "متجري الإلكتروني",
    urlPlaceholder: "https://mystore.com",
  },
  website: {
    id: "website",
    name: "موقع إلكتروني / Website",
    color: "#06FFF0",
    bgGradient: "from-cyan-400 to-blue-500",
    defaultTitle: "الموقع الإلكتروني الرسمي",
    urlPlaceholder: "https://mywebsite.com",
  },
};

export function PlatformIcon({ 
  platform, 
  className = "w-5 h-5",
  colored = false 
}: { 
  platform?: string; 
  className?: string;
  colored?: boolean;
}) {
  const p = (platform || "website").toLowerCase();

  switch (p) {
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke={colored ? "url(#ig-grad)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="25%" stopColor="#fd5949" />
              <stop offset="50%" stopColor="#d6249f" />
              <stop offset="100%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      );

    case "tiktok":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#00f2fe" : "currentColor"}>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.48c1.77-1.74 2.1-4.28 2.1-6.72V7.93a8.28 8.28 0 0 0 4.67 1.45V6.01a4.83 4.83 0 0 1-1-.02z"/>
        </svg>
      );

    case "whatsapp":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#25D366" : "currentColor"}>
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.676.15s-.777.98-.952 1.18-.351.226-.652.075a8.214 8.214 0 0 1-2.418-1.492 9.07 9.07 0 0 1-1.674-2.083c-.176-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.151-.176.201-.301.301-.502.101-.2.05-.377-.025-.527s-.677-1.633-.928-2.235c-.244-.587-.493-.507-.677-.517h-.578c-.201 0-.527.075-.803.377s-1.054 1.03-1.054 2.511c0 1.481 1.079 2.912 1.23 3.113.15.201 2.124 3.243 5.146 4.548.719.311 1.28.497 1.718.636.723.23 1.381.197 1.901.12.579-.087 1.78-.727 2.031-1.431.251-.703.251-1.306.176-1.431-.076-.125-.276-.201-.577-.351zM12.004 2C6.48 2 2 6.48 2 12c0 1.766.46 3.425 1.267 4.871L2 22l5.244-1.233A9.957 9.957 0 0 0 12.004 22c5.523 0 10-4.48 10-10s-4.477-10-10-10z"/>
        </svg>
      );

    case "telegram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#229ED9" : "currentColor"}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      );

    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#1877F2" : "currentColor"}>
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );

    case "linkedin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#0A66C2" : "currentColor"}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z"/>
        </svg>
      );

    case "twitter":
    case "x":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );

    case "youtube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#FF0000" : "currentColor"}>
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );

    case "github":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      );

    case "discord":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#5865F2" : "currentColor"}>
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      );

    case "snapchat":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#FFFC00" : "currentColor"}>
          <path d="M12.001 2.25c-4.47 0-6.84 3.09-6.84 5.88 0 .84.3 1.83.69 2.52.09.15.12.33.06.48-.12.3-.63.78-1.5.87-.27.03-.45.24-.45.51 0 .21.15.42.36.48 1.2.36 1.74.84 1.77 1.29.03.36-.18.84-.75 1.56-.72.93-.93 1.59-.93 2.13 0 .78.57 1.47 1.44 1.83.99.42 2.37.54 3.42.6.27.03.45.18.57.36.27.39.81.99 1.62.99.39 0 .78-.15 1.14-.39.42-.27.84-.39 1.2-.39.39 0 .81.12 1.23.39.36.24.75.39 1.14.39.81 0 1.35-.6 1.62-.99.12-.18.3-.33.57-.36 1.05-.06 2.43-.18 3.42-.6.87-.36 1.44-1.05 1.44-1.83 0-.54-.21-1.2-.93-2.13-.57-.72-.78-1.2-.75-1.56.03-.45.57-.93 1.77-1.29.21-.06.36-.27.36-.48 0-.27-.18-.48-.45-.51-.87-.09-1.38-.57-1.5-.87-.06-.15-.03-.33.06-.48.39-.69.69-1.68.69-2.52 0-2.79-2.37-5.88-6.84-5.88z"/>
        </svg>
      );

    case "spotify":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#1ED760" : "currentColor"}>
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.303c-.218.358-.686.473-1.044.255-2.865-1.75-6.471-2.146-10.72-1.176-.41.093-.814-.168-.907-.577-.093-.41.168-.813.577-.906 4.654-1.063 8.647-.611 11.84 1.336.357.218.472.686.254 1.068zm1.47-3.266c-.276.449-.864.593-1.313.318-3.28-2.016-8.28-2.599-12.16-1.421-.506.153-1.042-.136-1.195-.642-.153-.507.136-1.043.642-1.196 4.43-1.343 9.94-.694 13.708 1.628.449.275.593.864.318 1.313zm.126-3.411c-3.934-2.336-10.428-2.551-14.205-1.404-.602.183-1.24-.165-1.423-.767-.182-.603.166-1.24.768-1.423 4.333-1.316 11.493-1.063 16.023 1.626.544.323.722 1.028.4 1.572-.323.543-1.028.721-1.563.396z"/>
        </svg>
      );

    case "behance":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#1769FF" : "currentColor"}>
          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.971 3-3.469 0-5.5-2.656-5.5-5.781 0-3.328 2.266-5.781 5.484-5.781 3.25 0 4.984 2.375 4.984 5.375 0 .422-.047.859-.094 1.188h-7.609c.078 1.625 1.297 2.766 2.875 2.766 1.484 0 2.219-.797 2.547-1.484l2.284.717zm-4.984-5.328c-.047-1.156-.844-2.063-2.141-2.063-1.328 0-2.188.891-2.344 2.063h4.485zm-10.742 8.328h-8v-16h8.219c2.313 0 4.094.672 4.094 3.328 0 1.547-.797 2.625-2.047 3.094 1.656.469 2.5 1.844 2.5 3.594 0 2.922-2.125 5.984-4.766 5.984zm-5-9h4.375c1.125 0 2.047-.563 2.047-1.688 0-1.172-.922-1.719-2.047-1.719h-4.375v3.407zm0 6h4.609c1.281 0 2.297-.688 2.297-2 0-1.359-1.016-2-2.297-2h-4.609v4z"/>
        </svg>
      );

    case "dribbble":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#EA4C89" : "currentColor"}>
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.198 11.233c-.027-.376-.078-.748-.153-1.116-2.52.482-5.467.436-8.541-.186-.233-.047-.464-.097-.693-.151 1.776-3.218 3.197-6.071 3.992-8.08 3.146 1.706 5.342 5.068 5.395 8.533zm-7.072-8.817c-.779 1.954-2.164 4.733-3.896 7.869-3.791-1.391-7.143-3.284-9.351-5.304 2.202-2.195 5.253-3.555 8.625-3.555 1.637 0 3.189.317 4.622.99zm-13.064 4.887c2.257 2.052 5.674 3.982 9.537 5.405-.285.733-.591 1.488-.916 2.261-4.004-1.289-7.859-1.442-10.74-.469-.047-.384-.075-.774-.075-1.171 0-2.221.782-4.265 2.194-5.926zm2.753 13.902c-.759-.441-1.455-.98-2.072-1.599 2.585-.824 6.096-.642 9.774.524-1.242 2.656-2.457 4.707-3.411 6.136-1.579-.908-2.999-2.825-4.291-5.061zm6.758 5.765c.954-1.411 2.148-3.412 3.376-6.007 2.871.865 5.267 2.298 6.643 4.093-2.316 2.046-5.385 3.289-8.744 3.289-.434 0-.862-.021-1.275-.062zm7.643-3.151c-1.399-1.745-3.782-3.141-6.623-4.012.247-.611.486-1.218.713-1.817 3.328.653 6.551.688 9.324.137-.417 2.215-1.638 4.14-3.414 5.692z"/>
        </svg>
      );

    case "twitch":
      return (
        <svg className={className} viewBox="0 0 24 24" fill={colored ? "#9146FF" : "currentColor"}>
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
        </svg>
      );

    case "calendly":
      return <Calendar className={className} style={{ color: colored ? "#006BFF" : undefined }} />;

    case "store":
      return <ShoppingBag className={className} style={{ color: colored ? "#F59E0B" : undefined }} />;

    case "website":
    default:
      return <Globe className={className} style={{ color: colored ? "#06FFF0" : undefined }} />;
  }
}
