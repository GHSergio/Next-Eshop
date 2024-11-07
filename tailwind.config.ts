import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        accent: "var(--accent-color)",
        loginBgc: "var(--login-bgc)",
        navbarBgc: "var(--navbar-bgc)",
        navLinkBgc: "var(--nav-link-bgc)",
        navLinkHoverColor: "var(--nav-link-hover-color)",
        navLinkActiveBgc: "var(--nav-link-active-bgc)",
        buttonBgc: "var(--button-bgc)",
        buttonText: "var(--button-color)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        cardBgc: "var(--card-bgc)",
        cardHoverBgc: "var(--card-hover-bgc)",
        iconColor: "var(--icon-color)",
        textColor: "var(--text-color)",
        stepColor: "var(--step-color)",
        borderChecked: "var(--border-checked-color)",
      },
      // 自定義的斷點
      screens: {
        xs: "0px",
        xs1: "321px",
        xs2: "376px",
      },
      fontSize: {
        xxs: "0.625rem", // 10px
      },
      gridTemplateAreas: {
        "product-sm": [
          "empty image title empty",
          "checkbox image color-size empty",
          "checkbox image empty empty",
          "empty image price quantity",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
