/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
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
          flower1: "#F69841",
          flower2: "#7ACF0E",
          flower3: "#87C12F",
        },
        surface: {
          card: "#E5E5E5",
          banner: "#5A7F1A",
          review: "#B15249",
        },
        state: {
          info: "#A2A2A2",
          muted: "#979797",
        },
        overlay: {
          70: "rgba(0, 0, 0, 0.7)",
          80: "rgba(26, 26, 26, 0.8)",
        },
        rating: {
          stars: "#FFCB45",
        },
      },
      screens: {
        sm: "32em",
        md: "48em", // 768px
        lg: "64em", // 1024px
        xl: "80em", // 1280px
        "sm-max": { max: "48em" },
        "sm-only": { min: "32em", max: "48em" },
        "md-only": { min: "48em", max: "64em" },
        "lg-only": { min: "64em", max: "80em" },
        "xl-only": { min: "80em", max: "96em" },
      },
      fontFamily: {
        body: "var(--font-body-family)",
        heading: "var(--font-heading-family)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem", // 20px
          md: "2.5rem", // 40px
          lg: "2.5rem", // 40px
        },
        screens: {
          sm: "100%",
          md: "100%",
          lg: "1280px",
          xl: "1280px",
        },
      },
      spacing: {
        2.5: "10px", // Figma 10px
        5: "20px", // Figma 20px
        10: "40px", // Figma 40px
      },
    },
  },
  plugins: [],
};