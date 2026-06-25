/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  // Dark mode via `.dark` class
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        sm: "24px",
        lg: "32px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1280px",
      },
    },
    extend: {
      borderRadius: {
        none: "0",
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        full: "9999px",
      },
      colors: {
        // ── Bitanova dark design tokens (Figma: Colors page 52609-3435) ──
        border: "#3A4043", // System/Border
        input: "#3A4043",
        ring: "#C7F022", // Lime focus ring
        background: "#1F2628", // System/Background
        foreground: "#F4F7F8", // System/Text (White)

        // Primary — Orange (#F54A14)
        primary: {
          DEFAULT: "#F54A14",
          foreground: "#F4F7F8",
          50: "#FFF4ED",
          100: "#FEE6D6",
          200: "#FDC9AB",
          300: "#FBA376",
          400: "#F8733F",
          500: "#F54A14",
          600: "#E63510",
          700: "#BF240F",
          800: "#981F14",
          900: "#7A1D14",
        },
        // Secondary — Teal (#84E9E8)
        secondary: {
          DEFAULT: "#84E9E8",
          foreground: "#0E0F10",
          50: "#EEFDFC",
          100: "#D5F8F7",
          200: "#D3F7F7",
          300: "#BBF3F2",
          400: "#A2EEEE",
          500: "#84E9E8",
          600: "#1D949D",
          700: "#1E7780",
          800: "#216169",
          900: "#1F515A",
        },
        destructive: {
          DEFAULT: "#FF4D6D",
          foreground: "#F4F7F8",
        },
        muted: {
          DEFAULT: "#1F2628",
          foreground: "#C5C9CC", // System/Body Text + Icon
        },
        accent: {
          DEFAULT: "#C7F022", // Lime/300*
          foreground: "#0E0F10",
        },
        popover: {
          DEFAULT: "#0E0F10",
          foreground: "#F4F7F8",
        },
        card: {
          DEFAULT: "#0E0F10", // System/Base (Black)
          foreground: "#F4F7F8",
        },

        // ── Brand scales ──
        // Orange == Primary
        orange: {
          50: "#FFF4ED",
          100: "#FEE6D6",
          200: "#FDC9AB",
          300: "#FBA376",
          400: "#F8733F",
          500: "#F54A14",
          600: "#E63510",
          700: "#BF240F",
          800: "#981F14",
          900: "#7A1D14",
        },
        // Teal == Secondary
        teal: {
          50: "#EEFDFC",
          100: "#D5F8F7",
          200: "#D3F7F7",
          300: "#BBF3F2",
          400: "#A2EEEE",
          500: "#84E9E8",
          600: "#1D949D",
          700: "#1E7780",
          800: "#216169",
          900: "#1F515A",
        },
        lime: {
          50: "#F6FCDD",
          100: "#EDF9B8",
          200: "#E0F57E",
          300: "#C7F022", // main accent
          400: "#B6DA2F",
          500: "#8FAF2A",
          600: "#5F7F32",
          700: "#3F5F3A",
          800: "#2B4A3F",
          900: "#193133",
        },
        green: {
          50: "#EAFFF6",
          100: "#CFFFEA",
          200: "#A8FBE0",
          300: "#7CF5D6",
          400: "#4DEFC0",
          500: "#2FE3AF",
          600: "#27E9A6", // main success
          700: "#1FBF8C",
          800: "#148066",
          900: "#0B3D35",
        },
        // Purple — transitional ("DEĞİŞECEK"), kept for legacy refs
        purple: {
          50: "#F0F1FF",
          100: "#DADBFF",
          200: "#B8BBFF",
          300: "#9FA3FE",
          400: "#8F93FE",
          500: "#6E72F5",
          600: "#5F63EE",
          700: "#565BEF",
          800: "#4549D6",
          900: "#2F319E",
        },
        blue: {
          50: "#F2F7FE",
          100: "#E3EEFD",
          200: "#D4E6FC",
          300: "#C0DAFB",
          400: "#8ABCF9",
          500: "#487AF6",
          600: "#3F67D8",
          700: "#3456B3",
          800: "#2B458C",
          900: "#213563",
        },
        "gray-steel": "#5E666A",
        surface: "#191D1E", // Elevated dark surface (footer, tab rail)

        // ── System (dark) ──
        system: {
          bg: "#1F2628", // Background
          base: "#0E0F10", // Base / Black
          border: "#3A4043", // Border
          text: "#F4F7F8", // Text (White)
          body: "#C5C9CC", // Body Text + Icon
          secondary: "#5E666A", // Secondary Text
        },

        // ── State / Functional ──
        success: {
          DEFAULT: "#27E9A6",
          base: "rgba(39, 233, 166, 0.1)",
          border: "#27E9A6",
        },
        error: {
          DEFAULT: "#FF4D6D",
          base: "rgba(255, 77, 109, 0.05)",
          border: "#FF4D6D",
        },
        warning: {
          DEFAULT: "#FFD951",
          base: "rgba(255, 217, 81, 0.1)",
          border: "#FFD951",
          icon: "#E2B308",
          title: "#0F121A",
        },
        info: {
          DEFAULT: "#487AF6",
          base: "rgba(72, 122, 246, 0.1)",
          border: "#487AF6",
        },

        // ── Special ──
        para: {
          cek: "#27E9A6", // Para Çek
          yatir: "#FF4D6D", // Para Yatır
        },

        // ── Theme Variables (dark) ──
        theme: {
          bg: "#1F2628",
          base: "#0E0F10",
          border: {
            light: "#3A4043",
            DEFAULT: "#3A4043",
          },
          text: {
            primary: "#F4F7F8",
            body: "#C5C9CC",
            secondary: "#5E666A",
          },
        },
      },

      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        satoshi: ["var(--font-satoshi)", "system-ui", "sans-serif"],
        sora: ["Sora", "var(--font-satoshi)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "wave-drift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "wave-reveal": {
          "0%": { backgroundPosition: "0% 50%", opacity: "0" },
          "100%": { backgroundPosition: "100% 50%", opacity: "0.5" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "wave-drift": "wave-drift 16s ease-in-out infinite",
        "wave-reveal": "wave-reveal 2.4s ease-in-out forwards",
        shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
      },
      boxShadow: {
        'card-dark': '0px 2px 8px 0.3px hsl(var(--border) / 0.2)',
      },
      backgroundImage: {
        'gradient-button': 'linear-gradient(to left, #BF240F, #F54A14)',
        'gradient-card': 'linear-gradient(133deg, rgba(14,15,16,1) 70%, rgba(245,74,20,1) 100%)',
        'gradient-modal': {
          DEFAULT: 'linear-gradient(110deg, rgba(245,74,20,1) 0%, rgba(191,36,15,1) 100%)',
          "1": 'linear-gradient(136.7deg, rgba(245,74,20,1) -42.42%, rgba(191,36,15,1) 74.26%)',
        },
      },
    },
  },
};

export default config;
