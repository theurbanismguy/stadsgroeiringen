import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.{css}", // Ensures styles folder is scanned
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
