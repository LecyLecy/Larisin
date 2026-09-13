import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      spacing: {
        68: "17rem"
      },
      colors: {
        brand: {
          50: "#effdf6",
          100: "#d9f9e9",
          600: "#11936d",
          700: "#0c7558",
          800: "#095c47"
        },
        warm: {
          100: "#fff1d6",
          500: "#f59e0b"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.07)"
      }
    }
  },
  plugins: []
};

export default config;
