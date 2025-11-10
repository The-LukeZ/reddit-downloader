import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
    SvelteKitPWA({
      strategies: "generateSW", // Default: generates a service worker automatically
      manifest: {
        name: "EZ Reddit Downloader",
        short_name: "EZ ReddDwn",
        description: "A simple reddit downloader built with SvelteKit",
        theme_color: "#0092b8",
        background_color: "#020618",
        display: "standalone", // Makes it feel like a native app when installed
        start_url: "/",
        icons: [
          {
            src: "/logo_192.png", // Path relative to public folder
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo_512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: ["any", "maskable"], // For adaptive icons on Android
          },
        ],
      },
    }),
  ],
});
