import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  theme: {
    extend: {
      colors: {

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        chambray: {
          50: '#f2f7fc',
          100: '#e2edf7',
          200: '#cce0f1',
          300: '#a8cce8',
          400: '#7fb1db',
          500: '#6196d0',
          600: '#4d7dc3',
          700: '#436bb2',
          800: '#38538a',
          900: '#344b74',
          950: '#232f48',
        },
      },
    },
    fontFamily: {
      display: ["var(--font-display)"],
       sans: ["var(--font-body)"],
       mono: ["var(--font-mono)"],
       }
  },
  plugins: [

    require("tailwindcss-animate")
  ],
  
};
export default config;
