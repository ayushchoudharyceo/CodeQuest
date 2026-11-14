import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'JetBrains Mono'", "Consolas", "Monaco", "monospace"],
      },
      colors: {
        quest: {
          green: "#22c55e",
          greenDark: "#15803d",
          greenLight: "#4ade80",
          blue: "#0ea5e9",
          blueDark: "#0369a1",
          blueLight: "#38bdf8",
          purple: "#a855f7",
          purpleDark: "#7e22ce",
          yellow: "#eab308",
          yellowDark: "#a16207",
          yellowLight: "#fde047",
          red: "#ef4444",
          redDark: "#b91c1c",
          bg: "#0c1117",
          bgDark: "#080c10",
          card: "#161f2c",
          cardHover: "#1d293a",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        "3d-green": "0 4px 0 #15803d",
        "3d-blue": "0 4px 0 #0369a1",
        "3d-purple": "0 4px 0 #7e22ce",
        "3d-yellow": "0 4px 0 #a16207",
        "3d-card": "0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.2)",
        "glow-green": "0 0 20px rgba(34, 197, 94, 0.35)",
        "glow-blue": "0 0 20px rgba(14, 165, 233, 0.35)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.35)",
        "glow-yellow": "0 0 20px rgba(234, 179, 8, 0.35)",
      },
      keyframes: {
        "micro-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "gentle-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        }
      },
      animation: {
        "micro-bounce": "micro-bounce 0.6s ease-in-out infinite",
        "gentle-pulse": "gentle-pulse 2.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
