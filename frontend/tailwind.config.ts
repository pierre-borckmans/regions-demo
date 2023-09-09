import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(5px) rotateZ(2deg)" },
          "50%": { transform: "translateX(-5px) rotateZ(0deg)" },
          "75%": { transform: "translateX(5px) rotateZ(-2deg)" },
          "100%": { transform: "translateX(0)" },
        },
        poke: {
          "0%": { transform: "scale(1.0) rotateZ(0deg)" },
          "50%": { transform: "scale(1.30) rotateZ(2deg)" },
          "100%": { transform: "scale(1.0) rotateZ(0deg)" },
        },
      },
      animation: {
        poke: "poke 350ms ease-out",
        shake: "shake 200ms ease-out",
      },
      screens: {
        xl: "1170px",
      },
    },
  },
  plugins: [],
} satisfies Config;
