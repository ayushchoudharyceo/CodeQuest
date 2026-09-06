import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          green: "#58cc02",
          greenDark: "#46a302",
          blue: "#1cb0f6",
          blueDark: "#1899d6",
          yellow: "#ffc800",
          red: "#ff4b4b",
          bg: "#131f24",
          card: "#1e2c33",
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
      },
      keyframes: {
        "micro-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "micro-bounce": "micro-bounce 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
