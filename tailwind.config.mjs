/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        body: "var(--font-body-family)",
        heading: "var(--font-heading-family)",
      },
      fontSize: {
        sm: ["var(--font-size-sm)", "1.428"],
        base: ["var(--font-size-base)", "1.5"],
        lg: ["var(--font-size-lg)", "1.555"],
        xl: ["var(--font-size-xl)", "1.4"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem",
        },
        screens: {
          sm: "100%",
          md: "100%",
          lg: "100%",
          xl: "100%",
          "2xl": "1536px",
        },
      },
      colors: {
        base: {
          black: "#000000",
          white: "#FFFFFF",
          gray: "#333333",
          light: "#D9D9D9",
          lighter: "#E5E5E5",
        },
        brand: {
          primary: "#1A1A1A",
          accent: "#FFDE59",
          flower1: "#F69841", // hero flower
          flower2: "#7ACF0E", // gap flower
          flower3: "#87C12F", // faq flower
        },
        surface: {
          card: "#E5E5E5",
          banner: "#5A7F1A",
          review: "#B15249",
        },
        state: {
          info: "#A2A2A2", // e.g. brand SVG
          muted: "#979797", // disclaimer
        },
        overlay: {
          70: "rgba(0, 0, 0, 0.7)", // faq border
          80: "rgba(26, 26, 26, 0.8)", // post-item slug
        },
        rating: {
          stars: "#FFCB45", // review stars
        },
      },
    },
  },
  plugins: [require("daisyui")],
}