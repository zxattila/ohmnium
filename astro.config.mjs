import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";

export default defineConfig({
  site: "https://ohmnium.co.uk",
  integrations: [
    tailwind({
      configFile: "./tailwind.config.mjs",
      applyBaseStyles: false, // Since you're importing styles manually
    }),
    alpinejs(),
  ],
  vite: {
    envPrefix: "WP_", // Only expose variables prefixed with WP_
  },
});
