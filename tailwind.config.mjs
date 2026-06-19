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
        border: "#e8ecf1",
        input: "#e2e8f0",
        ring: "#9b5bf5",
        background: "#ffffff",
        foreground: "#010816",

        primary: {
          DEFAULT: "#9b5bf5",
          foreground: "#f7f9fb",
        },
        secondary: {
          DEFAULT: "#f4f2ff",
          foreground: "#9b5bf5",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#8abcf9",
          foreground: "#0f172a",
        },
        popover: {
          DEFAULT: "#ffffff",
          foreground: "#010816",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#010816",
        },
        warning: "#ffb951",

        // New Brand Scales
        purple: {
          50: "#f3efff",
          100: "#e4dbff",
          200: "#cdbcff",
          300: "#b49cfb",
          400: "#9b5bf5",
          500: "#8f47f4",
          600: "#893ef3",
          700: "#7217f1",
          800: "#4e0aad",
          900: "#2d0565",
        },
        blue: {
          50: "#f0f6fe",
          100: "#e1eefd",
          200: "#d3e5fc",
          300: "#bad8fb",
          400: "#8abcf9",
          500: "#457af6",
          600: "#2362f4",
          700: "#0a48db",
          800: "#083aaf",
          900: "#052a7e",
        },
        orange: {
          50: "#fff8ef",
          100: "#ffecd1",
          200: "#fee2b7",
          300: "#ffd89e",
          400: "#ffb951",
          500: "#feab2d",
          600: "#ffa114",
          700: "#ef8f00",
          800: "#d68000",
          900: "#b76e00",
        },
        "gray-steel": "#6F7B91",

        // New Semantic/Functional Colors
        success: {
          base: "#e6f8f2",
          border: "#25bb89",
        },
        error: {
          base: "#ffeaed",
          border: "#fe4c6a",
        },
        warning: {
          DEFAULT: "#ffb951",
          base: "#fff6ea",
          border: "#ffb951",
        },
        info: {
          base: "#f0f6fe",
          border: "#4595f6",
        },

        // Special Colors
        para: {
          cek: "#38febc",
          yatir: "#fe4c6a",
        },

        // Theme Variables
        theme: {
          bg: "#f4f2ff",
          base: "#ffffff",
          border: {
            light: "#f0f0ef",
            DEFAULT: "#ebebe9",
          },
          text: {
            primary: "#010816",
            body: "#4d5b74",
            secondary: "#6b7a93",
          },
        },
      },

      fontFamily: {
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        satoshi: ["var(--font-satoshi)", "system-ui", "sans-serif"],
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
      backgroundImage: {
        'gradient-button': 'linear-gradient(to left, #3E1C82, #9564F4)',
        'gradient-card': 'linear-gradient(133deg, rgba(21,21,20,1) 70%, rgba(149,100,244,1) 100%)',
        'gradient-modal': {
          DEFAULT: 'linear-gradient(110deg, rgba(149,100,244,1) 0%, rgba(62,28,130,1) 100%)',
          "1": 'linear-gradient(136.7deg, rgba(149,100,244,1) -42.42%, rgba(62,28,130,1) 74.26%)',
        },
      },
    },
  },
};

export default config;
