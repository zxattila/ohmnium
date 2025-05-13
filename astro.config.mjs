import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";

export default defineConfig({
  integrations: [tailwind(), alpinejs()],
  vite: {
    envPrefix: "WP_", // Only expose variables prefixed with WP_
  },
});
