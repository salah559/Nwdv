import { TemplateDefinition } from "@shared/saas-schema";

export const TEMPLATES: TemplateDefinition[] = [
  // Free Templates
  {
    id: "modern-minimalist",
    name: "Modern Minimalist",
    description: "Clean, ultra-fast layout focusing on typography, whitespace and seamless mobile experience.",
    isPremium: false,
    priceDZD: 0,
    category: "minimal",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    features: [
      "Ultra-fast loading",
      "High contrast typography",
      "Adaptive dark & light accents",
      "Social links cards"
    ]
  },
  {
    id: "developer-profile",
    name: "Developer Terminal",
    description: "Geek-inspired aesthetic with code syntax vibe, tech tags, and project highlights.",
    isPremium: false,
    priceDZD: 0,
    category: "developer",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    features: [
      "Code badges and tech stack view",
      "GitHub & Dev links prominent",
      "Monospace accents",
      "Interactive status beacon"
    ]
  },
  {
    id: "professional-profile",
    name: "Executive Professional",
    description: "Balanced, authoritative corporate layout designed for consultants, executives, and managers.",
    isPremium: false,
    priceDZD: 0,
    category: "business",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    features: [
      "Curated bio and credentials",
      "Direct vCard / Contact buttons",
      "Corporate neutral palette",
      "Professional badge"
    ]
  },

  // Premium Templates
  {
    id: "hologram-card",
    name: "Holographic 3D Card",
    description: "Futuristic iridescent collectible card with prismatic rainbow sheen, SSR rarity badge and 3D tilt.",
    isPremium: true,
    priceDZD: 1500,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
    features: [
      "Iridescent rainbow foil border shimmer",
      "Dynamic multi-axis 3D tilt physics",
      "Concentric holographic avatar rings",
      "SSR Edition & Level 99 collectible badge"
    ]
  },
  {
    id: "retro-arcade",
    name: "8-Bit Retro Arcade",
    description: "Authentic 80s arcade cabinet experience with CRT scanlines, 8-bit health bars, and pixelated quest links.",
    isPremium: true,
    priceDZD: 1200,
    category: "developer",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80",
    features: [
      "Authentic CRT scanline screen overlay",
      "Interactive HP & MP gaming health meters",
      "Insert Coin credits & 1P Ready marquee",
      "Chiptune quest log & retro arcade styling"
    ]
  },
  {
    id: "audio-equalizer",
    name: "Vinyl Studio & Beats",
    description: "Music producer & DJ studio layout with spinning vinyl record avatar, live EQ spectrum bars, and tracklist links.",
    isPremium: true,
    priceDZD: 1400,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    features: [
      "Spinning 33 RPM vinyl record with avatar center",
      "Multi-frequency animated audio equalizer bars",
      "Studio On-Air beacon & 44.1 kHz Hi-Fi tag",
      "Numbered audio tracklist social cards"
    ]
  },
  {
    id: "cinematic-director",
    name: "Cinematic Film Premiere",
    description: "Anamorphic Hollywood film poster layout with Cannes festival laurels, dramatic spotlights and movie credits.",
    isPremium: true,
    priceDZD: 1500,
    category: "luxury",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    features: [
      "Cinemascope 2.39:1 widescreen aesthetic",
      "Official Selection 2025 festival laurels",
      "Dramatic warm golden spotlights",
      "Hollywood cast & director credits typography"
    ]
  },
  {
    id: "luxury-black-gold",
    name: "Luxury Black & Gold",
    description: "Regal, high-end obsidian black canvas with radiant gold foil gradients and subtle glows.",
    isPremium: true,
    priceDZD: 1500,
    category: "luxury",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    features: [
      "24K Gold gradient borders & typography",
      "Obsidian glassmorphic containers",
      "VIP shimmer animations",
      "Custom premium avatar frame"
    ]
  },
  {
    id: "creative-designer",
    name: "Creative Portfolio",
    description: "Vibrant, dynamic layout with bold colors, artistic typography and lively micro-interactions.",
    isPremium: true,
    priceDZD: 1200,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80",
    features: [
      "Artistic pastel & neon accents",
      "Playful hover physics",
      "Creative banner showcase",
      "Dribbble / Behance / ArtStation ready"
    ]
  },
  {
    id: "neon-developer",
    name: "Cyberpunk Neon",
    description: "Futuristic sci-fi vibe matching the Novaweb cyberpunk DNA with neon glow pulses and scanlines.",
    isPremium: true,
    priceDZD: 1500,
    category: "developer",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    features: [
      "Cyan & Magenta holographic glow",
      "Animated cyber grid background",
      "Glitch-style badge headers",
      "Futuristic interactive audio clicks"
    ]
  },
  {
    id: "elegant-professional",
    name: "Frosted Glass Studio",
    description: "Ultra-sleek frosted glass layout with liquid ambient blur and refined minimalist curves.",
    isPremium: true,
    priceDZD: 1200,
    category: "business",
    thumbnail: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80",
    features: [
      "Layered frosted backdrop filters",
      "Smooth liquid gradient transitions",
      "Clean iconography",
      "Minimalist card structure"
    ]
  },
  {
    id: "modern-gradient",
    name: "Modern Gradient Aurora",
    description: "Fluid aurora borealis color waves with silky smooth UI cards inspired by Stripe and Linear.",
    isPremium: true,
    priceDZD: 1200,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
    features: [
      "Dynamic flowing mesh gradient",
      "Translucent cards with border glow",
      "Pill-shaped modern links",
      "Lightweight SVG ambient flares"
    ]
  }
];

export function getTemplateById(id: string): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
