/**
 * Design Tokens for JalSuraksha — UP Historical & Water Resource Atlas
 * Modeled on BharatRajya.com interactive time-based atlas.
 * Dark-first design, deep slate-navy (#0f172a), saffron/amber accent (#f59e0b),
 * color-blind safe categorical fills, serif display headings, and clean UI sans.
 */

export const tokens = {
  // Theme Palettes
  theme: {
    dark: {
      bg: {
        canvas: "#111820",       // India.gov.in-inspired dark navy-black canvas
        card: "#1B2632",         // Card surface
        elevated: "#243342",     // Elevated modals & tooltips
        overlay: "rgba(17, 24, 32, 0.88)",
        input: "#16202A",
      },
      text: {
        primary: "#F0F4F8",      // High contrast primary text
        secondary: "#B2C0CE",    // Secondary text
        muted: "#B2C0CE",        // Muted text
        faint: "#6C7D8F",        // Faint text
      },
      border: {
        subtle: "#243342",
        default: "#344353",      // Slate border
        active: "#F2A65A",       // Saffron accent
      },
    },
    light: {
      bg: {
        canvas: "#F5F7FA",       // India.gov.in-inspired light canvas
        card: "#FFFFFF",         // Pure white surface
        elevated: "#F0F4F8",     // Elevated panels
        overlay: "rgba(245, 247, 250, 0.90)",
        input: "#F0F4F8",
      },
      text: {
        primary: "#202B38",      // Deep navy-charcoal primary text
        secondary: "#586779",    // Secondary text
        muted: "#586779",        // Muted text
        faint: "#8392A5",        // Faint text
      },
      border: {
        subtle: "#E9ECEF",
        default: "#DCE3EA",      // Crisp border
        active: "#E88B2A",       // Saffron accent
      },
    },
  },

  // Interactive Accent - Saffron / Amber
  accent: {
    light: "#fbbf24",          // Amber 400
    primary: "#f59e0b",        // Amber 500 (Primary interactive)
    hover: "#d97706",          // Amber 600
    dark: "#b45309",           // Amber 700
    glow: "rgba(245, 158, 11, 0.25)",
  },

  // Color-Blind Distinguishable Categorical Palette (Okabe-Ito / Tol inspired)
  // Used for distinct polities, empires, and water stress categories across maps
  categorical: {
    orange: "#e69f00",         // Maurya / Delhi Sultanate / Critical Risk
    skyBlue: "#56b4e9",        // Harappan / British Provinces / Abundant Aquifer
    bluishGreen: "#009e73",    // Kushan / Post-1947 India / Safe Water Zone
    yellow: "#f0e442",         // Shunga / Nawabs of Awadh / Semi-Critical
    blue: "#0072b2",           // Gupta Empire / Ken-Betwa Basin / River Network
    vermilion: "#d55e00",      // Mughal Empire / Over-Exploited / Major Battle
    reddishPurple: "#cc79a7",   // Kanauj Gurjara-Pratihara / Bundelkhand Chandelas
    slateGray: "#708090",      // Autonomous Feudatories / Disputed / Transitional
  },

  // Water Stress & Status Palettes (Preserved from JalSuraksha core)
  waterStatus: {
    safe: {
      bg: "#064e3b",
      border: "#059669",
      text: "#34d399",
      badge: "#10b981",
      label: "Safe / Abundant",
    },
    semiCritical: {
      bg: "#78350f",
      border: "#d97706",
      text: "#fde68a",
      badge: "#f59e0b",
      label: "Semi-Critical",
    },
    critical: {
      bg: "#7c2d12",
      border: "#ea580c",
      text: "#fdba74",
      badge: "#f97316",
      label: "Critical",
    },
    overExploited: {
      bg: "#7f1d1d",
      border: "#dc2626",
      text: "#fca5a5",
      badge: "#ef4444",
      label: "Over-Exploited",
    },
  },

  // Typography
  typography: {
    fontDisplay: "var(--font-playfair), 'Playfair Display', 'Merriweather', 'Cinzel', Georgia, serif",
    fontUi: "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },

  // Standard Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Easing and motion (respects prefers-reduced-motion)
  motion: {
    transitionFast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    transitionNormal: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    transitionSlow: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    mapColorTransition: "fill 0.35s ease, stroke 0.2s ease",
  },
} as const;

export type ThemeMode = "dark" | "light";
export type CategoricalColorKey = keyof typeof tokens.categorical;
