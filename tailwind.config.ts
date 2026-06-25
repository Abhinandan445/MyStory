import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#050505",
        blush: "#f6a6c9",
        lavender: "#c7b7ff",
        ice: "#9ddcff"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(157, 220, 255, 0.18)",
        blush: "0 0 70px rgba(246, 166, 201, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
