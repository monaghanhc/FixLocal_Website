import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 60px rgba(15, 23, 42, 0.10)",
        card: "0 14px 35px rgba(15, 23, 42, 0.08)"
      },
      colors: {
        civic: {
          ink: "#172033",
          blue: "#1e64dd",
          teal: "#0d9488",
          amber: "#f59e0b",
          coral: "#f9735b",
          mint: "#d8f5ec",
          paper: "#f8fafc"
        }
      }
    }
  },
  plugins: []
};

export default config;
