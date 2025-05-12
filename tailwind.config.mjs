/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      screens: {
        sm: "32em",
        md: "48em",
        lg: "64em",
        xl: "80em",
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
      fontSize: {
        sm: ["var(--font-size-sm)", "1.428"],
        base: ["var(--font-size-base)", "1.5"],
        lg: ["var(--font-size-lg)", "1.555"],
        xl: ["var(--font-size-xl)", "1.4"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
        },
      },
    },
  },
  plugins: [],
};
