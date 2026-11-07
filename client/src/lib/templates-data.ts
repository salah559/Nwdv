import { TemplateDefinition } from "@shared/saas-schema";

export const TEMPLATES: TemplateDefinition[] = [
  // ===================== ORIGINAL 12 TEMPLATES =====================
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
  {
    id: "hologram-card",
    name: "Holographic 3D Card",
    description: "Futuristic iridescent collectible card with prismatic rainbow sheen, SSR rarity badge and 3D tilt.",
    isPremium: true,
    originalPriceDZD: 1500,
    priceDZD: 1350,
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
    originalPriceDZD: 1200,
    priceDZD: 1080,
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
    originalPriceDZD: 1400,
    priceDZD: 1260,
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
    originalPriceDZD: 1500,
    priceDZD: 1350,
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
    originalPriceDZD: 1500,
    priceDZD: 1350,
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
    isPremium: false,
    priceDZD: 0,
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
    isPremium: false,
    priceDZD: 0,
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
    isPremium: false,
    priceDZD: 0,
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
    isPremium: false,
    priceDZD: 0,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
    features: [
      "Dynamic flowing mesh gradient",
      "Translucent cards with border glow",
      "Pill-shaped modern links",
      "Lightweight SVG ambient flares"
    ]
  },

  // ===================== 18 NEW EXTENDED TEMPLATES (TOTAL: 30) =====================
  {
    id: "cyberpunk-runner",
    name: "Cyberpunk 2077 Runner",
    description: "High-octane yellow & neon cyan cyberpunk theme with hex avatar and edgy Netrunner vibe.",
    isPremium: true,
    originalPriceDZD: 1500,
    priceDZD: 1350,
    category: "developer",
    thumbnail: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    features: [
      "High-contrast Cyberpunk yellow palette",
      "Hexagonal holographic avatar frame",
      "Animated cyan laser border glow",
      "Netrunner status beacon"
    ]
  },
  {
    id: "midnight-sakura",
    name: "Midnight Sakura Tokyo",
    description: "Dreamy neon pink and violet Tokyo nightscape with gentle sakura petals glow.",
    isPremium: true,
    originalPriceDZD: 1200,
    priceDZD: 1080,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
    features: [
      "Tokyo neon pink & purple atmosphere",
      "Floating sakura ambient particles",
      "Soft glassmorphism link cards",
      "Japan-inspired aesthetic typography"
    ]
  },
  {
    id: "matrix-terminal",
    name: "Matrix Source Code",
    description: "Iconic phosphor green matrix rain vibe, terminal font, and hacker credentials.",
    isPremium: true,
    originalPriceDZD: 1200,
    priceDZD: 1080,
    category: "developer",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    features: [
      "Phosphor CRT green terminal styling",
      "Command prompt badges and monospace layout",
      "Encrypted source code border glow",
      "Root sysadmin status beacon"
    ]
  },
  {
    id: "emerald-royalty",
    name: "Emerald Royalty VIP",
    description: "Prestigious deep emerald green and 24K gold accents for sovereign wealth and high net-worth brands.",
    isPremium: true,
    originalPriceDZD: 1600,
    priceDZD: 1440,
    category: "luxury",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    features: [
      "Deep imperial emerald & gold leaf palette",
      "Serif classical regal typography",
      "Prestige VIP membership tag",
      "Ultra-high net worth executive cards"
    ]
  },
  {
    id: "sunset-boulevard",
    name: "Sunset Boulevard Glow",
    description: "Warm California golden hour gradients with radiant amber, coral, and violet tones.",
    isPremium: false,
    priceDZD: 0,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    features: [
      "Golden hour gradient waves",
      "Warm amber glow micro-interactions",
      "Pacific Highway creative vibe",
      "Squircle avatar frame"
    ]
  },
  {
    id: "deep-space-orbit",
    name: "Deep Space Orbit",
    description: "Cosmic nebula background with Apollo orbit vectors, deep navy blues, and cyan stars.",
    isPremium: true,
    originalPriceDZD: 1300,
    priceDZD: 1170,
    category: "developer",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    features: [
      "Deep space nebula ambient lighting",
      "Orbital velocity satellite tags",
      "Cyan starlight border highlights",
      "Aerospace engineer inspired layout"
    ]
  },
  {
    id: "nordic-frost",
    name: "Nordic Minimalist Frost",
    description: "Calm Scandinavian winter aesthetic with frosted ice borders, muted grays and arctic blues.",
    isPremium: false,
    priceDZD: 0,
    category: "minimal",
    thumbnail: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=600&q=80",
    features: [
      "Ultra-clean Scandinavian layout",
      "Subtle frosted arctic border tints",
      "Free to use for all members",
      "Zero clutter focus on links"
    ]
  },
  {
    id: "silicon-pitch",
    name: "Silicon Valley Tech Founder",
    description: "Tailored for startup founders, YC alumni, and venture-backed creators with indigo accents.",
    isPremium: true,
    originalPriceDZD: 1300,
    priceDZD: 1170,
    category: "business",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    features: [
      "Indigo & cyan venture capital aesthetic",
      "Series A tech founder credentials",
      "Investor pitch deck presentation feel",
      "Crisp enterprise card hover states"
    ]
  },
  {
    id: "marble-architecture",
    name: "Milano Marble & Stone",
    description: "Italian architectural luxury with warm travertine stone textures and editorial serif type.",
    isPremium: true,
    originalPriceDZD: 1400,
    priceDZD: 1260,
    category: "luxury",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
    features: [
      "Editorial architecture & interior vibe",
      "Milano warm stone & travertine tones",
      "Refined classical serif headings",
      "Minimalist bespoke border detailing"
    ]
  },
  {
    id: "synthwave-1984",
    name: "Synthwave 1984 Miami",
    description: "Retro outrun aesthetic with fuchsia neon, cyan laser grids, and 80s arcade nostalgia.",
    isPremium: true,
    originalPriceDZD: 1300,
    priceDZD: 1170,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    features: [
      "80s Miami Outrun synthwave vibe",
      "Hot pink & electric cyan laser grid",
      "Retro arcade title typography",
      "Dynamic neon pulsing avatar ring"
    ]
  },
  {
    id: "monolith-matte",
    name: "Monolith Pitch Black",
    description: "Stealth obsidian matte black canvas with pure white type. The ultimate understated power profile.",
    isPremium: false,
    priceDZD: 0,
    category: "minimal",
    thumbnail: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=600&q=80",
    features: [
      "Deep matte obsidian black (#030303)",
      "High contrast pure white typography",
      "Free for all users",
      "Fastest load time profile card"
    ]
  },
  {
    id: "swiss-typo",
    name: "Swiss International Style",
    description: "Bold International Typographic Style with stark red accents and geometric Swiss precision.",
    isPremium: true,
    originalPriceDZD: 1200,
    priceDZD: 1080,
    category: "business",
    thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80",
    features: [
      "Zurich graphic design archive inspired",
      "Stark Swiss red (#ef4444) signature accents",
      "Bauhaus grid alignment",
      "Strong punchy sans-serif typography"
    ]
  },
  {
    id: "electric-violet",
    name: "Electric Violet & Purple",
    description: "Deep nocturnal violet glow with luminous lavender and purple nebula highlights.",
    isPremium: true,
    originalPriceDZD: 1100,
    priceDZD: 990,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    features: [
      "Rich ultraviolet night club palette",
      "Lavender & violet border radiance",
      "Smooth liquid translucent cards",
      "Perfect for streamers and music creators"
    ]
  },
  {
    id: "crypto-ledger",
    name: "Web3 Crypto & Solana",
    description: "Decentralized Web3 aesthetic with purple & teal gradients, smart contract hash badges.",
    isPremium: true,
    originalPriceDZD: 1400,
    priceDZD: 1260,
    category: "developer",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80",
    features: [
      "Solana purple & teal blockchain colors",
      "Hexagonal validator avatar badge",
      "Decentralized identity beacon",
      "Crypto wallet & Web3 ready"
    ]
  },
  {
    id: "sahara-mirage",
    name: "Sahara Golden Dunes",
    description: "Warm desert gold, copper, and bronze sands reflecting the warmth of North African majesty.",
    isPremium: true,
    originalPriceDZD: 1300,
    priceDZD: 1170,
    category: "luxury",
    thumbnail: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    features: [
      "Desert dunes warm copper & bronze palette",
      "Oasis shimmer gold card borders",
      "North African cultural warmth",
      "Serif regal title styling"
    ]
  },
  {
    id: "manga-ink",
    name: "Tokyo Manga & Anime Ink",
    description: "Sharp black ink screentone style with vibrant crimson rose highlights inspired by Japanese manga.",
    isPremium: true,
    originalPriceDZD: 1200,
    priceDZD: 1080,
    category: "creative",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
    features: [
      "Japanese manga screentone vibe",
      "Crimson rose dynamic action borders",
      "Anime creator & illustrator layout",
      "High energy hover micro-interactions"
    ]
  },
  {
    id: "linux-kernel",
    name: "Linux Kernel Hacker",
    description: "Terminal orange and amber phosphors built for open-source contributors and sysadmins.",
    isPremium: true,
    originalPriceDZD: 1200,
    priceDZD: 1080,
    category: "developer",
    thumbnail: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80",
    features: [
      "Amber CRT phosphor monitor aesthetic",
      "Root compiler & Bash script styling",
      "Open source contributor badge",
      "Monospace syntax highlights"
    ]
  },
  {
    id: "platinum-executive",
    name: "Platinum Banking & Law",
    description: "Distinguished corporate layout for legal advisors, managing partners, and wealth managers.",
    isPremium: true,
    originalPriceDZD: 1500,
    priceDZD: 1350,
    category: "business",
    thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    features: [
      "Swiss private banking platinum palette",
      "Authoritative executive presence",
      "Crisp corporate credentials",
      "Direct phone & email quick actions"
    ]
  },

  // ===================== 💎 DIAMOND TIER TEMPLATES =====================
  {
    id: "baryon-anime-live",
    name: "Baryon Anime Live (Pinterest)",
    description: "قالب الأنمي الملحمي من Pinterest: فيديو سينمائي حي متحرك (Naruto Baryon Mode) مع جزيئات لهب وطاقة نارية متوهجة وتأثيرات فائقة الحيوية.",
    isPremium: true,
    originalPriceDZD: 2500,
    priceDZD: 2250,
    category: "diamond",
    thumbnail: "https://i.pinimg.com/736x/6d/0b/91/6d0b91e0dec528e44d5557a8b38ab443.jpg",
    features: [
      "فيديو حي سينمائي متكرر في الخلفية (Live Video Background)",
      "جزيئات لهب نارية صاعدة بفيزياء عشوائية",
      "أفاتار بنبض ناري نفاث وحلقة طاقة دوارة",
      "بطاقات داكنة بأطراف نارية متوهجة عند التحويم",
      "مستوحى ومبني بالكامل على رابط Pinterest"
    ]
  },
  {
    id: "custom-wallpaper-hero",
    name: "Custom Wallpaper Hero (خلفيتك الخاصة)",
    description: "خلفية الزبون تصبح هي خلفية القالب بالكامل: صورة الغلاف التي ترفعها تملأ الشاشة مع تظليل ناعم وبطاقات زجاجية ثلاثية الأبعاد.",
    isPremium: true,
    originalPriceDZD: 2500,
    priceDZD: 2250,
    category: "diamond",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    features: [
      "صورة الغلاف (Cover Photo) تملأ الخلفية بالكامل",
      "تدرج مظلم ذكي يضمن قراءة الروابط بكل دقة",
      "إطار أفاتار زجاجي ثلاثي الأبعاد فخم",
      "بطاقات زجاجية بلورية Frosted Glass عالية النقاء",
      "تفاعلات Hover ناعمة مع وميض شفاف"
    ]
  },
  {
    id: "reactbits-spotlight",
    name: "ReactBits Spotlight Bento",
    description: "تأثير Spotlight الشهير من مكتبة React Bits: شعاع ضوء سحري يتحرك ويتفاعل مع مؤشر الفأرة ليضيء البطاقات والزجاج المظلم.",
    isPremium: true,
    originalPriceDZD: 2500,
    priceDZD: 2250,
    category: "diamond",
    thumbnail: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
    features: [
      "شعاع إضاءة تفاعلي يتبع حركة الفأرة (Spotlight Effect)",
      "شبكة هندسية رقمية فائقة الدقة في الخلفية",
      "بطاقات بنمط Bento Box الحديث مع توهج داخلي",
      "أفاتار محاط بهالة ضوئية بنفسجية متدرجة",
      "مبني بأحدث ممارسات تصميم React Bits"
    ]
  },
  {
    id: "reactbits-aurora-mesh",
    name: "ReactBits Aurora Mesh",
    description: "شفق قطبي مائع ثلاثي الأبعاد من React Bits: تدرجات لونية شفقية حية تدور بنعومة هادئة مع بطاقات زجاجية بلورية متألقة.",
    isPremium: true,
    originalPriceDZD: 2500,
    priceDZD: 2250,
    category: "diamond",
    thumbnail: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80",
    features: [
      "شفق قطبي حي دوار ثلاثي الأبعاد (Mesh Gradient)",
      "ألوان شفقية متناسقة (أزرق سماوي، بنفسجي، زمردي)",
      "بطاقات زجاجية ذات انعكاسات ضوئية شفافة",
      "إطار أفاتار ناعم محاط بوهج نيون سماوي",
      "مظهر مستقبلي مريح للعين فائق النقاء"
    ]
  },
  {
    id: "cyberpunk-hologram-hud",
    name: "Cyberpunk Hologram HUD",
    description: "واجهة سايبربانك هولوغرافية ثلاثية الأبعاد: مستوحاة من عوالم السايبرنتك وReact Bits مع خطوط ليزرية ومؤشرات نظام رقمية.",
    isPremium: true,
    originalPriceDZD: 2500,
    priceDZD: 2250,
    category: "diamond",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    features: [
      "خطوط ليزرية ومسح هولوغرافي تفاعلي في الخلفية",
      "إطار أفاتار بنمط HUD مستقبل مع حلقة دوران تقنية",
      "بطاقات بأرقام نظام ومؤشرات سيان كهربائية متوهجة",
      "خطوط تقنية رقمية بطابع الوكالات المستقبلية",
      "تأثيرات Hover كهربائية عالية الاستجابة"
    ]
  },
  // ===================== STORE & E-COMMERCE PORTFOLIO TEMPLATES =====================
  {
    id: "store-minimal-boutique",
    name: "Store Minimal Boutique",
    description: "متجر أنيق وعصري للملابس، الإكسسوارات، والعطور مع سلة تسوق ونظام إنهاء طلب سريع.",
    isPremium: false,
    priceDZD: 0,
    category: "store",
    thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80",
    features: [
      "سلة مشتريات عائمة وسلسة للهاتف",
      "استمارة طلب فورية (الاسم، الهاتف، الولاية)",
      "دعم الدفع عند الاستلام (COD)",
      "شريط إعلانات وتخفيضات أعلى المتجر"
    ]
  },
  {
    id: "store-cyber-tech",
    name: "Store Cyber Tech & Gadgets",
    description: "تصميم تقني ومستقبلي فائق التطور مخصص للإلكترونيات، الهواتف الذكية ومستلزمات الحواسيب والجيمنج.",
    isPremium: true,
    originalPriceDZD: 2200,
    priceDZD: 1980,
    category: "store",
    thumbnail: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80",
    features: [
      "مظهر سايبربانك نيون وإضاءة HUD متطورة",
      "أزرار تفاعلية وشارات تقنية للمواصفات",
      "نظام إضافة للسلة وحساب فوري للمجموع",
      "توافق فائق السرعة مع شاشات الهواتف"
    ]
  },
  {
    id: "store-luxury-brand",
    name: "Store Luxury Brand & Atelier",
    description: "إطلالة ملكية فخمة بلون الذهب والأسود الملكي، مصممة للمجوهرات، العطور الراقية والساعات الثمينة.",
    isPremium: true,
    originalPriceDZD: 2500,
    priceDZD: 2250,
    category: "store",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    features: [
      "تدرجات ذهبية راقية وإطارات زجاجية فخمة",
      "أزرار طلب ذهبية مع لمعان ناعم",
      "شعار VIP وضمان الأصالة المعتمد",
      "تجربة تسوق فاخرة ترفع قيمة منتجاتك"
    ]
  },
  {
    id: "store-organic-nature",
    name: "Store Organic & Bio Nature",
    description: "طابع طبيعي ناعم ومريح باللون الأخضر والأعشاب، مثالي لمستحضرات التجميل العضوية، العسل والزيوت الطبيعية.",
    isPremium: false,
    priceDZD: 0,
    category: "store",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    features: [
      "ألوان ترابية وخضراء مريحة للنفس وللعين",
      "شارات منتج طبيعي 100% وضمان الجودة",
      "بطاقات منتجات بلمسة هادئة وجذابة",
      "نظام فلترة وتصنيفات سهل للزبائن"
    ]
  },
  {
    id: "store-streetwear-bold",
    name: "Store Streetwear & Sneaker Drop",
    description: "أسلوب جريء وحيوي بطابع أزياء الشارع، مصمم لبراندات الملابس الشبابية والأحذية العصرية دروب.",
    isPremium: true,
    originalPriceDZD: 2200,
    priceDZD: 1980,
    category: "store",
    thumbnail: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80",
    features: [
      "تايبوغرافي عريض وتصميم مستوحى من الماركات العالمية",
      "أزرار هجومية بارزة للشراء والطلب السريع",
      "عداد تنازلي وشارات نفاذ الكمية الحصرية",
      "تجربة تسوق ملهمة ومحبوبة لدى الشباب"
    ]
  },
  {
    id: "store-instant-catalog",
    name: "Store Instant Catalog & Wholesale",
    description: "كتالوج سريع وواضح للتجار، الحرفيين والبيع بالجملة مع قائمة أسعار مباشرة وتوصيل لـ 58 ولاية.",
    isPremium: false,
    priceDZD: 0,
    category: "store",
    thumbnail: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
    features: [
      "عرض كتالوج سريع ومنظم للمنتجات",
      "زر طلب فوري واستفسار مباشر عبر واتساب",
      "دعم الكميات وأسعار الجملة والتجزئة",
      "سرعة فائقة وخفة تحميل على أضعف شبكة إنترنت"
    ]
  }
];

export function getTemplateById(id: string): TemplateDefinition {
  return TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
}
